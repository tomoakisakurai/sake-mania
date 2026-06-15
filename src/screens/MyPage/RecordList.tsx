/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Vals } from '@/useVals';
// マイページ: わたしの利き酒帳(自分の記録一覧)
export function RecordList({ v }: { v: Vals }) {
  return (
    <div>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700, borderBottom: '1px solid #E3DBCB', paddingBottom: 10, marginBottom: 16 }}>わたしの利き酒帳</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {v.myList.map((m: any, i: number) => (
          <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '18px 22px', display: 'flex', gap: 16 }}>
            {m.hasPhoto && (<img src={m.photo} alt="" style={{ width: 56, height: 76, flexShrink: 0, borderRadius: 4, objectFit: 'cover' }} />)}
            {m.noPhoto && (<div style={{ width: 56, height: 76, flexShrink: 0, borderRadius: 4, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }}></div>)}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div onClick={m.click} style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 16.5, fontWeight: 700, cursor: 'pointer' }}>{m.name}</div>
                <div style={{ fontSize: 11.5, color: '#8B8273' }}>{m.sub}</div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: '#BC6A2D', fontSize: 13, letterSpacing: 2 }}>{m.stars}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#A89D8A' }}>{m.date}</span>
                </div>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.9, color: '#5C5547', marginBottom: 8 }}>{m.memo}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {m.tags.map((mt: any, j: number) => (
                  <span key={j} style={{ background: '#F6F1E7', borderRadius: 999, padding: '3px 12px', fontSize: 11, color: '#5C5547' }}>{mt}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
