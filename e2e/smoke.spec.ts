import { test, expect } from '@playwright/test';

// 未ログイン状態で各画面が落ちずに描画されることだけ確認するスモーク。
// 認証が必要な動作(プロフィール編集・記録投稿・参加トグル)は別specで扱う。

const PUBLIC_PAGES = [
  { path: '/', heading: /酒マニア|SAKE MANIA/ },
  { path: '/zukan', heading: /図鑑|銘柄/ },
  { path: '/meetups', heading: /SAKE MEETUP/ },
  { path: '/events', heading: /酒イベント情報|EVENTS/ },
  { path: '/members', heading: /メンバー出身地マップ/ },
  { path: '/map', heading: /酒蔵マップ/ },
  { path: '/feed', heading: /みんなの利き酒帳/ },
  { path: '/login', heading: /酒マニア|SAKE MANIA/ },
] as const;

for (const page of PUBLIC_PAGES) {
  test(`公開画面が描画される: ${page.path}`, async ({ page: pw }) => {
    const response = await pw.goto(page.path);
    expect(response?.status() ?? 0).toBeLessThan(500);
    await expect(pw.getByText(page.heading).first()).toBeVisible();
  });
}

test('ホームのナビからMEETUP一覧に遷移できる(PC)', async ({ page, isMobile }) => {
  test.skip(isMobile, 'PCナビ用のテスト(SPはハンバーガー)');
  await page.goto('/');
  // ヘッダーのナビ項目は最初に登場する MEETUP テキスト
  await page.getByText('MEETUP', { exact: true }).first().click();
  await expect(page).toHaveURL(/\/meetups$/);
  await expect(page.getByText('SAKE MEETUP', { exact: false }).first()).toBeVisible();
});

test('未ログインでも銘柄図鑑が開ける', async ({ page }) => {
  await page.goto('/zukan');
  await expect(page).toHaveURL(/\/zukan$/);
  // ログインボタンがナビに見える(loggedOut)
  await expect(page.getByText('ログイン').first()).toBeVisible();
});
