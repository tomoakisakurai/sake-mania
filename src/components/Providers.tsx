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
  useEffect(() => {
    const onResize = () => useStore.getState().patch({ vw: window.innerWidth });
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Sync the Supabase auth session into the store, and load the user's records.
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      const store = useStore.getState();
      store.setUser(mapUser(session?.user));
      if (event === 'SIGNED_OUT') {
        store.setMyRecords([]);
      } else if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        store.loadMyRecords();
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
