'use client';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store';
import { routeStateFromPath } from '@/lib/routes';
import { buildNavModel, buildMenuItems } from '@/lib/nav';

// Nav / TabBar / Providers(chrome) 共有のビューモデル。
// useVals から移設(useVals解体 #29)。
export function useNavVals() {
  const store = useStore();
  const pathname = usePathname();
  const route = routeStateFromPath(pathname || '/');
  const isMobile = useStore((s) => s.vw < 760);
  const user = useStore((s) => s.user);

  const { navItems, tabLeft, tabRight } = buildNavModel(route, store);

  return {
    navItems, tabLeft, tabRight,
    menuItems: buildMenuItems(store, user?.isAdmin ?? false),
    goHome: () => store.nav('home'),
    goZukan: () => store.nav('zukan'),
    goMy: () => { if (store.requireLogin()) store.nav('mypage'); },
    goLogin: () => store.nav('login'),
    doLogout: () => store.logout(),
    startRecordClick: () => store.startRecord(null),
    loggedIn: !!user, loggedOut: !user,
    userAvatar: user?.avatar ?? '',
    showChrome: route.screen !== 'login',
    // ログイン画面はSPでもchrome(タブバー)を出さない
    isMobile: isMobile && route.screen !== 'login',
    isDesktopNav: !isMobile,
  };
}

export type NavVals = ReturnType<typeof useNavVals>;
