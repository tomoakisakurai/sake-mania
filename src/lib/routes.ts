// Single source of truth for the URL <-> screen-state mapping.
// The URL is authoritative; screens derive their view-models from the
// parsed route (and per-screen hooks).
import type { Screen, PostRef } from '@/types';

export interface RouteState {
  screen: Screen;
  detailId: string | null;
  kuraName: string | null;
  meetupId: string | null;
  eventId: string | null;
  memberId: string | null; // = profiles.id(nickname は改名で切れるためキーにしない)
  postRef: PostRef | null;
}

/** Parse a Next.js pathname into screen + ids. */
export function routeStateFromPath(pathname: string): RouteState {
  const base: RouteState = { screen: 'home', detailId: null, kuraName: null, meetupId: null, eventId: null, memberId: null, postRef: null };
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
  if (p === '/brand/register') return { ...base, screen: 'brandReg' };
  if (seg[0] === 'kura' && seg[1]) return { ...base, screen: 'kura', kuraName: decodeURIComponent(seg[1]) };
  if (p === '/meetup/create') return { ...base, screen: 'meetupCreate' };
  if (p === '/events') return { ...base, screen: 'events' };
  if (p === '/members') return { ...base, screen: 'members' };
  if (seg[0] === 'member' && seg[1]) return { ...base, screen: 'member', memberId: decodeURIComponent(seg[1]) };
  if (p === '/event/create') return { ...base, screen: 'eventCreate' };
  if (seg[0] === 'event' && seg[1] && seg[2] === 'edit') return { ...base, screen: 'eventEdit', eventId: decodeURIComponent(seg[1]) };
  if (seg[0] === 'event' && seg[1]) return { ...base, screen: 'event', eventId: decodeURIComponent(seg[1]) };
  if (seg[0] === 'meetup' && seg[1] && seg[2] === 'declare') return { ...base, screen: 'declare', meetupId: decodeURIComponent(seg[1]) };
  if (seg[0] === 'meetup' && seg[1] && seg[2] === 'edit') return { ...base, screen: 'meetupEdit', meetupId: decodeURIComponent(seg[1]) };
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
    case 'meetupCreate': return '/meetup/create';
    case 'events': return '/events';
    case 'eventCreate': return '/event/create';
    case 'members': return '/members';
    case 'kuraReg': return '/kura/register';
    case 'brandReg': return '/brand/register';
    default: return '/';
  }
}

export const paths = {
  detail: (id: string) => `/zukan/${encodeURIComponent(id)}`,
  post: (src: string, i: number) => `/post/${src}/${i}`,
  kura: (name: string) => `/kura/${encodeURIComponent(name)}`,
  meetup: (id: string) => `/meetup/${encodeURIComponent(id)}`,
  meetupEdit: (id: string) => `/meetup/${encodeURIComponent(id)}/edit`,
  declare: (id: string) => `/meetup/${encodeURIComponent(id)}/declare`,
  event: (id: string) => `/event/${encodeURIComponent(id)}`,
  eventEdit: (id: string) => `/event/${encodeURIComponent(id)}/edit`,
  member: (id: string) => `/member/${encodeURIComponent(id)}`,
};
