'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { useReferenceData } from '@/components/Providers';
import { paths } from '@/lib/routes';
import { createBrand, updateBrand } from '@/app/actions/brands';
import { analyzeLabel } from '@/app/actions/analyzeLabel';
import { Input } from '@/components/shared/Input';
import { Textarea } from '@/components/shared/Textarea';
import { Button } from '@/components/shared/Button';
import { Done } from './Done';
import { LabelReader } from './LabelReader';

// editingId 付きで呼ぶと既存銘柄の編集モードになる(/brand/[id]/edit)
export function BrandReg({ editingId }: { editingId?: string }) {
  const store = useStore();
  const router = useRouter();
  const authReady = useStore((s) => s.authReady);
  const isLoggedIn = useStore((s) => !!s.user);
  const isMobile = useStore((s) => s.vw < 768);
  const pagePadding = isMobile ? '20px 18px 130px' : '32px 40px 80px';

  const isEdit = !!editingId;
  const { brands } = useReferenceData();
  const editingBrand = editingId ? brands.find((brand) => brand.id === editingId) : undefined;

  const [name, setName] = useState(editingBrand?.name ?? '');
  const [brewery, setBrewery] = useState(editingBrand?.brewery ?? '');
  const [pref, setPref] = useState(editingBrand?.pref ?? '');
  const [cls, setCls] = useState(editingBrand?.cls ?? '');
  const [polish, setPolish] = useState(editingBrand?.polish ?? '');
  const [rice, setRice] = useState(editingBrand?.rice ?? '');
  const [description, setDescription] = useState(editingBrand?.desc ?? '');
  const [photo, setPhoto] = useState(editingBrand?.photo ?? '');
  const [reading, setReading] = useState(false);
  const [readDone, setReadDone] = useState(false);
  const [registeredName, setRegisteredName] = useState('');
  const [registeredId, setRegisteredId] = useState('');
  const [done, setDone] = useState(false);

  const goBack = () => {
    if (isEdit && editingId) router.push(paths.detail(editingId));
    else store.nav('zukan');
  };
  const backLabel = isEdit ? '← 銘柄詳細にもどる' : '← 図鑑にもどる';

  if (!authReady) {
    return <div style={{ maxWidth: 620, margin: '0 auto', padding: pagePadding }} />;
  }
  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: 620, margin: '0 auto', padding: pagePadding }}>
        <div onClick={goBack} style={{ fontSize: 13, color: 'var(--color-muted)', cursor: 'pointer', marginBottom: 24 }}>{backLabel}</div>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>ログインが必要です</div>
        <div style={{ fontSize: 14, color: 'var(--color-body)', lineHeight: 1.9 }}>銘柄の{isEdit ? '編集' : '登録'}にはログインが必要です。</div>
      </div>
    );
  }
  if (isEdit && !editingBrand) {
    return (
      <div style={{ maxWidth: 620, margin: '0 auto', padding: pagePadding }}>
        <div onClick={() => store.nav('zukan')} style={{ fontSize: 13, color: 'var(--color-muted)', cursor: 'pointer', marginBottom: 24 }}>← 図鑑にもどる</div>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>銘柄が見つかりません</div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!name.trim() || !brewery.trim()) {
      store.flash('銘柄名と酒蔵は必須です');
      return;
    }
    const input = { name: name.trim(), brewery: brewery.trim(), pref, cls, polish, rice, description, photo: photo || null };
    if (isEdit && editingId) {
      const ok = await updateBrand(editingId, input);
      if (!ok) { store.flash('更新に失敗しました'); return; }
      store.flash('銘柄を更新しました');
      router.push(paths.detail(editingId));
      router.refresh();
      return;
    }
    const id = await createBrand(input);
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
      <div onClick={goBack} style={{ fontSize: 13, color: 'var(--color-muted)', cursor: 'pointer', marginBottom: 24 }}>{backLabel}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.18em', color: 'var(--color-muted)', marginBottom: 10 }}>{isEdit ? 'EDIT A BRAND' : 'REGISTER A BRAND'}</div>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{isEdit ? '銘柄を編集する' : '銘柄を登録する'}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.9, color: 'var(--color-body)', marginBottom: 28 }}>
        {isEdit
          ? '登録済みの銘柄情報を修正できます。更新するとすぐに図鑑へ反映されます。'
          : '図鑑にまだ載っていない銘柄を登録できます。登録するとすぐに図鑑に追加され、部のみんなが記録・検索できるようになります。飲んで気に入った一本をぜひ共有しましょう。'}
      </div>

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
          <div className="text-[12.5px] font-bold mb-1.5">銘柄名 <span className="text-accent">必須</span></div>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="例: 〇〇 純米大吟醸" />
        </div>
        <div>
          <div className="text-[12.5px] font-bold mb-1.5">酒蔵 <span className="text-accent">必須</span></div>
          <Input value={brewery} onChange={(e) => setBrewery(e.target.value)} placeholder="例: 〇〇酒造" />
        </div>
        <div>
          <div className="text-[12.5px] font-bold mb-1.5">都道府県</div>
          <Input value={pref} onChange={(e) => setPref(e.target.value)} placeholder="例: 新潟" />
        </div>
        <div>
          <div className="text-[12.5px] font-bold mb-1.5">分類</div>
          <Input value={cls} onChange={(e) => setCls(e.target.value)} placeholder="例: 純米吟醸 無濾過生原酒" />
        </div>
        <div>
          <div className="text-[12.5px] font-bold mb-1.5">精米歩合</div>
          <Input value={polish} onChange={(e) => setPolish(e.target.value)} placeholder="例: 50%" />
        </div>
        <div>
          <div className="text-[12.5px] font-bold mb-1.5">使用酒米</div>
          <Input value={rice} onChange={(e) => setRice(e.target.value)} placeholder="例: 山田錦" />
        </div>
      </div>

      <div className="text-[12.5px] font-bold mb-1.5">銘柄の紹介・味わい</div>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="味わいの特徴やおすすめの飲み方など"
        className="mb-6"
      />

      <Button onClick={handleSubmit} size="lg" fullWidth>{isEdit ? 'この内容で更新する' : '図鑑に登録する'}</Button>
    </div>
  );
}
