import { afterEach, describe, it, expect, vi } from 'vitest';
import { inviteSiteOrigin, renderInviteQrPng } from './inviteQr';

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

// PNG の IHDR チャンクの幅(バイト 16〜19、ビッグエンディアン)
const pngWidth = (png: Buffer) => png.readUInt32BE(16);

describe('renderInviteQrPng', () => {
  it('PNG を返す', async () => {
    const png = await renderInviteQrPng('https://example.com/login?invite=x');
    expect([...png.subarray(0, 8)]).toEqual(PNG_SIGNATURE);
  });

  it('既定(large)は 480px、small は 200px', async () => {
    expect(pngWidth(await renderInviteQrPng('https://example.com/login?invite=x'))).toBe(480);
    expect(pngWidth(await renderInviteQrPng('https://example.com/login?invite=x', 'small'))).toBe(200);
  });
});

describe('inviteSiteOrigin', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // 開発機の .env の値が残らないよう、2つとも stub する
  it('NEXT_PUBLIC_SITE_URL があればその値', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://sake.example.com');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'sake.vercel.app');
    expect(inviteSiteOrigin()).toBe('https://sake.example.com');
  });

  it('VERCEL_PROJECT_PRODUCTION_URL だけなら https:// を付けた値', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'sake.vercel.app');
    expect(inviteSiteOrigin()).toBe('https://sake.vercel.app');
  });

  it('どちらも無ければローカル開発の localhost', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '');
    expect(inviteSiteOrigin()).toBe('http://localhost:5174');
  });
});
