import type { Vals } from '@/useVals';
import { Fragment } from 'react';

// ホームの「あなたの味わいマップ」: 記録した盃を香り×淡麗濃醇の座標に打点表示
export function TasteMap({ vals }: { vals: Vals }) {
  return (
    <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: '28px 32px', marginBottom: 36 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 19, fontWeight: 700 }}>あなたの味わいマップ</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#8B8273' }}>{vals.statCups}盃 / {vals.statBrands}銘柄</div>
      </div>
      <div style={{ position: 'relative', width: '100%', height: vals.mapH, background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 8 }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#EAE2D0' }}></div>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#EAE2D0' }}></div>
        <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', fontSize: 11, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '0 8px' }}>香り高い</div>
        <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', fontSize: 11, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '0 8px' }}>穏やか</div>
        <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 11, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '4px 0' }}>淡麗</div>
        <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 11, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '4px 0' }}>濃醇</div>
        {vals.myDots.map((d, i: number) => (
          <Fragment key={i}>
            <div style={{ position: 'absolute', left: `${d.left}%`, top: `${d.top}%`, transform: 'translate(-50%, -50%)', width: `${d.size}px`, height: `${d.size}px`, borderRadius: '50%', background: d.bg }}></div>
            <div style={{ position: 'absolute', left: `${d.left}%`, top: `${d.top}%`, transform: 'translate(11px, -7px)', fontSize: 11, color: '#5C5547' }}>{d.label}</div>
          </Fragment>
        ))}
        <div style={{ position: 'absolute', left: '44%', top: '50%', transform: 'translate(-50%, -50%)', width: 20, height: 20, borderRadius: '50%', border: '2px dashed #BC6A2D', background: 'rgba(188,106,45,0.07)' }}></div>
        <div style={{ position: 'absolute', left: '44%', top: '50%', transform: 'translate(14px, -8px)', fontSize: 11, color: '#BC6A2D', fontWeight: 700 }}>未踏の領域</div>
      </div>
      <div style={{ display: 'flex', gap: 20, marginTop: 14, fontSize: 11.5, color: '#5C5547', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 11, height: 11, borderRadius: '50%', background: '#BC6A2D', display: 'inline-block' }}></span>五つ星の盃</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: '50%', background: '#32507C', display: 'inline-block' }}></span>記録済み</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px dashed #BC6A2D', display: 'inline-block' }}></span>まだ飲んでいない座標 — ここを開拓しよう</span>
      </div>
    </div>
  );
}
