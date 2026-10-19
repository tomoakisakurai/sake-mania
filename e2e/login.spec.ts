import { test, expect, type Page, type Route } from '@playwright/test';

// ログインフォームの挙動(クライアント側のみ)。
// Supabase API レスポンスを page.route でモックして、cookie 注入なしで
// 確認できる範囲(入力バリデーション・失敗時のエラー表示・成功時のAPI呼び出し)
// だけを検証する。ログイン後のマイページ等は server-side で auth.getUser()
// が動くため、本物の cookie が必要になり別途検討する。

// .env.local の NEXT_PUBLIC_SUPABASE_URL を直接知らなくても、Supabase の
// パスワードログインは必ず `/auth/v1/token?grant_type=password` を叩くため、
// URL末尾でマッチングする。
const TOKEN_ROUTE = /\/auth\/v1\/token\?.*grant_type=password/;

// 招待リンクの有効性確認(/api/invite-status)は本物の DB を見るので、テストでは結果を差し替える
async function mockInviteStatus(page: Page, active: boolean) {
  await page.route(/\/api\/invite-status/, (route: Route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ active }) }));
}

test('メールアドレス未入力ならflashエラーが出る', async ({ page }) => {
  await page.goto('/login');
  // 何も入力せずに「ログイン」ボタン押下
  await page.getByText('ログイン', { exact: true }).click(); // 招待リンクなしではタブが無く、CTAボタンだけ
  await expect(page.getByText('メールアドレスとパスワードを入力してください')).toBeVisible();
});

test('不正な認証情報ならエラーが flash に出る', async ({ page }) => {
  // Supabase の signInWithPassword を 400 + invalid credentials でmock
  await page.route(TOKEN_ROUTE, (route: Route) => {
    return route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'invalid_grant', error_description: 'Invalid login credentials' }),
    });
  });

  await page.goto('/login');
  await page.getByPlaceholder('you@example.com').fill('wrong@example.com');
  await page.getByPlaceholder('••••••••').fill('wrongpassword');
  await page.getByText('ログイン', { exact: true }).click();
  await expect(page.getByText('ログインに失敗しました', { exact: false })).toBeVisible();
});

test('招待リンクから開いた新規登録で未入力ならflashエラー', async ({ page }) => {
  await mockInviteStatus(page, true);
  await page.goto('/login?invite=test-token_123');
  // メールパスワード未入力で「登録してはじめる」を押下
  await page.getByText('登録してはじめる', { exact: true }).click();
  await expect(page.getByText('メールアドレスとパスワードを入力してください')).toBeVisible();
});

test('signInWithPassword 成功時に Supabase API が叩かれる', async ({ page }) => {
  // 成功時の cookie 注入は別途必要(ログイン後フローは server-side で
  // auth.getUser() が動くため本物 cookie がいる)。ここでは「正しい
  // パラメータで API が呼ばれる」ことだけ確認する。
  let called = false;
  await page.route(TOKEN_ROUTE, async (route: Route) => {
    called = true;
    const body = JSON.parse(route.request().postData() || '{}');
    expect(body.email).toBe('test@example.com');
    // 適当な成功レスポンス(以降の server 確認はテスト範囲外)
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'fake',
        refresh_token: 'fake',
        token_type: 'bearer',
        expires_in: 3600,
        user: { id: '00000000-0000-0000-0000-000000000000', email: 'test@example.com' },
      }),
    });
  });
  await page.goto('/login');
  await page.getByPlaceholder('you@example.com').fill('test@example.com');
  await page.getByPlaceholder('••••••••').fill('password');
  await page.getByText('ログイン', { exact: true }).click();
  // signInWithPassword が叩かれることだけ確認(server側のフロー検証は別途)
  await expect.poll(() => called).toBe(true);
});

const SIGNUP_ROUTE = /\/auth\/v1\/signup/;

test('新規登録: 招待リンクなしで開くと新規登録タブもフォームも出さない', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByText('新規登録は幹事から共有される招待リンク(QR コード)から行えます。')).toBeVisible();
  await expect(page.getByText('新規登録', { exact: true })).toHaveCount(0);
  await expect(page.getByPlaceholder('例: sake_taro')).toHaveCount(0);
  await expect(page.getByText('登録してはじめる', { exact: true })).toHaveCount(0);
});

test('新規登録: 失効などで使えない招待リンクなら登録フォームを出さずに案内する', async ({ page }) => {
  await mockInviteStatus(page, false);
  await page.goto('/login?invite=revoked-token');
  await expect(page.getByText('この招待リンクは使えません(失効・期限切れの可能性があります)。幹事に新しいリンクをもらってください')).toBeVisible();
  await expect(page.getByText('新規登録', { exact: true })).toHaveCount(0);
  await expect(page.getByPlaceholder('例: sake_taro')).toHaveCount(0);
});

test('新規登録: 招待リンクで開くと招待トークンを metadata に載せて signUp する', async ({ page }) => {
  const captured: { body: { data?: Record<string, unknown> } | null } = { body: null };
  await page.route(SIGNUP_ROUTE, (route: Route) => {
    captured.body = JSON.parse(route.request().postData() || '{}');
    return route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ code: 500, error_code: 'unexpected_failure', msg: 'Database error saving new user' }),
    });
  });
  await mockInviteStatus(page, true);
  await page.goto('/login?invite=test-token_123');
  await expect(page.getByText('招待リンクから登録中')).toBeVisible();
  await page.getByPlaceholder('you@example.com').fill('taro@example.com');
  await page.getByPlaceholder('••••••••').fill('password');
  await page.getByText('登録してはじめる', { exact: true }).click();
  await expect(page.getByText('登録できませんでした。新規登録には幹事からの招待リンクが必要です(リンクが失効している場合もあります)')).toBeVisible();
  expect(captured.body?.data?.invite_token).toBe('test-token_123');
});
