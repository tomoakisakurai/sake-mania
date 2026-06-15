/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Vals } from '@/useVals';
import { useRef } from 'react';

// 記録ステップ3: 飲み方 + 合わせた料理 + 写真
export function Step3Pairing({ v }: { v: Vals }) {
  const photoRef = useRef<HTMLInputElement>(null);
  const onPhotoClick = () => photoRef.current?.click();
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>飲み方 <span style={{ fontWeight: 400, color: '#8B8273', fontSize: 12 }}>複数OK</span></div>
        <div style={{ display: 'flex', gap: 8 }}>
          {v.tempChips.map((tc: any, i: number) => (
            <span key={i} onClick={tc.click} style={{ cursor: 'pointer', borderRadius: 999, padding: '9px 22px', fontSize: 13, background: tc.bg, color: tc.color, border: tc.border }}>{tc.label}</span>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>合わせた料理(肴)</div>
        <input type="text" value={v.recPairing} onChange={v.onPairing} placeholder="例: 白子ポン酢、鯖の塩焼き" style={{ width: '100%', background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 10, padding: '13px 18px', fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24' }} />
      </div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>写真</div>
        <input type="file" accept="image/*" ref={photoRef} onChange={v.onPhoto} style={{ display: 'none' }} />
        {v.recHasPhoto && (
          <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid #E3DBCB' }}>
            <img src={v.recPhoto} alt="" style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', right: 12, bottom: 12, display: 'flex', gap: 8 }}>
              <div onClick={onPhotoClick} style={{ background: 'rgba(46,42,36,0.78)', color: '#F6F1E7', borderRadius: 999, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>差し替え</div>
              <div onClick={v.onPhotoRemove} style={{ background: 'rgba(46,42,36,0.78)', color: '#F6F1E7', borderRadius: 999, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>削除</div>
            </div>
          </div>
        )}
        {v.recNoPhoto && (
          <div onClick={onPhotoClick} style={{ border: '2px dashed #D9D0BC', borderRadius: 12, padding: 36, textAlign: 'center', background: '#FDFBF5', cursor: 'pointer' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#5C5547', marginBottom: 4 }}>ラベル・ボトルの写真を追加</div>
            <div style={{ fontSize: 11.5, color: '#A89D8A' }}>タップして撮影 / 画像をアップロード</div>
          </div>
        )}
      </div>
    </>
  );
}
