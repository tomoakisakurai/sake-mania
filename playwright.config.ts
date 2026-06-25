import { defineConfig, devices } from '@playwright/test';

// E2E用設定。webServer で `yarn dev` を自動起動して /5174 をテストする。
// CI でも同じ設定で動かすため reuseExistingServer は CI で false に。
const PORT = 5174;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    // モバイルもChromium上でviewportだけ切替(webkit/firefoxの追加DLを避ける)
    { name: 'chromium-mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'yarn dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'pipe',
  },
});
