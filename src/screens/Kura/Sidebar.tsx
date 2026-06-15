/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';

// 酒蔵詳細の右カラム: 蔵の場所(地図) + 味わい傾向(座標) + わたしの盃
export function Sidebar({ v }: { v: any }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700 }}>蔵の場所</div>
          <a href={v.ku.mapLink} target="_blank" rel="noreferrer" style={{ fontSize: 11.5, color: '#32507C', fontWeight: 700, textDecoration: 'none' }}>Googleマップで開く →</a>
        </div>
        <iframe src={v.ku.mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: '100%', height: 260, border: 0, borderRadius: 8, display: 'block', background: '#EFE8D8' }}></iframe>
      </div>
      <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: '20px 22px' }}>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>蔵の味わい傾向</div>
        <div style={{ position: 'relative', width: '100%', height: 230, background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 8 }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#EAE2D0' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#EAE2D0' }}></div>
          <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '0 6px' }}>香り高い</div>
          <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '0 6px' }}>穏やか</div>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontWeight: 700, color: '#8B8273' }}>淡麗</div>
          <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontWeight: 700, color: '#8B8273' }}>濃醇</div>
          {v.ku.dots.map((kd: any, i: number) => (
            <Fragment key={i}>
              <div style={{ position: 'absolute', left: `${kd.left}%`, top: `${kd.top}%`, transform: 'translate(-50%, -50%)', width: 12, height: 12, borderRadius: '50%', background: '#32507C' }}></div>
              <div style={{ position: 'absolute', left: `${kd.left}%`, top: `${kd.top}%`, transform: 'translate(10px, -6px)', fontSize: 10, color: '#5C5547', maxWidth: 130 }}>{kd.label}</div>
            </Fragment>
          ))}
        </div>
      </div>
      {v.ku.hasCups && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '20px 22px' }}>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>この蔵でのわたしの盃</div>
          {v.ku.cups.map((kc: any, i: number) => (
            <div key={i} onClick={kc.click} style={{ padding: '12px 0', borderBottom: '1px solid #F0EADC', cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{kc.name}</span>
                <span style={{ color: '#BC6A2D', fontSize: 12, letterSpacing: 2 }}>{kc.stars}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#A89D8A' }}>{kc.date}</span>
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.8, color: '#5C5547' }}>{kc.memo}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
