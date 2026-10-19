import { describe, it, expect } from 'vitest';
import { inviteUrl, isInviteActive, signupErrorMessage } from './signupGate';

describe('inviteUrl', () => {
  it('/login?invite=<token> を組み立てる', () => {
    expect(inviteUrl('https://sake.example.com', 'abc_DEF-123')).toBe('https://sake.example.com/login?invite=abc_DEF-123');
  });

  it('トークンは encodeURIComponent する', () => {
    expect(inviteUrl('http://localhost:5174', 'a+b/c=d&e')).toBe('http://localhost:5174/login?invite=a%2Bb%2Fc%3Dd%26e');
  });
});

describe('signupErrorMessage', () => {
  it('トリガー拒否は招待リンクの案内にする(例外文そのまま・Database error に包まれた形の両方)', () => {
    const expected = '登録できませんでした。新規登録には幹事からの招待リンクが必要です(リンクが失効している場合もあります)';
    expect(signupErrorMessage('signup_gate: invite required')).toBe(expected);
    expect(signupErrorMessage('signup_gate: invite invalid')).toBe(expected);
    expect(signupErrorMessage('Database error saving new user')).toBe(expected);
  });

  it('登録済みのメールアドレスはログインを案内する', () => {
    expect(signupErrorMessage('User already registered')).toBe('このメールアドレスは登録済みです。ログインしてください');
    expect(signupErrorMessage('User already exists')).toBe('このメールアドレスは登録済みです。ログインしてください');
  });

  it('それ以外は元のメッセージを添える', () => {
    expect(signupErrorMessage('Password should be at least 6 characters')).toBe(
      '登録に失敗しました: Password should be at least 6 characters',
    );
  });
});

describe('isInviteActive', () => {
  const now = new Date('2026-10-19T12:00:00Z');
  const base = { revokedAt: null, expiresAt: null, maxUses: null, usedCount: 0 };

  it('無期限・無制限なら true', () => {
    expect(isInviteActive(base, now)).toBe(true);
  });

  it('失効済みなら false', () => {
    expect(isInviteActive({ ...base, revokedAt: new Date('2026-10-18T00:00:00Z') }, now)).toBe(false);
  });

  it('期限ちょうどは false(トリガーは expires_at > now() のときだけ通す)', () => {
    expect(isInviteActive({ ...base, expiresAt: now }, now)).toBe(false);
  });

  it('期限の1ミリ秒前なら true', () => {
    expect(isInviteActive({ ...base, expiresAt: new Date(now.getTime() + 1) }, now)).toBe(true);
  });

  it('使用回数が上限に達したら false、上限未満なら true', () => {
    expect(isInviteActive({ ...base, maxUses: 3, usedCount: 3 }, now)).toBe(false);
    expect(isInviteActive({ ...base, maxUses: 3, usedCount: 2 }, now)).toBe(true);
  });
});
