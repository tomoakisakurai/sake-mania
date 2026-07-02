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

test.describe('ヘッダー(SP)', () => {
  test.skip(({ isMobile }) => !isMobile, 'SPのみ');

  // ハンバーガーメニューの開閉は loggedIn 時のみ描画されるため、
  // 認証E2E(別issue)で扱う。ここでは未ログインのSPヘッダーを確認する。
  test('未ログインのSPはハンバーガーが出ず、ログインボタンが出る', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('ログイン', { exact: true }).first()).toBeVisible();
    // ハンバーガー(3本線アイコン)は描画されていないこと。
    // Nav.tsx のハンバーガーは bg-ink の3本線spanで構成される。
    await expect(page.locator('span.bg-ink')).toHaveCount(0);
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
    // URLだけでなく、UIに選択中パネルが復元されていることを確認する。
    // HometownPanel は該当メンバー0人でも「{県名} 出身のメンバー」見出しを出す。
    await expect(page.getByRole('heading', { name: '東京 出身のメンバー' })).toBeVisible();
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
