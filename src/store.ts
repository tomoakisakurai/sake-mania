import { create } from 'zustand';
import { pathForScreen, paths } from '@/lib/routes';
import { getSupabaseBrowser, mapUser } from '@/lib/supabase/client';
import { getMyRecords, getPublicRecords, saveRecord as saveRecordAction } from '@/app/actions/records';
import { getSocial, toggleNomi as toggleNomiAction } from '@/app/actions/social';
import type { CommentItem } from '@/app/actions/social';
import { getMeetups, getMeetupDetail, toggleGoing as toggleGoingAction, voteMvp as voteMvpAction, setMeetupPhase } from '@/app/actions/meetups';
import type { MeetupView, MeetupDetail } from '@/app/actions/meetups';
import { getDeferredReference } from '@/app/actions/reference';
import type { DeferredReferenceData } from '@/lib/getReferenceData';
import type {
  Screen, User, PostRef, Rec, MyRec, PublicRec, MeetupPhase,
} from './types';

const freshRec = (brandId: string | null): Rec => ({
  step: brandId ? 2 : 1, brandId: brandId || null, x: null, y: null,
  sweet: 50, rating: 0, temps: [], pairing: '', memo: '', query: '', photo: null, isPublic: false,
});

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export interface State {
  vw: number;
  user: User | null;
  toast: string;
  wantIds: string[];
  declareBrandId: string | null;
  meetupList: MeetupView[];
  meetupDetail: MeetupDetail | null;
  // 描画後にクライアントから後追い取得する参照データ（null=未取得）
  deferredRef: DeferredReferenceData | null;
  myNomi: Record<string, boolean>;
  nomiCounts: Record<string, number>;
  commentsByRid: Record<string, CommentItem[]>;
  rec: Rec;
  myRecords: MyRec[];
  publicRecords: PublicRec[];
  fromDetail: boolean;

  // navigation bridge (injected from the React tree by Providers)
  _navigate: (path: string) => void;
  setNavigate: (fn: (path: string) => void) => void;

  // actions
  patch: (p: Partial<State>) => void;
  nav: (screen: Screen) => void;
  openDetail: (id: string) => void;
  openPost: (ref: PostRef) => void;
  openKura: (name: string) => void;
  openMeetup: (id: string) => void;
  openDeclare: (id: string) => void;
  openKuraReg: () => void;
  openEventCreate: () => void;
  flash: (msg: string) => void;
  requireLogin: () => boolean;
  loadDeferredReference: () => void;
  setUser: (u: User | null) => void;
  setMyRecords: (recs: MyRec[]) => void;
  loadMyRecords: () => void;
  loadPublicRecords: () => void;
  logout: () => void;
  startRecord: (brandId: string | null) => void;
  setRec: (patch: Partial<Rec>) => void;
  saveRecord: () => void;
  loadSocial: () => void;
  toggleNomi: (rid: string) => void;
  loadMeetups: () => void;
  loadMeetupDetail: (id: string) => void;
  toggleGoing: (id: string) => void;
  voteMvp: (meetId: string, brandId: string) => void;
  setPhase: (meetId: string, phase: MeetupPhase) => void;
}

