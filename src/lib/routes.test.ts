import { describe, it, expect } from 'vitest';
import { routeStateFromPath, pathForScreen, paths } from './routes';

describe('routeStateFromPath', () => {
  describe('シンプルな画面', () => {
    it.each([
      ['/', 'home'],
      ['/login', 'login'],
      ['/record', 'record'],
      ['/mypage', 'mypage'],
      ['/feed', 'feed'],
      ['/map', 'map'],
      ['/zukan', 'zukan'],
      ['/meetups', 'meetups'],
      ['/events', 'events'],
      ['/members', 'members'],
      ['/kura/register', 'kuraReg'],
      ['/brand/register', 'brandReg'],
      ['/meetup/create', 'meetupCreate'],
      ['/event/create', 'eventCreate'],
    ])('%s → screen=%s', (path, screen) => {
      expect(routeStateFromPath(path).screen).toBe(screen);
    });
  });

  describe('末尾スラッシュ', () => {
    it('末尾スラッシュを取り除いて解釈する', () => {
      expect(routeStateFromPath('/meetups/').screen).toBe('meetups');
      expect(routeStateFromPath('/events/').screen).toBe('events');
    });

    it('複数のスラッシュも除去', () => {
      expect(routeStateFromPath('/meetups///').screen).toBe('meetups');
    });
  });

  describe('動的ルート', () => {
    it('/zukan/:id → detail + detailId', () => {
      const r = routeStateFromPath('/zukan/kuheiji');
      expect(r.screen).toBe('detail');
      expect(r.detailId).toBe('kuheiji');
    });

    it('/kura/:name → kura + kuraName(URLデコード)', () => {
      const r = routeStateFromPath('/kura/' + encodeURIComponent('久保田酒造'));
      expect(r.screen).toBe('kura');
      expect(r.kuraName).toBe('久保田酒造');
    });

    it('/meetup/:id → meetup + meetupId', () => {
      const r = routeStateFromPath('/meetup/abc-123');
      expect(r.screen).toBe('meetup');
      expect(r.meetupId).toBe('abc-123');
    });

    it('/meetup/:id/declare → declare + meetupId', () => {
      const r = routeStateFromPath('/meetup/abc-123/declare');
      expect(r.screen).toBe('declare');
      expect(r.meetupId).toBe('abc-123');
    });

    it('/event/:id → event + eventId', () => {
      const r = routeStateFromPath('/event/ev-1');
      expect(r.screen).toBe('event');
      expect(r.eventId).toBe('ev-1');
    });

    it('/event/:id/edit → eventEdit + eventId', () => {
      const r = routeStateFromPath('/event/ev-1/edit');
      expect(r.screen).toBe('eventEdit');
      expect(r.eventId).toBe('ev-1');
    });

    it('/member/:id → member + memberId', () => {
      const r = routeStateFromPath('/member/00000000-0000-0000-0000-000000000001');
      expect(r.screen).toBe('member');
      expect(r.memberId).toBe('00000000-0000-0000-0000-000000000001');
    });

    it('/post/mine/3 → post + postRef', () => {
      const r = routeStateFromPath('/post/mine/3');
      expect(r.screen).toBe('post');
      expect(r.postRef).toEqual({ src: 'mine', i: 3 });
    });

    it('/post/public/0 でも認識', () => {
      const r = routeStateFromPath('/post/public/0');
      expect(r.postRef).toEqual({ src: 'public', i: 0 });
    });

    it('/post/<unknown>/N は src=other 扱い', () => {
      const r = routeStateFromPath('/post/foo/5');
      expect(r.postRef).toEqual({ src: 'other', i: 5 });
    });
  });

  describe('未知のpath', () => {
    it('知らないパスは home にフォールバック', () => {
      expect(routeStateFromPath('/unknown-path').screen).toBe('home');
    });
  });
});

describe('pathForScreen', () => {
  it('id-less screen は対応する path を返す', () => {
    expect(pathForScreen('home')).toBe('/');
    expect(pathForScreen('meetups')).toBe('/meetups');
    expect(pathForScreen('meetupCreate')).toBe('/meetup/create');
    expect(pathForScreen('eventCreate')).toBe('/event/create');
    expect(pathForScreen('kuraReg')).toBe('/kura/register');
  });
});

describe('paths', () => {
  it('id付きのpathビルダーは encodeURIComponent する', () => {
    expect(paths.detail('hoge fuga')).toBe('/zukan/hoge%20fuga');
    expect(paths.kura('久保田酒造')).toBe('/kura/' + encodeURIComponent('久保田酒造'));
    expect(paths.meetup('a/b')).toBe('/meetup/' + encodeURIComponent('a/b'));
    expect(paths.event('ev-1')).toBe('/event/ev-1');
    expect(paths.eventEdit('ev-1')).toBe('/event/ev-1/edit');
    expect(paths.declare('m-1')).toBe('/meetup/m-1/declare');
    expect(paths.member('00000000-0000-0000-0000-000000000001')).toBe('/member/00000000-0000-0000-0000-000000000001');
  });

  it('post path はsrc/iを連結(エンコードしない)', () => {
    expect(paths.post('mine', 3)).toBe('/post/mine/3');
  });

  it('routeStateFromPath との往復が一致する(invariant)', () => {
    const id = 'hoge fuga';
    const r = routeStateFromPath(paths.detail(id));
    expect(r.screen).toBe('detail');
    expect(r.detailId).toBe(id);
  });
});
