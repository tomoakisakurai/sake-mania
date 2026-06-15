/* eslint-disable @typescript-eslint/no-explicit-any */
// 投稿詳細の右カラム: 銘柄名 + 味わい座標 + 甘辛 + 飲み方/肴 + メモ
export function TasteColumn({ v }: { v: any }) {
  return (
    <div>
      <div onClick={v.post.brandClick} style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700, lineHeight: 1.4, cursor: 'pointer' }}>{v.post.brandName}</div>
      <div style={{ fontSize: 12.5, color: '#8B8273', marginTop: 4, marginBottom: 20 }}><span onClick={v.post.kuraClick} style={{ cursor: 'pointer', fontWeight: 700, color: '#32507C' }}>{v.post.brewery}</span> / {v.post.brandSubRest}</div>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>この一杯の座標 <span style={{ fontWeight: 400, color: '#8B8273', fontSize: 11.5 }}>{v.post.tasteLabel}</span></div>
      <div style={{ position: 'relative', width: '100%', height: 230, background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 8, marginBottom: 8 }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#EAE2D0' }}></div>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#EAE2D0' }}></div>
        <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: '#8B8273', background: '#FDFBF5', padding: '0 6px' }}>香り高い</div>
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: '#8B8273', background: '#FDFBF5', padding: '0 6px' }}>穏やか</div>
        <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontWeight: 700, color: '#8B8273' }}>淡麗</div>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontWeight: 700, color: '#8B8273' }}>濃醇</div>
        <div style={{ position: 'absolute', left: `${v.post.bx}%`, top: `${v.post.by}%`, transform: 'translate(-50%, -50%)', width: 10, height: 10, borderRadius: '50%', background: '#D9D0BC' }}></div>
        <div style={{ position: 'absolute', left: `${v.post.bx}%`, top: `${v.post.by}%`, transform: 'translate(9px, -5px)', fontSize: 10, color: '#A89D8A' }}>みんなの平均</div>
        <div style={{ position: 'absolute', left: `${v.post.x}%`, top: `${v.post.y}%`, transform: 'translate(-50%, -50%)', width: 30, height: 30, borderRadius: '50%', background: 'rgba(50,80,124,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#32507C' }}></div></div>
        <div style={{ position: 'absolute', left: `${v.post.x}%`, top: `${v.post.y}%`, transform: 'translate(19px, -8px)', fontSize: 11, fontWeight: 700, color: '#32507C' }}>この一杯</div>
      </div>
      <div style={{ margin: '18px 0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, marginBottom: 6 }}><span>甘口</span><span style={{ color: '#8B8273', fontWeight: 400, fontSize: 11 }}>{v.post.sweetLabel}</span><span>辛口</span></div>
        <div style={{ height: 5, background: '#E3DBCB', borderRadius: 3, position: 'relative' }}>
          <div style={{ position: 'absolute', left: `${v.post.sweet}%`, top: '50%', transform: 'translate(-50%, -50%)', width: 16, height: 16, borderRadius: '50%', background: '#FDFBF5', border: '3px solid #32507C' }}></div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#E3DBCB', border: '1px solid #E3DBCB', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ background: '#FDFBF5', padding: '12px 16px' }}><div style={{ fontSize: 10.5, color: '#8B8273', marginBottom: 3 }}>飲み方</div><div style={{ fontSize: 14, fontWeight: 700 }}>{v.post.temps}</div></div>
        <div style={{ background: '#FDFBF5', padding: '12px 16px' }}><div style={{ fontSize: 10.5, color: '#8B8273', marginBottom: 3 }}>合わせた料理(肴)</div><div style={{ fontSize: 14, fontWeight: 700 }}>{v.post.pairing}</div></div>
      </div>
      <div style={{ background: '#F6F1E7', borderRadius: 10, padding: '20px 24px' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.16em', color: '#8B8273', marginBottom: 8 }}>MEMO</div>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15.5, lineHeight: 2.2, color: '#2E2A24' }}>{v.post.memo}</div>
      </div>
    </div>
  );
}
