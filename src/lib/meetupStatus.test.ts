import { describe, it, expect } from 'vitest';
import { isMeetupOngoing } from './meetupStatus';

describe('isMeetupOngoing', () => {
  // ローカル日付の固定値: 2026-06-21
  const onSameDay = new Date(2026, 5, 21, 12, 0, 0);     // 当日 12:00
  const onSameDayStart = new Date(2026, 5, 21, 0, 0, 0); // 当日 0:00:00
  const onSameDayEnd = new Date(2026, 5, 21, 23, 59, 59);// 当日 23:59:59
  const dayBefore = new Date(2026, 5, 20, 23, 59, 59);   // 前日 23:59:59
  const dayAfter = new Date(2026, 5, 22, 0, 0, 0);       // 翌日 0:00:00

  it('eventDate が当日なら true (昼)', () => {
    expect(isMeetupOngoing('2026-06-21', onSameDay)).toBe(true);
  });

  it('eventDate が当日の 0:00:00 ぴったりでも true', () => {
    expect(isMeetupOngoing('2026-06-21', onSameDayStart)).toBe(true);
  });

  it('eventDate が当日の 23:59:59 でも true', () => {
    expect(isMeetupOngoing('2026-06-21', onSameDayEnd)).toBe(true);
  });

  it('前日の 23:59:59 (eventDate=翌日) は false', () => {
    expect(isMeetupOngoing('2026-06-21', dayBefore)).toBe(false);
  });

  it('翌日の 0:00:00 (eventDate=前日) は false', () => {
    expect(isMeetupOngoing('2026-06-21', dayAfter)).toBe(false);
  });

  it('eventDate が null なら false', () => {
    expect(isMeetupOngoing(null, onSameDay)).toBe(false);
  });

  it('eventDate が undefined なら false', () => {
    expect(isMeetupOngoing(undefined, onSameDay)).toBe(false);
  });

  it('eventDate が空文字なら false', () => {
    expect(isMeetupOngoing('', onSameDay)).toBe(false);
  });

  it('eventDate の書式が壊れていたら false', () => {
    expect(isMeetupOngoing('not-a-date', onSameDay)).toBe(false);
    expect(isMeetupOngoing('2026/06/21', onSameDay)).toBe(false);
  });

  it('1ヶ月先の日付は false', () => {
    expect(isMeetupOngoing('2026-07-21', onSameDay)).toBe(false);
  });

  it('1ヶ月前の日付は false', () => {
    expect(isMeetupOngoing('2026-05-21', onSameDay)).toBe(false);
  });

  it('1年違いは false (年判定が効いている)', () => {
    expect(isMeetupOngoing('2025-06-21', onSameDay)).toBe(false);
    expect(isMeetupOngoing('2027-06-21', onSameDay)).toBe(false);
  });
});
