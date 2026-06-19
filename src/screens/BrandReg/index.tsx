'use client';
import { useState } from 'react';
import { useStore } from '@/store';
import { createBrand } from '@/app/actions/brands';
import { analyzeLabel } from '@/app/actions/analyzeLabel';
import { Done } from './Done';
import { LabelReader } from './LabelReader';

export function BrandReg() {
  const store = useStore();
  const authReady = useStore((s) => s.authReady);
  const isAdmin = useStore((s) => s.user?.isAdmin ?? false);
  const isMobile = useStore((s) => s.vw < 768);
  const pagePadding = isMobile ? '20px 18px 130px' : '32px 40px 80px';

  const [name, setName] = useState('');
  const [brewery, setBrewery] = useState('');
  const [pref, setPref] = useState('');
  const [cls, setCls] = useState('');
  const [polish, setPolish] = useState('');
  const [rice, setRice] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [reading, setReading] = useState(false);
  const [readDone, setReadDone] = useState(false);
  const [registeredName, setRegisteredName] = useState('');
  const [registeredId, setRegisteredId] = useState('');
  const [done, setDone] = useState(false);

  if (!authReady) {
    return <div style={{ maxWidth: 620, margin: '0 auto', padding: pagePadding }} />;
  }
  if (!isAdmin) {
    return (
      <div style={{ maxWidth: 620, margin: '0 auto', padding: pagePadding }}>
        <div onClick={() => store.nav('zukan')} style={{ fontSize: 13, color: '#8B8273', cursor: 'pointer', marginBottom: 24 }}>← 図鑑にもどる</div>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>アクセスできません</div>
        <div style={{ fontSize: 14, color: '#5C5547', lineHeight: 1.9 }}>銘柄の登録は管理者のみ行えます。</div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!name.trim() || !brewery.trim()) {
      store.flash('銘柄名と酒蔵は必須です');
      return;
    }
    const id = await createBrand({ name: name.trim(), brewery: brewery.trim(), pref, cls, polish, rice, description, photo: photo || null });
    if (!id) { store.flash('登録に失敗しました'); return; }
    setRegisteredName(name.trim());
    setRegisteredId(id);
    setDone(true);
    store.loadDeferredReference();
  };

  const handleAnother = () => {
    setName(''); setBrewery(''); setPref(''); setCls(''); setPolish(''); setRice(''); setDescription('');
    setPhoto(''); setReading(false); setReadDone(false);
    setDone(false);
  };

  const handleViewBrand = () => {
    store.nav('zukan');
  };

  const handlePhotoPick = (dataUrl: string) => {
    setPhoto(dataUrl);
    setReadDone(false);
  };

  const handlePhotoRemove = () => {
    setPhoto(''); setReading(false); setReadDone(false);
  };

  const handleRead = async () => {
    if (!photo || reading) return;
    setReading(true);
    try {
      const result = await analyzeLabel(photo);
      if (!result) {
        store.flash('読み取りに失敗しました。手で入力してください');
        return;
      }
      setName(result.name);
      setBrewery(result.brewery);
      setPref(result.pref);
      setCls(result.cls);
      setPolish(result.polish);
      setRice(result.rice);
      setDescription(result.description);
      setReadDone(true);
      store.flash('ラベルを読み取りました。内容を確認してください');
    } finally {
      setReading(false);
    }
  };

  if (done) {
    return (
      <div style={{ maxWidth: 620, margin: '0 auto', padding: pagePadding }}>
        <Done
          registeredName={registeredName}
          registeredId={registeredId}
          onAnother={handleAnother}
          onViewBrand={handleViewBrand}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: pagePadding }}>
      <div onClick={() => store.nav('zukan')} style={{ fontSize: 13, color: '#8B8273', cursor: 'pointer', marginBottom: 24 }}>← 図鑑にもどる</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.18em', color: '#8B8273', marginBottom: 10 }}>REGISTER A BRAND</div>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>銘柄を登録する</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.9, color: '#5C5547', marginBottom: 28 }}>図鑑にまだ載っていない銘柄を登録できます。登録するとすぐに図鑑に追加され、部のみんなが記録・検索できるようになります。飲んで気に入った一本をぜひ共有しましょう。</div>

      <LabelReader
        photo={photo}
        reading={reading}
        readDone={readDone}
        onPick={handlePhotoPick}
        onRead={handleRead}
        onRemove={handlePhotoRemove}
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-2">
          <div className="text-[12.5px] font-bold mb-1.5">銘柄名 <span className="text-[#BC6A2D]">必須</span></div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: 〇〇 純米大吟醸"
            className="w-full bg-[#FDFBF5] border border-[#E3DBCB] rounded-[10px] px-4 py-3 text-[14px] text-[#2E2A24]"
          />
        </div>
        <div>
          <div className="text-[12.5px] font-bold mb-1.5">酒蔵 <span className="text-[#BC6A2D]">必須</span></div>
          <input
            type="text"
            value={brewery}
            onChange={(e) => setBrewery(e.target.value)}
            placeholder="例: 〇〇酒造"
            className="w-full bg-[#FDFBF5] border border-[#E3DBCB] rounded-[10px] px-4 py-3 text-[14px] text-[#2E2A24]"
          />
        </div>
        <div>
          <div className="text-[12.5px] font-bold mb-1.5">都道府県</div>
          <input
            type="text"
            value={pref}
            onChange={(e) => setPref(e.target.value)}
            placeholder="例: 新潟"
            className="w-full bg-[#FDFBF5] border border-[#E3DBCB] rounded-[10px] px-4 py-3 text-[14px] text-[#2E2A24]"
          />
        </div>
        <div>
          <div className="text-[12.5px] font-bold mb-1.5">分類</div>
          <input
            type="text"
            value={cls}
            onChange={(e) => setCls(e.target.value)}
            placeholder="例: 純米吟醸 無濾過生原酒"
            className="w-full bg-[#FDFBF5] border border-[#E3DBCB] rounded-[10px] px-4 py-3 text-[14px] text-[#2E2A24]"
          />
        </div>
        <div>
          <div className="text-[12.5px] font-bold mb-1.5">精米歩合</div>
          <input
            type="text"
            value={polish}
            onChange={(e) => setPolish(e.target.value)}
            placeholder="例: 50%"
            className="w-full bg-[#FDFBF5] border border-[#E3DBCB] rounded-[10px] px-4 py-3 text-[14px] text-[#2E2A24]"
          />
        </div>
        <div>
          <div className="text-[12.5px] font-bold mb-1.5">使用酒米</div>
          <input
            type="text"
            value={rice}
            onChange={(e) => setRice(e.target.value)}
            placeholder="例: 山田錦"
            className="w-full bg-[#FDFBF5] border border-[#E3DBCB] rounded-[10px] px-4 py-3 text-[14px] text-[#2E2A24]"
          />
        </div>
      </div>

      <div className="text-[12.5px] font-bold mb-1.5">銘柄の紹介・味わい</div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        placeholder="味わいの特徴やおすすめの飲み方など"
        className="w-full bg-[#FDFBF5] border border-[#E3DBCB] rounded-[10px] px-4 py-3 text-[14px] leading-relaxed text-[#2E2A24] resize-y mb-6"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-[#32507C] hover:bg-[#263d5f] text-[#FDFBF5] rounded-full py-4 text-[15px] font-bold cursor-pointer transition-colors"
      >
        図鑑に登録する
      </button>
    </div>
  );
}