export const useStore = create<State>((set, get) => ({
  vw: 1200, // desktop default; Providers sets the real width after mount
  user: null,
  toast: '',
  wantIds: ['kuheiji', 'hanaabi'],
  declareBrandId: null,
  meetupList: [],
  meetupDetail: null,
  deferredRef: null,
  myNomi: {},
  nomiCounts: {},
  commentsByRid: {},
  rec: freshRec(null),
  myRecords: [],
  publicRecords: [],
  fromDetail: false,

  _navigate: () => { /* set by Providers once the router is available */ },
  setNavigate: (fn) => set({ _navigate: fn }),

  patch: (p) => set(p),

  nav: (screen) => get()._navigate(pathForScreen(screen)),
  openDetail: (id) => get()._navigate(paths.detail(id)),
  openPost: (ref) => get()._navigate(paths.post(ref.src, ref.i)),
  openKura: (name) => get()._navigate(paths.kura(name)),
  openMeetup: (id) => get()._navigate(paths.meetup(id)),

  flash: (msg) => {
    clearTimeout(toastTimer);
    set({ toast: msg });
    toastTimer = setTimeout(() => set({ toast: '' }), 3500);
  },

  requireLogin: () => {
    if (get().user) return true;
    clearTimeout(toastTimer);
    set({ toast: 'この操作にはログインが必要です' });
    toastTimer = setTimeout(() => set({ toast: '' }), 3500);
    get()._navigate('/login');
    return false;
  },

  loadDeferredReference: async () => {
    if (get().deferredRef) return; // 一度取得すれば十分（滅多に変わらない参照データ）
    const d = await getDeferredReference();
    set({ deferredRef: d });
  },

  setUser: (u) => set({ user: u }),
  setMyRecords: (recs) => set({ myRecords: recs }),
  loadMyRecords: async () => {
    const recs = await getMyRecords();
    set({ myRecords: recs });
  },
  loadPublicRecords: async () => {
    const recs = await getPublicRecords();
    set({ publicRecords: recs });
  },
  logout: async () => {
    const supabase = getSupabaseBrowser();
    if (supabase) await supabase.auth.signOut();
    set({ user: null, myRecords: [] });
    get()._navigate('/login');
  },

  startRecord: (brandId) => {
    if (!get().requireLogin()) return;
    set({ rec: freshRec(brandId) });
    get()._navigate('/record');
  },
  setRec: (patch) => set((s) => ({ rec: { ...s.rec, ...patch } })),
  saveRecord: async () => {
    const r = get().rec;
    if (r.brandId == null || r.x == null || r.y == null) return;
    const saved = await saveRecordAction({
      brandId: r.brandId, rating: r.rating, x: r.x, y: r.y, sweet: r.sweet,
      temps: r.temps, pairing: r.pairing, memo: r.memo, photo: r.photo, isPublic: r.isPublic,
    });
    if (!saved) { get().flash('保存に失敗しました（ログインが必要です）'); return; }
    clearTimeout(toastTimer);
    set((s) => ({ myRecords: [saved, ...s.myRecords], toast: r.isPublic ? '一杯を記録し、みんなに公開しました' : '一杯を記録しました — 舌の地図に打点が増えました' }));
    toastTimer = setTimeout(() => set({ toast: '' }), 4000);
    if (r.isPublic) { await get().loadPublicRecords(); await get().loadSocial(); }
    get()._navigate('/');
  },

  loadSocial: async () => {
    const st = get();
    const ids = Array.from(new Set([...st.myRecords.map((r) => r.rid), ...st.publicRecords.map((r) => r.rid)]));
    const social = await getSocial(ids);
    set({ nomiCounts: social.counts, myNomi: social.mine, commentsByRid: social.comments });
  },
  toggleNomi: async (rid) => {
    if (!get().requireLogin()) return;
    const res = await toggleNomiAction(rid);
    if (!res) return;
    set((s) => ({ myNomi: { ...s.myNomi, [rid]: res.liked }, nomiCounts: { ...s.nomiCounts, [rid]: res.count } }));
  },
  loadMeetups: async () => {
    const list = await getMeetups();
    set({ meetupList: list });
  },
  loadMeetupDetail: async (id) => {
    const detail = await getMeetupDetail(id);
    set({ meetupDetail: detail });
  },
  toggleGoing: async (id) => {
    if (!get().requireLogin()) return;
    await toggleGoingAction(id);
    await Promise.all([get().loadMeetupDetail(id), get().loadMeetups()]);
  },
  openDeclare: (id) => {
    if (!get().requireLogin()) return;
    const md = get().meetupDetail;
    const ex = md && md.id === id ? md.myBringBrandId : null;
    set({ declareBrandId: ex });
    get()._navigate(paths.declare(id));
  },
  voteMvp: async (meetId, brandId) => {
    if (!get().requireLogin()) return;
    await voteMvpAction(meetId, brandId);
    await get().loadMeetupDetail(meetId);
  },
  setPhase: async (meetId, phase) => {
    if (!get().requireLogin()) return;
    const ok = await setMeetupPhase(meetId, phase);
    if (!ok) { get().flash('権限がありません（幹事のみ）'); return; }
    await Promise.all([get().loadMeetupDetail(meetId), get().loadMeetups()]);
    get().flash(phase === 'voting' ? 'MVP投票を開始しました' : phase === 'closed' ? 'MVPを確定しました' : '');
  },

  openKuraReg: () => {
    if (!get().requireLogin()) return;
    if (!get().user?.isAdmin) { get().flash('酒蔵の登録は管理者のみ行えます'); return; }
    get()._navigate('/kura/register');
  },

  openEventCreate: () => {
    if (!get().requireLogin()) return;
    get()._navigate('/meetup/create');
  },
}));
