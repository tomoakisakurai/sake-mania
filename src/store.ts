import { create } from 'zustand';
import { pathForScreen, paths } from '@/lib/routes';
import type {
  Screen, User, PostRef, Rec, MyRec, Comment, EditingComment, MeetupPhase,
} from './types';

const freshRec = (brandId: string | null): Rec => ({
  step: brandId ? 2 : 1, brandId: brandId || null, x: null, y: null,
  sweet: 50, rating: 0, temps: [], pairing: '', memo: '', query: '', photo: null,
});

const initialMyRecords: MyRec[] = [
  { rid: 'm1', nomi: 12, comments: [{ user: 'awa_hajime', avatar: '泡', avatarBg: '#CBD8C9', time: '6月2日', text: 'X-typeいいなあ。生牡蠣と合わせるの、真似します' }], brandId: 'aramasa6', date: '6月2日', rating: 5, x: 62, y: 24, sweet: 62, temps: ['冷酒'], pairing: '生牡蠣', memo: 'ガス感と酸のバランスが完璧。今年のベスト候補。' },
  { rid: 'm2', nomi: 5, comments: [], brandId: 'hououbiden', date: '6月8日', rating: 4, x: 56, y: 72, sweet: 30, temps: ['ぬる燗'], pairing: '鯖の塩焼き', memo: '燗にすると米の旨みがぐっと前に出る。常備したい。' },
  { rid: 'm3', nomi: 3, comments: [], brandId: 'dassai45', date: '5月24日', rating: 4, x: 30, y: 28, sweet: 55, temps: ['冷酒'], pairing: 'カプレーゼ', memo: '安定の華やかさ。日本酒はじめての友人に勧めたら大好評。' },
  { rid: 'm4', nomi: 2, comments: [], brandId: 'kubota', date: '5月17日', rating: 3, x: 22, y: 66, sweet: 35, temps: ['常温'], pairing: '冷奴', memo: '静かで食事を邪魔しない。良くも悪くも教科書。' },
  { rid: 'm5', nomi: 8, comments: [], brandId: 'denshu', date: '5月10日', rating: 5, x: 52, y: 58, sweet: 48, temps: ['常温', 'ぬる燗'], pairing: 'ホタテのバター焼き', memo: '米の旨みの教科書。ぬる燗で世界が変わった。' },
  { rid: 'm6', nomi: 6, comments: [], brandId: 'kazenomori', date: '4月29日', rating: 4, x: 48, y: 18, sweet: 64, temps: ['冷酒'], pairing: '唐揚げ', memo: '微発泡フレッシュ。揚げ物を流すガス感が最高。' },
];

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export interface State {
  vw: number;
  user: User | null;
  loginMode: 'login' | 'signup';
  loginName: string;
  loginEmail: string;
  loginPw: string;
  searchQuery: string;
  activeTag: string | null;
  toast: string;
  wantIds: string[];
  mapPref: string | null;
  myGoing: Record<string, boolean>;
  myBring: Record<string, { brandId: string; note: string }>;
  declareBrandId: string | null;
  declareNote: string;
  declareQuery: string;
  mapMode: 'kura' | 'bars';
  barId: string | null;
  myMvpVotes: Record<string, string | null>;
  meetPhase: Record<string, MeetupPhase>;
  myNomi: Record<string, boolean>;
  myComments: Record<string, Comment[]>;
  commentDraft: string;
  editingComment: EditingComment | null;
  editDraft: string;
  rec: Rec;
  myRecords: MyRec[];
  krName: string; krPref: string; krCity: string; krFounded: string; krBrands: string; krDesc: string; krDone: boolean;
  ecName: string; ecDate: string; ecPlace: string; ecDesc: string; ecDone: boolean;
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
  doLogin: () => void;
  logout: () => void;
  startRecord: (brandId: string | null) => void;
  setRec: (patch: Partial<Rec>) => void;
  saveRecord: () => void;
  toggleNomi: (rid: string) => void;
  addComment: (rid: string) => void;
  deleteComment: (rid: string, i: number) => void;
  saveEditComment: () => void;
  toggleGoing: (id: string) => void;
  submitDeclare: (meetupId: string) => void;
  cancelDeclare: (id: string) => void;
  voteMvp: (meetId: string, brandId: string) => void;
  setPhase: (meetId: string, phase: MeetupPhase) => void;
  submitKuraReg: () => void;
  resetKuraReg: () => void;
  submitEventCreate: () => void;
  resetEventCreate: () => void;
}

