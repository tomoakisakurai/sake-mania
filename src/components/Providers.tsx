'use client';
import { createContext, useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { routeStateFromPath } from '@/lib/routes';
import { useNavVals } from './useNavVals';
import { getSupabaseBrowser, mapUser } from '@/lib/supabase/client';
import { getMySession } from '@/app/actions/profile';
import type { CoreReferenceData, DeferredReferenceData, ReferenceData } from '@/lib/getReferenceData';
import type { Screen } from '@/types';
import { Nav } from './Nav';
import { TabBar } from './TabBar';
import { Toast } from './Toast';
import { Footer } from './Footer';

// 参照データ(brands/others/bars/kuraMeta/prefGrid)を画面から直接読むための
// コンテキスト。「画面ごとのビューモデル」フックから直接読む。
const ReferenceContext = createContext<ReferenceData | null>(null);
export function useReferenceData(): ReferenceData { return useContext(ReferenceContext) as ReferenceData; }

// 後追い取得分の初期値（mount後にクライアントから実データで上書き）。
// 空でも各画面フック側のガードでクラッシュしない。
const EMPTY_DEFERRED: DeferredReferenceData = { others: [], bars: [], kuraMeta: {}, prefGrid: [] };

// 後追い参照データを使う画面。Detail(others)、Kura(kuraMeta)、Map(bars/kuraMeta/prefGrid)、
// Members(prefGrid)、MyPage(prefGrid)、Post(others)。
const DEFERRED_REFERENCE_SCREENS: ReadonlySet<Screen> = new Set<Screen>(['detail', 'kura', 'map', 'members', 'mypage', 'post']);

export function Providers({ initialData, children }: { initialData: CoreReferenceData; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const route = routeStateFromPath(pathname || '/');
  // SSR取得のcore(brands) と クライアント後追いのdeferred を合成。
  const deferredRef = useStore((s) => s.deferredRef);
  const ref: ReferenceData = { ...initialData, ...(deferredRef ?? EMPTY_DEFERRED) };
  const nav = useNavVals();
  const toast = useStore((s) => s.toast);

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
  // server action はクライアントで1本ずつ直列に実行されるため、マウント時の本数を最小にする。
  // social(のみたいね・コメント)は取らない: フィードの件数は getPublicRecords が同梱しており
  // socialOf がフォールバックする。コメント本文が要る投稿詳細は Post 画面側で取得する。
  // action は cookie で認証するので、ログイン中ならこの時点で iGoing/mine/liked も正しい。
  useEffect(() => {
    const store = useStore.getState();
    store.loadMeetups();
    store.loadPublicRecords();
  }, []);

  // 初回ペイントに不要な参照データ(マップ系・サンプル投稿・MEETUPシード)は、
  // それを使う画面を開いたときだけ後追い取得する(action の直列キューを空けておく)。
  // 取得済みなら store 側で何もしない。
  useEffect(() => {
    if (DEFERRED_REFERENCE_SCREENS.has(route.screen)) {
      useStore.getState().loadDeferredReference();
    }
  }, [route.screen]);

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
      // profiles 行の保証(新規登録・OAuth初回ログイン)、プロフィール、isAdmin を
      // 1本の action でまとめて取る(action は直列実行されるので本数を減らす)。
      // 表示名の source of truth は profiles テーブル。mapUser の
      // user_metadata 由来の値は profiles 未取得時のフォールバックに留める。
      // isAdmin も取得してから一度だけ setUser する(チラつき防止)。
      const mySession = await getMySession();
      store.setUser({
        ...user,
        name: mySession?.profile.nickname ?? user.name,
        avatar: mySession?.profile.avatar ?? user.avatar,
        isAdmin: mySession?.isAdmin ?? false,
      });
      store.patch({ authReady: true });
      if (event === 'INITIAL_SESSION') {
        // ページ読み込み時のセッション。MEETUP一覧・フィードはマウント時に cookie 認証で
        // ログインユーザーとして取得済みなので再取得しない。自分の記録と social だけ取る。
        // loadSocial は store の publicRecords の id も使う。action は投入順(FIFO)に直列実行されるため、
        // マウント時に先に投げた loadPublicRecords の結果は loadMyRecords の完了時点で入っている。
        await store.loadMyRecords();
        await store.loadSocial();
        const mid = routeStateFromPath(pathname || '/').meetupId;
        if (mid) store.loadMeetupDetail(mid);
      } else if (event === 'SIGNED_IN') {
        // 画面内でのログイン。マウント時にゲストとして取った一覧は iGoing/mine/liked が古いので取り直す。
        await store.loadMyRecords();
        await store.loadSocial();
        store.loadMeetups();
        store.loadPublicRecords();
        const mid = routeStateFromPath(pathname || '/').meetupId;
        if (mid) store.loadMeetupDetail(mid);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <ReferenceContext.Provider value={ref}>
      <div style={{ minHeight: '100vh', background: '#F6F1E7', fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24', display: 'flex', flexDirection: 'column' }}>
        {nav.showChrome && <Nav nav={nav} />}
        <div style={{ flex: 1 }}>{children}</div>
        {nav.showChrome && <Footer />}
        {nav.isMobile && <TabBar nav={nav} />}
        {!!toast && <Toast message={toast} />}
      </div>
    </ReferenceContext.Provider>
  );
}
