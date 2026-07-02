'use client';
import type { ChangeEvent, MouseEvent } from 'react';
import { useStore } from '@/store';
import { useReferenceData } from '@/components/Providers';
import { starStr } from '@/lib/format';

type ChangeEv = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const STEP_LABELS = ['銘柄', '味わい', '合わせ', 'メモ'];
const TITLES = [
  ['どの銘柄を飲みましたか?', '図鑑から検索。見つからなければ自由入力も(プロトタイプでは検索のみ)'],
  ['味わいはどうでしたか?', 'マップをタップして打点。直感でOK、あとから直せます'],
  ['どう楽しみましたか?', '飲み方・肴・写真 — すべて任意です'],
  ['ひとことメモ', 'あとから読み返す、自分への手紙'],
];

// 記録フロー(4ステップ)のビューモデル。useVals から移設(useVals解体 #29)。
export function useRecordVals() {
  const store = useStore();
  const rec = store.rec;
  const myRecords = useStore((s) => s.myRecords);
  const fromDetail = useStore((s) => s.fromDetail);
  const { brands } = useReferenceData();

  const query = (rec.query || '').trim();
  const recResults = brands.filter((b) => !query || (b.name + b.brewery + b.pref).indexOf(query) !== -1).slice(0, 6)
    .map((b) => ({ name: b.name, sub: b.brewery + ' / ' + b.pref + ' — ' + b.cls, click: () => store.setRec({ brandId: b.id, step: 2 }) }));
  const recBrand = brands.find((b) => b.id === rec.brandId);
  const recSteps = STEP_LABELS.map((label, i) => {
    const n = i + 1;
    const done = rec.step > n, cur = rec.step === n;
    return { n, label, bg: cur ? '#32507C' : done ? '#DDD3BE' : '#FDFBF5', color: cur ? '#FDFBF5' : done ? '#5C5547' : '#A89D8A', border: cur || done ? '1px solid transparent' : '1px solid #E3DBCB', labelColor: cur ? '#2E2A24' : '#A89D8A', weight: cur ? 700 : 400 };
  });
  const tasteX = rec.x == null ? '' : rec.x > 58 ? '濃醇' : rec.x < 42 ? '淡麗' : '中庸';
  const tasteY = rec.y == null ? '' : rec.y < 42 ? '香り高い' : rec.y > 58 ? '穏やか' : 'バランス型';
  const recStars = [1, 2, 3, 4, 5].map((n) => ({ color: n <= rec.rating ? '#BC6A2D' : '#DDD3BE', click: () => store.setRec({ rating: n }) }));
  const tempChips = ['冷酒', '常温', 'ぬる燗', '熱燗'].map((t) => {
    const active = rec.temps.indexOf(t) !== -1;
    return { label: t, bg: active ? '#32507C' : '#FDFBF5', color: active ? '#FDFBF5' : '#5C5547', border: active ? '1px solid #32507C' : '1px solid #E3DBCB', click: () => store.setRec({ temps: active ? rec.temps.filter((x) => x !== t) : rec.temps.concat([t]) }) };
  });
  const step2Valid = rec.x != null && rec.rating > 0;
  const nextOk = rec.step === 2 ? step2Valid : true;

  return {
    recSteps, recProgress: rec.step / 4 * 100,
    recTitle: TITLES[rec.step - 1][0], recSub: TITLES[rec.step - 1][1],
    isRecStep1: rec.step === 1, isRecStep2: rec.step === 2, isRecStep3: rec.step === 3, isRecStep4: rec.step === 4,
    recQuery: rec.query, onRecSearch: (e: ChangeEv) => store.setRec({ query: e.target.value }), recResults,
    recBrandName: recBrand ? recBrand.name : '', recBrandSub: recBrand ? recBrand.brewery + ' / ' + recBrand.pref + ' — ' + recBrand.cls : '',
    recChangeBrand: () => { store.patch({ fromDetail: false }); store.setRec({ step: 1 }); },
    onMapTap: (e: MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.min(95, Math.max(5, Math.round((e.clientX - rect.left) / rect.width * 100)));
      const y = Math.min(95, Math.max(5, Math.round((e.clientY - rect.top) / rect.height * 100)));
      store.setRec({ x, y });
    },
    recHasPoint: rec.x != null, recX: rec.x, recY: rec.y,
    recGhostDots: myRecords.map((x) => ({ left: x.x, top: x.y })),
    recTasteLabel: rec.x == null ? 'まだ打点がありません' : tasteX + '・' + tasteY,
    recSweet: rec.sweet,
    recSweetLabel: rec.sweet < 35 ? '甘口寄り' : rec.sweet > 65 ? '辛口寄り' : '中口',
    onSweet: (e: ChangeEv) => store.setRec({ sweet: Number(e.target.value) }),
    recStars, recRatingLabel: rec.rating > 0 ? rec.rating.toFixed(1) : '未評価',
    tempChips, recPairing: rec.pairing,
    onPairing: (e: ChangeEv) => store.setRec({ pairing: e.target.value }),
    recMemo: rec.memo, onMemo: (e: ChangeEv) => store.setRec({ memo: e.target.value }),
    onPhoto: (e: ChangeEvent<HTMLInputElement>) => { const f = e.target.files && e.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => store.setRec({ photo: rd.result as string }); rd.readAsDataURL(f); e.target.value = ''; },
    onPhotoRemove: (e: MouseEvent) => { e.stopPropagation(); store.setRec({ photo: null }); },
    recPhoto: rec.photo || '', recHasPhoto: !!rec.photo, recNoPhoto: !rec.photo,
    recStarsStr: starStr(rec.rating),
    recEnjoyLabel: (rec.temps.length ? rec.temps.join('・') : '未記入') + (rec.pairing ? ' / 肴: ' + rec.pairing : ''),
    recPublic: rec.isPublic,
    toggleRecPublic: () => store.setRec({ isPublic: !rec.isPublic }),
    recShowFooter: rec.step >= 2,
    recBack: () => { if (rec.step <= 1 || (rec.step === 2 && fromDetail)) store.nav('home'); else store.setRec({ step: rec.step - 1 }); },
    recNext: () => { if (!nextOk) return; if (rec.step === 4) store.saveRecord(); else store.setRec({ step: rec.step + 1 }); },
    recNextLabel: rec.step === 2 ? (step2Valid ? 'つぎへ — 合わせ' : 'マップに打点と評価をどうぞ') : rec.step === 3 ? 'つぎへ — メモ' : '記す — 保存する',
    recNextDisabled: !nextOk,
    goHome: () => store.nav('home'),
  };
}

export type RecordVals = ReturnType<typeof useRecordVals>;