export const useStore = create<State>((set, get) => ({
  vw: 1200, // desktop default; Providers sets the real width after mount
  user: null,
  loginMode: 'login',
  loginName: '',
  loginEmail: '',
  loginPw: '',
  searchQuery: '',
  activeTag: null,
  toast: '',
  wantIds: ['kuheiji', 'hanaabi'],
  mapPref: null,
  myGoing: {},
  myBring: {},
  declareBrandId: null,
  declareNote: '',
  declareQuery: '',
  mapMode: 'kura',
  barId: null,
  myMvpVotes: {},
  meetPhase: {},
  myNomi: {},
  myComments: {},
  commentDraft: '',
  editingComment: null,
  editDraft: '',
  rec: freshRec(null),
  myRecords: initialMyRecords,
  krName: '', krPref: '', krCity: '', krFounded: '', krBrands: '', krDesc: '', krDone: false,
  ecName: '', ecDate: '', ecPlace: '', ecDesc: '', ecDone: false,
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

  doLogin: () => {
    const st = get();
    const isSignup = st.loginMode === 'signup';
    const name = isSignup && st.loginName.trim() ? st.loginName.trim() : 'yuu_sake_log';
    const user: User = { name, avatar: name === 'yuu_sake_log' ? '悠' : name.charAt(0) };
    clearTimeout(toastTimer);
    set({ user, toast: isSignup ? 'ようこそ、' + name + ' さん — 最初の一杯を記録してみましょう' : 'おかえりなさい、' + name + ' さん' });
    toastTimer = setTimeout(() => set({ toast: '' }), 4000);
    get()._navigate('/');
  },

  logout: () => {
    set({ user: null, loginEmail: '', loginPw: '', loginName: '', loginMode: 'login' });
    get()._navigate('/login');
  },

  startRecord: (brandId) => {
    if (!get().requireLogin()) return;
    set({ rec: freshRec(brandId) });
    get()._navigate('/record');
  },
  setRec: (patch) => set((s) => ({ rec: { ...s.rec, ...patch } })),
  saveRecord: () => {
    const r = get().rec;
    if (r.brandId == null) return;
    const rec: MyRec = { rid: 'm' + Date.now(), nomi: 0, comments: [], brandId: r.brandId, date: '今日', rating: r.rating, x: r.x, y: r.y, sweet: r.sweet, temps: r.temps, pairing: r.pairing, memo: r.memo, photo: r.photo, isNew: true };
    clearTimeout(toastTimer);
    set((s) => ({ myRecords: [rec, ...s.myRecords], toast: '一杯を記録しました — 舌の地図に打点が増えました' }));
    toastTimer = setTimeout(() => set({ toast: '' }), 4000);
    get()._navigate('/');
  },

  toggleNomi: (rid) => {
    if (!get().requireLogin()) return;
    set((s) => ({ myNomi: { ...s.myNomi, [rid]: !s.myNomi[rid] } }));
  },
  addComment: (rid) => {
    const t = get().commentDraft.trim();
    if (!t) return;
    if (!get().requireLogin()) return;
    const u = get().user!;
    set((s) => ({
      myComments: { ...s.myComments, [rid]: (s.myComments[rid] || []).concat([{ user: u.name, avatar: u.avatar, avatarBg: '#DDD3BE', time: 'たった今', text: t }]) },
      commentDraft: '',
    }));
  },
  deleteComment: (rid, i) => {
    set((s) => ({
      myComments: { ...s.myComments, [rid]: (s.myComments[rid] || []).filter((_, j) => j !== i) },
      editingComment: null,
    }));
  },
  saveEditComment: () => {
    const ed = get().editingComment;
    if (!ed) return;
    const t = get().editDraft.trim();
    if (!t) return;
    set((s) => ({
      myComments: { ...s.myComments, [ed.rid]: (s.myComments[ed.rid] || []).map((c, j) => j === ed.i ? { ...c, text: t, edited: true } : c) },
      editingComment: null, editDraft: '',
    }));
  },

  toggleGoing: (id) => {
    if (!get().requireLogin()) return;
    set((s) => ({ myGoing: { ...s.myGoing, [id]: !s.myGoing[id] } }));
  },
  openDeclare: (id) => {
    if (!get().requireLogin()) return;
    const ex = get().myBring[id];
    set({ declareBrandId: ex ? ex.brandId : null, declareNote: ex ? ex.note : '', declareQuery: '' });
    get()._navigate(paths.declare(id));
  },
  submitDeclare: (meetupId) => {
    if (!get().declareBrandId) { get().flash('持ち寄る一本を選んでください'); return; }
    set((s) => ({
      myBring: { ...s.myBring, [meetupId]: { brandId: s.declareBrandId!, note: s.declareNote } },
      myGoing: { ...s.myGoing, [meetupId]: true },
    }));
    get()._navigate(paths.meetup(meetupId));
    get().flash('持ち寄りを宣言しました');
  },
  cancelDeclare: (id) => set((s) => { const mb = { ...s.myBring }; delete mb[id]; return { myBring: mb }; }),
  voteMvp: (meetId, brandId) => {
    if (!get().requireLogin()) return;
    set((s) => ({ myMvpVotes: { ...s.myMvpVotes, [meetId]: s.myMvpVotes[meetId] === brandId ? null : brandId } }));
  },
  setPhase: (meetId, phase) => {
    if (!get().requireLogin()) return;
    set((s) => ({ meetPhase: { ...s.meetPhase, [meetId]: phase } }));
    get().flash(phase === 'voting' ? 'MVP投票を開始しました' : phase === 'closed' ? 'MVPを確定しました' : '');
  },

  openKuraReg: () => {
    if (!get().requireLogin()) return;
    set({ krDone: false });
    get()._navigate('/kura/register');
  },
  submitKuraReg: () => {
    if (!get().krName.trim() || !get().krPref.trim()) { get().flash('蔵名と都道府県は必須です'); return; }
    set({ krDone: true });
  },
  resetKuraReg: () => set({ krName: '', krPref: '', krCity: '', krFounded: '', krBrands: '', krDesc: '', krDone: false }),

  openEventCreate: () => {
    if (!get().requireLogin()) return;
    set({ ecDone: false });
    get()._navigate('/meetup/create');
  },
  submitEventCreate: () => {
    if (!get().ecName.trim() || !get().ecDate.trim() || !get().ecPlace.trim()) { get().flash('会の名前・日時・会場は必須です'); return; }
    set({ ecDone: true });
  },
  resetEventCreate: () => set({ ecName: '', ecDate: '', ecPlace: '', ecDesc: '', ecDone: false }),
}));
