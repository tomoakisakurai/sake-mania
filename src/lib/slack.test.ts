import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { postToSlack, type SlackBlock } from './slack';

const WEBHOOK_URL = 'https://hooks.slack.example.com/services/test';
const BLOCKS: SlackBlock[] = [
  { type: 'section', text: { type: 'mrkdwn', text: 'hello' } },
  { type: 'image', image_url: 'https://sake.example.com/api/invite-qr?token=abc', alt_text: 'QR' },
];

const fetchMock = vi.fn();

function respondWith(...statuses: number[]) {
  for (const status of statuses) {
    fetchMock.mockResolvedValueOnce(new Response(status === 200 ? 'ok' : 'error', { status }));
  }
}

function sentPayload(callIndex: number): Record<string, unknown> {
  return JSON.parse(fetchMock.mock.calls[callIndex][1].body as string);
}

describe('postToSlack', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('SLACK_WEBHOOK_URL', WEBHOOK_URL);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('blocks なしなら text だけを送る', async () => {
    respondWith(200);
    await postToSlack('hello');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(WEBHOOK_URL);
    expect(sentPayload(0)).toEqual({ text: 'hello' });
  });

  it('blocks ありなら blocks を付け、本文のリンクは展開させない', async () => {
    respondWith(200);
    await postToSlack('hello', BLOCKS);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sentPayload(0)).toEqual({ text: 'hello', blocks: BLOCKS, unfurl_links: false, unfurl_media: false });
  });

  it('blocks ありで 400 なら text だけで1回再送する', async () => {
    respondWith(400, 200);
    await postToSlack('hello', BLOCKS);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(sentPayload(1)).toEqual({ text: 'hello' });
  });

  it('再送も失敗したらそれ以上は送らない', async () => {
    respondWith(400, 400);
    await postToSlack('hello', BLOCKS);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it.each([403, 429, 500])('blocks ありで %d なら再送しない', async (status) => {
    respondWith(status);
    await postToSlack('hello', BLOCKS);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('blocks なしで 400 なら再送しない', async () => {
    respondWith(400);
    await postToSlack('hello');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('ネットワークの例外は投げずに終える', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    await expect(postToSlack('hello', BLOCKS)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('SLACK_WEBHOOK_URL 未設定なら送らない', async () => {
    vi.stubEnv('SLACK_WEBHOOK_URL', '');
    await postToSlack('hello', BLOCKS);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
