'use client';
import { createContext, useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { useVals } from '@/useVals';
import type { Vals } from '@/useVals';
import { routeStateFromPath } from '@/lib/routes';
import { getSupabaseBrowser, mapUser } from '@/lib/supabase/client';
import { getIsAdmin } from '@/app/actions/profile';
import type { CoreReferenceData, DeferredReferenceData, ReferenceData } from '@/lib/getReferenceData';
import { Nav } from './Nav';
import { TabBar } from './TabBar';
import { Toast } from './Toast';

const ValsContext = createContext<Vals | null>(null);
export function useV(): Vals { return useContext(ValsContext) as Vals; }

// 後追い取得分の初期値（mount後にクライアントから実データで上書き）。
// 空でも useVals 側の各ガードでクラッシュしない。
const EMPTY_DEFERRED: DeferredReferenceData = { others: [], meetups: [], bars: [], kuraMeta: {}, prefGrid: [] };

export function Providers({ initialData, children }: { initialData: CoreReferenceData; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const route = routeStateFromPath(pathname || '/');
  // SSR取得のcore(brands/members) と クライアント後追いのdeferred を合成。
  const deferredRef = useStore((s) => s.deferredRef);
  const ref: ReferenceData = { ...initialData, ...(deferredRef ?? EMPTY_DEFERRED) };
  const vals = useVals(route, ref);

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
    const store = useStore.getState();
    // MEETUP一覧はフィードと独立なので即時並行で取得（先行2リクエストを待たない）。
    store.loadMeetups();
    // social は publicRecords のidに依存するため、この2つは直列。
    (async () => {
      await store.loadPublicRecords();
      await store.loadSocial();
    })();
  }, []);

  // 初回ペイントに不要な参照データ(マップ系・サンプル投稿・MEETUPシード)は
  // 描画後にクライアントから後追い取得する（SSRの描画パスをbrands/membersのみに絞る）。
  useEffect(() => {
    useStore.getState().loadDeferredReference();
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
      if (event === 'SIGNED_OUT') {
        store.setUser(null);
        store.patch({ authReady: true });
        store.setMyRecords([]);
        await store.loadSocial();
        store.loadMeetups();
        return;
      }
      const user = mapUser(session?.user);
      if (!session || !user) {
        store.setUser(null);
        store.patch({ authReady: true });
        return;
      }
      // isAdmin を取得してから一度だけ setUser する。
      // 途中で isAdmin:false の状態を経由するとボタン表示がチラつくため。
      const isAdmin = await getIsAdmin();
      store.setUser({ ...user, isAdmin });
      store.patch({ authReady: true });
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
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
    <ValsContext.Provider value={vals}>
      <div style={{ minHeight: '100vh', background: '#F6F1E7', fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24' }}>
        {vals.showChrome && <Nav vals={vals} />}
        {children}
        {vals.isMobile && <TabBar vals={vals} />}
        {vals.toastVisible && <Toast message={vals.toastMsg} />}
      </div>
    </ValsContext.Provider>
  );
}
