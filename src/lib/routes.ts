// Single source of truth for the URL <-> screen-state mapping.
// The URL is authoritative; the store mirrors the parsed result so that
// useVals (and the screen flags) keep working unchanged.
import type { Screen, PostRef } from '@/types';

export interface RouteState {
  screen: Screen;
  detailId: string | null;
  kuraName: string | null;
  meetupId: string | null;
  postRef: PostRef | null;
}

/** Parse a Next.js pathname into screen + ids. */
export function routeStateFromPath(pathname: string): RouteState {
  const base: RouteState = { screen: 'home', detailId: null, kuraName: null, meetupId: null, postRef: null };
  const p = pathname.replace(/\/+$/, '') || '/';
  const seg = p.split('/').filter(Boolean);

  if (p === '/') return { ...base, screen: 'home' };
  if (p === '/login') return { ...base, screen: 'login' };
  if (p === '/record') return { ...base, screen: 'record' };
  if (p === '/mypage') return { ...base, screen: 'mypage' };
  if (p === '/feed') return { ...base, screen: 'feed' };
  if (p === '/map') return { ...base, screen: 'map' };
  if (p === '/zukan') return { ...base, screen: 'zukan' };
  if (p === '/meetups') return { ...base, screen: 'meetups' };
  if (seg[0] === 'zukan' && seg[1]) return { ...base, screen: 'detail', detailId: decodeURIComponent(seg[1]) };
  if (seg[0] === 'post' && seg[1] && seg[2] != null) {
    const src = seg[1] === 'mine' ? 'mine' : seg[1] === 'public' ? 'public' : 'other';
    return { ...base, screen: 'post', postRef: { src, i: Number(seg[2]) } };
  }
  if (p === '/kura/register') return { ...base, screen: 'kuraReg' };
  if (seg[0] === 'kura' && seg[1]) return { ...base, screen: 'kura', kuraName: decodeURIComponent(seg[1]) };
  if (p === '/meetup/create') return { ...base, screen: 'eventCreate' };
  if (seg[0] === 'meetup' && seg[1] && seg[2] === 'declare') return { ...base, screen: 'declare', meetupId: decodeURIComponent(seg[1]) };
  if (seg[0] === 'meetup' && seg[1]) return { ...base, screen: 'meetup', meetupId: decodeURIComponent(seg[1]) };

  return base;
}

/** Path for the simple, id-less screens used by the generic nav(screen). */
export function pathForScreen(screen: Screen): string {
  switch (screen) {
    case 'home': return '/';
    case 'login': return '/login';
    case 'zukan': return '/zukan';
    case 'meetups': return '/meetups';
    case 'map': return '/map';
    case 'feed': return '/feed';
    case 'mypage': return '/mypage';
    case 'record': return '/record';
    case 'eventCreate': return '/meetup/create';
    case 'kuraReg': return '/kura/register';
    default: return '/';
  }
}

export const paths = {
  detail: (id: string) => `/zukan/${encodeURIComponent(id)}`,
  post: (src: string, i: number) => `/post/${src}/${i}`,
  kura: (name: string) => `/kura/${encodeURIComponent(name)}`,
  meetup: (id: string) => `/meetup/${encodeURIComponent(id)}`,
  declare: (id: string) => `/meetup/${encodeURIComponent(id)}/declare`,
};
