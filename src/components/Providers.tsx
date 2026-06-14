'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { useVals } from '@/useVals';
import { routeStateFromPath } from '@/lib/routes';
import { getSupabaseBrowser, mapUser } from '@/lib/supabase/client';
import type { ReferenceData } from '@/lib/getReferenceData';
import { Nav } from './Nav';
import { TabBar } from './TabBar';
import { Toast } from './Toast';

const ValsContext = createContext<any>(null);
export function useV(): any { return useContext(ValsContext); }

export function Providers({ initialData, children }: { initialData: ReferenceData; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const route = routeStateFromPath(pathname || '/');
  const v = useVals(route, initialData);

  // Bridge store navigation to the Next.js router.
  useEffect(() => {
    useStore.getState().setNavigate((p: string) => router.push(p));
  }, [router]);

  // Track viewport width after mount (avoids SSR hydration mismatch).
  // DevTools responsive mode does not always fire a window `resize` when the
  // Dimensions change, so we also listen to matchMedia (fires on crossing the
  // breakpoint) and visualViewport resize for reliable detection.
  useEffect(() => {
    const update = () => useStore.getState().patch({
      vw: document.documentElement.clientWidth || window.innerWidth,
    });
    update();
    const mq = window.matchMedia('(max-width: 759px)');
    mq.addEventListener('change', update);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      mq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  // Public feed (みんなの利き酒帳) + MEETUP一覧 — visible to everyone, incl. guests.
  useEffect(() => {
    (async () => {
      const store = useStore.getState();
      await store.loadPublicRecords();
      await store.loadSocial();
      store.loadMeetups();
    })();
  }, []);

  // 開いているMEETUPの詳細をルートから読み込む
  useEffect(() => {
    const { screen, meetupId } = route;
    if ((screen === 'meetup' || screen === 'declare') && meetupId) {
      useStore.getState().loadMeetupDetail(meetupId);
    }
  }, [route.screen, route.meetupId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync the Supabase auth session into the store, and load the user's data.
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      const store = useStore.getState();
      store.setUser(mapUser(session?.user));
      if (event === 'SIGNED_OUT') {
        store.setMyRecords([]);
        await store.loadSocial();
        store.loadMeetups();
      } else if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        await store.loadMyRecords();
        await store.loadSocial();
        store.loadMeetups();
        const mid = routeStateFromPath(pathname || '/').meetupId;
        if (mid) store.loadMeetupDetail(mid);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <ValsContext.Provider value={v}>
      <div style={{ minHeight: '100vh', background: '#F6F1E7', fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24' }}>
        {v.showChrome && <Nav v={v} />}
        {children}
        {v.isMobile && <TabBar v={v} />}
        {v.toastVisible && <Toast message={v.toastMsg} />}
      </div>
    </ValsContext.Provider>
  );
}
