import { describe, it, expect } from 'vitest';
import { inviteSlackPost } from './inviteSlackPost';
import { INVITE_QR_ALT } from './signupGate';

const INPUT = {
  label: '10月の会',
  expiresLabel: '2026/10/26まで',
  url: 'https://sake.example.com/login?invite=abc',
  qrUrl: 'https://sake.example.com/api/invite-qr?token=abc',
};

describe('inviteSlackPost', () => {
  it('text は招待リンクの文面', () => {
    expect(inviteSlackPost(INPUT).text).toBe(
      '🍶 酒マニアの招待リンクです(ラベル: 10月の会、期限: 2026/10/26まで)\nhttps://sake.example.com/login?invite=abc',
    );
  });

  it('ラベルが空なら「なし」', () => {
    expect(inviteSlackPost({ ...INPUT, label: '', expiresLabel: '無期限' }).text).toBe(
      '🍶 酒マニアの招待リンクです(ラベル: なし、期限: 無期限)\nhttps://sake.example.com/login?invite=abc',
    );
  });

  it('blocks は text と同じ文の section と、QR の image', () => {
    const post = inviteSlackPost(INPUT);
    expect(post.blocks).toEqual([
      { type: 'section', text: { type: 'mrkdwn', text: post.text } },
      { type: 'image', image_url: INPUT.qrUrl, alt_text: INVITE_QR_ALT },
    ]);
  });
});
