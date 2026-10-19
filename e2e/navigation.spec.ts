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

test.describe('メンバー画面はログイン必須', () => {
  test('未認証で /members を開くとログイン案内が出る', async ({ page }) => {
    const res = await page.goto('/members');
    expect(res?.status() ?? 0).toBeLessThan(500);
    await expect(page.getByRole('heading', { name: 'メンバー出身地マップ' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ログインが必要です' })).toBeVisible();
  });

  test('未認証で ?pref=東京 を開いても出身者パネルは出ずログイン案内が出る', async ({ page }) => {
    await page.goto('/members?pref=東京');
    await expect(page.getByRole('heading', { name: 'ログインが必要です' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '東京 出身のメンバー' })).toHaveCount(0);
  });

  test('未認証でメンバー詳細を開くとログイン案内が出る', async ({ page }) => {
    const res = await page.goto('/member/00000000-0000-0000-0000-000000000000');
    expect(res?.status() ?? 0).toBeLessThan(500);
    await expect(page.getByRole('heading', { name: 'ログインが必要です' })).toBeVisible();
  });
});

test.describe('招待リンク画面は管理者のみ', () => {
  test('未認証で /admin/invites を開くと管理者のみの案内が出る', async ({ page }) => {
    const res = await page.goto('/admin/invites');
    expect(res?.status() ?? 0).toBeLessThan(500);
    await expect(page.getByRole('heading', { name: '管理者のみ' })).toBeVisible();
  });
});

test.describe('ログイン画面', () => {
  test('招待リンクから開くと新規登録タブで始まり、ログインタブに切り替えられる', async ({ page }) => {
    await page.goto('/login?invite=test-token_123');
    // 招待リンクからは「新規登録」タブで始まる → ニックネーム入力欄が出ている
    await expect(page.getByPlaceholder('例: sake_taro')).toBeVisible();
    // 「ログイン」タブをクリック → ニックネーム入力欄が消える
    await page.getByText('ログイン', { exact: true }).first().click();
    await expect(page.getByPlaceholder('例: sake_taro')).toHaveCount(0);
  });

  test('「ログインせずにのぞいてみる」でホームへ', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('ログインせずにのぞいてみる').click();
    await expect(page).toHaveURL(/\/$/);
  });
});
