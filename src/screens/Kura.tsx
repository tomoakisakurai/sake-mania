/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
export function Kura({ v }: { v: any }) {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: v.pagePadTight }}>
      <div onClick={v.goMap} style={{ fontSize: 13, color: '#8B8273', cursor: 'pointer', marginBottom: 24 }}>← 酒蔵マップにもどる</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.18em', color: '#8B8273', marginBottom: 10 }}>SAKE BREWERY</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 34, fontWeight: 700 }}>{v.ku.name}</div>
        {v.ku.hasCups && (<span style={{ background: '#BC6A2D', color: '#FDFBF5', borderRadius: 999, padding: '4px 14px', fontSize: 11.5, fontWeight: 700 }}>呑んだことのある蔵</span>)}
      </div>
      <div style={{ fontSize: 13, color: '#8B8273', marginBottom: 18 }}>{v.ku.meta}</div>
      <div style={{ fontSize: 14, lineHeight: 2.1, color: '#5C5547', maxWidth: 620, marginBottom: 28 }}>{v.ku.desc}</div>
      <div style={{ display: 'flex', gap: 32, marginBottom: 36 }}>
        <div><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700 }}>{v.ku.brandCount}</div><div style={{ fontSize: 12, color: '#8B8273' }}>図鑑の銘柄</div></div>
        <div style={{ borderLeft: '1px solid #E3DBCB', paddingLeft: 32 }}><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700 }}>{v.ku.totalRecs}</div><div style={{ fontSize: 12, color: '#8B8273' }}>みんなの記録</div></div>
        <div style={{ borderLeft: '1px solid #E3DBCB', paddingLeft: 32 }}><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700, color: '#BC6A2D' }}>{v.ku.myCupCount}</div><div style={{ fontSize: 12, color: '#8B8273' }}>わたしの盃</div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: v.kuraCols, gap: 28, alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700, borderBottom: '1px solid #E3DBCB', paddingBottom: 10, marginBottom: 16 }}>この蔵の銘柄</div>
          <div style={{ display: 'grid', gridTemplateColumns: v.kuraBrandCols, gap: 14 }}>
            {v.ku.brands.map((kb2: any, i: number) => (
              <div key={i} onClick={kb2.click} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 9, cursor: 'pointer' }}>
                <div style={{ height: 100, borderRadius: 8, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#8B8273' }}>ボトル写真</span></div>
                <div><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15.5, fontWeight: 700, lineHeight: 1.4 }}>{kb2.name}</div><div style={{ fontSize: 11, color: '#8B8273', marginTop: 3 }}>{kb2.cls}</div></div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#5C5547' }}>精米{kb2.polish} ・ {kb2.rice}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
                  <div style={{ flex: 1, height: 4, background: '#EFE8D8', borderRadius: 2, position: 'relative' }}><div style={{ position: 'absolute', left: 0, width: `${kb2.pct}%`, height: 4, background: '#32507C', borderRadius: 2 }}></div></div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#32507C' }}>{kb2.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
      </div>
    </div>
  );
}
