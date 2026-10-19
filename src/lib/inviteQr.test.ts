import { afterEach, describe, it, expect, vi } from 'vitest';
import { inviteSiteOrigin, renderInviteQrPng } from './inviteQr';

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

describe('renderInviteQrPng', () => {
  it('PNG を返す', async () => {
    const png = await renderInviteQrPng('https://example.com/login?invite=x');
    expect([...png.subarray(0, 8)]).toEqual(PNG_SIGNATURE);
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
