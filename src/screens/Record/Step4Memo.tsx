import type { Vals } from '@/useVals';
// 記録ステップ4: メモ + まとめ + 公開トグル
export function Step4Memo({ v }: { v: Vals }) {
  return (
    <>
      <textarea value={v.recMemo} onChange={v.onMemo} placeholder="香り、含み、余韻。未来の自分が読み返したくなる一言を。" style={{ width: '100%', height: 140, background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '16px 20px', fontSize: 14, lineHeight: 1.9, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24', resize: 'vertical', marginBottom: 24 }} />
      <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: '20px 24px' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.16em', color: '#8B8273', marginBottom: 12 }}>この一杯のまとめ</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5 }}>
          <div style={{ display: 'flex', gap: 12 }}><span style={{ color: '#8B8273', width: 64 }}>銘柄</span><b style={{ fontFamily: "'Shippori Mincho', serif" }}>{v.recBrandName}</b></div>
          <div style={{ display: 'flex', gap: 12 }}><span style={{ color: '#8B8273', width: 64 }}>評価</span><span style={{ color: '#BC6A2D', letterSpacing: '2px' }}>{v.recStarsStr}</span></div>
          <div style={{ display: 'flex', gap: 12 }}><span style={{ color: '#8B8273', width: 64 }}>味わい</span><span>{v.recTasteLabel} / {v.recSweetLabel}</span></div>
          <div style={{ display: 'flex', gap: 12 }}><span style={{ color: '#8B8273', width: 64 }}>楽しみ方</span><span>{v.recEnjoyLabel}</span></div>
        </div>
      </div>
      <div onClick={v.toggleRecPublic} style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, background: v.recPublic ? '#FBF0E6' : '#FFFFFF', border: `1px solid ${v.recPublic ? '#E8C9A8' : '#E3DBCB'}`, borderRadius: 12, padding: '14px 18px', cursor: 'pointer' }}>
        <div style={{ width: 42, height: 24, borderRadius: 999, background: v.recPublic ? '#BC6A2D' : '#D9D0BC', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
          <div style={{ position: 'absolute', top: 2, left: v.recPublic ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: '#FDFBF5', transition: 'left 0.2s' }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700 }}>みんなの利き酒帳に公開する</div>
          <div style={{ fontSize: 11.5, color: '#8B8273', marginTop: 2 }}>{v.recPublic ? '部員みんなのフィードに表示されます' : '非公開（自分のマイページのみ）'}</div>
        </div>
      </div>
    </>
  );
}
