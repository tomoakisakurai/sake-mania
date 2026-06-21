import { describe, it, expect, vi } from 'vitest';
import { buildNavModel } from './nav';
import type { RouteState } from './routes';
import type { Screen } from '@/types';

function mkRoute(screen: Screen): RouteState {
  return { screen, detailId: null, kuraName: null, meetupId: null, eventId: null, memberName: null, postRef: null };
}

function mkStore() {
  return {
    nav: vi.fn(),
    requireLogin: vi.fn(() => true),
  };
}

describe('buildNavModel', () => {
  describe('navItems(PC)', () => {
    it('home画面ではhomeがactiveで他は非active', () => {
      const { navItems } = buildNavModel(mkRoute('home'), mkStore());
      const labels = navItems.map((n) => n.label);
      expect(labels).toEqual(['ホーム', 'MEETUP', 'イベント', 'メンバー', 'マイページ']);
      expect(navItems[0].weight).toBe(700);
      expect(navItems[1].weight).toBe(400);
      expect(navItems[2].weight).toBe(400);
    });

    it('meetup詳細画面でも MEETUP タブが active', () => {
      const { navItems } = buildNavModel(mkRoute('meetup'), mkStore());
      const meetupItem = navItems.find((n) => n.label === 'MEETUP')!;
      expect(meetupItem.weight).toBe(700);
    });

    it('meetupCreate / declare でも MEETUP タブが active', () => {
      const meetupItemCreate = buildNavModel(mkRoute('meetupCreate'), mkStore()).navItems.find((n) => n.label === 'MEETUP')!;
      const meetupItemDeclare = buildNavModel(mkRoute('declare'), mkStore()).navItems.find((n) => n.label === 'MEETUP')!;
      expect(meetupItemCreate.weight).toBe(700);
      expect(meetupItemDeclare.weight).toBe(700);
    });

    it('event / eventCreate でも イベント タブが active', () => {
      const event = buildNavModel(mkRoute('event'), mkStore()).navItems.find((n) => n.label === 'イベント')!;
      const create = buildNavModel(mkRoute('eventCreate'), mkStore()).navItems.find((n) => n.label === 'イベント')!;
      expect(event.weight).toBe(700);
      expect(create.weight).toBe(700);
    });
  });

  describe('tabBar(SP)', () => {
    it('tabLeft は ホーム + MEETUP', () => {
      const { tabLeft } = buildNavModel(mkRoute('home'), mkStore());
      expect(tabLeft.map((t) => t.label)).toEqual(['ホーム', 'MEETUP']);
    });

    it('tabRight は イベント + メンバー(マイページは含まない)', () => {
      const { tabRight } = buildNavModel(mkRoute('home'), mkStore());
      expect(tabRight.map((t) => t.label)).toEqual(['イベント', 'メンバー']);
    });
  });

  describe('クリック挙動', () => {
    it('マイページクリックは requireLogin を経由する', () => {
      const store = mkStore();
      const { navItems } = buildNavModel(mkRoute('home'), store);
      const mypage = navItems.find((n) => n.label === 'マイページ')!;
      mypage.click();
      expect(store.requireLogin).toHaveBeenCalledOnce();
      expect(store.nav).toHaveBeenCalledWith('mypage');
    });

    it('requireLogin が false を返したら nav は呼ばれない', () => {
      const store = mkStore();
      store.requireLogin.mockReturnValue(false);
      const { navItems } = buildNavModel(mkRoute('home'), store);
      navItems.find((n) => n.label === 'マイページ')!.click();
      expect(store.nav).not.toHaveBeenCalled();
    });

    it('マイページ以外は requireLogin を呼ばずに nav する', () => {
      const store = mkStore();
      const { navItems } = buildNavModel(mkRoute('home'), store);
      navItems.find((n) => n.label === 'MEETUP')!.click();
      expect(store.requireLogin).not.toHaveBeenCalled();
      expect(store.nav).toHaveBeenCalledWith('meetups');
    });
  });
});
