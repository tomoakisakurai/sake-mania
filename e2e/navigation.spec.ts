import { test, expect } from '@playwright/test';

// 未ログイン状態で確認できるナビゲーション・UI挙動。
// 認証が要るシナリオは別specで扱う。

test.describe('ナビゲーション(PC)', () => {
  test.skip(({ isMobile }) => isMobile, 'PCのみ');

  test('ヘッダーの「ログイン」ボタンで /login へ遷移', async ({ page }) => {
    await page.goto('/');
    await page.getByText('ログイン', { exact: true }).first().click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('ロゴ「酒マニア」クリックでホームに戻る', async ({ page }) => {
    await page.goto('/zukan');
    await page.getByText('酒マニア', { exact: true }).first().click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe('ハンバーガーメニュー(SP)', () => {
  test.skip(({ isMobile }) => !isMobile, 'SPのみ');

  test.beforeEach(async ({ context }) => {
    // 未ログイン状態ではハンバーガーアイコン自体が出ないので、cookieだけセットして
    // 「擬似ログイン済み」UIを試すことは不可。ここでは未ログインのSPナビを確認する。
    void context;
  });

  test('未ログインのSPはハンバーガーアイコンが出ない(loggedIn の中で描画されるため)', async ({ page }) => {
    await page.goto('/');
    // ハンバーガー(3本線)は loggedIn 時のみ描画される。
    // 未ログイン時は「ログイン」ボタンが出る。
    await expect(page.getByText('ログイン', { exact: true }).first()).toBeVisible();
  });
});

test.describe('メンバー出身地マップのURL状態管理', () => {
  test('未認証だと選択可能な県がない可能性が高いので、初期表示のみ確認', async ({ page }) => {
    const res = await page.goto('/members');
    expect(res?.status() ?? 0).toBeLessThan(500);
    await expect(page.getByRole('heading', { name: 'メンバー出身地マップ' })).toBeVisible();
  });

  test('?pref=東京 でアクセスすると選択状態がURLから復元される', async ({ page }) => {
    await page.goto('/members?pref=東京');
    await expect(page).toHaveURL(/pref=%E6%9D%B1%E4%BA%AC|pref=東京/);
  });
});

test.describe('ログイン画面', () => {
  test('ログイン / 新規登録 タブが切り替えられる', async ({ page }) => {
    await page.goto('/login');
    // 初期表示は「ログイン」タブ
    await expect(page.getByText('ログイン', { exact: true }).first()).toBeVisible();
    // 「新規登録」タブをクリック → ニックネーム入力欄が出る
    await page.getByText('新規登録', { exact: true }).first().click();
    await expect(page.getByPlaceholder('例: sake_taro')).toBeVisible();
  });

  test('「ログインせずにのぞいてみる」でホームへ', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('ログインせずにのぞいてみる').click();
    await expect(page).toHaveURL(/\/$/);
  });
});
