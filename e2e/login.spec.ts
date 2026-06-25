import { test, expect, type Route } from '@playwright/test';

// ログインフォームの挙動(クライアント側のみ)。
// Supabase API レスポンスを page.route でモックして、cookie 注入なしで
// 確認できる範囲(入力バリデーション・失敗時のエラー表示・成功時のAPI呼び出し)
// だけを検証する。ログイン後のマイページ等は server-side で auth.getUser()
// が動くため、本物の cookie が必要になり別途検討する。

// .env.local の NEXT_PUBLIC_SUPABASE_URL を直接知らなくても、Supabase の
// パスワードログインは必ず `/auth/v1/token?grant_type=password` を叩くため、
// URL末尾でマッチングする。
const TOKEN_ROUTE = /\/auth\/v1\/token\?.*grant_type=password/;

test('メールアドレス未入力ならflashエラーが出る', async ({ page }) => {
  await page.goto('/login');
  // 何も入力せずに「ログイン」ボタン押下
  await page.getByText('ログイン', { exact: true }).nth(1).click(); // [タブ, CTAボタン]の2つ目
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
  await page.getByText('ログイン', { exact: true }).nth(1).click();
  await expect(page.getByText('ログインに失敗しました', { exact: false })).toBeVisible();
});

test('新規登録タブで未入力ならflashエラー', async ({ page }) => {
  await page.goto('/login');
  await page.getByText('新規登録', { exact: true }).first().click();
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
  await page.getByText('ログイン', { exact: true }).nth(1).click();
  // signInWithPassword が叩かれることだけ確認(server側のフロー検証は別途)
  await expect.poll(() => called).toBe(true);
});
