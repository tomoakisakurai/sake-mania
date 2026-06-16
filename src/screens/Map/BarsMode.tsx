import type { Vals } from '@/useVals';
import type { MapVM } from './useMapState';

// 飲める店モード: 店リスト + 選択店の詳細(地図埋め込み + 提供銘柄)
export function BarsMode({ vals, map }: { vals: Vals; map: MapVM }) {
  return (
    <>
      <div style={{ fontSize: 13, color: '#8B8273', marginBottom: 24 }}>銘酒を飲める居酒屋・角打ちを集めました。店をタップすると地図と提供銘柄が見られます。</div>
      <div style={{ display: 'grid', gridTemplateColumns: vals.mapCols, gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {map.barList.map((bar, i: number) => (
            <div key={i} onClick={bar.click} style={{ border: '1px solid #E3DBCB', borderRadius: 12, padding: '16px 18px', cursor: 'pointer', background: bar.bg, color: bar.color }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 16, fontWeight: 700 }}>{bar.name}</div>
                <span style={{ fontSize: 10.5, border: '1px solid currentColor', borderRadius: 999, padding: '1px 9px', opacity: 0.75 }}>{bar.type}</span>
              </div>
              <div style={{ fontSize: 11.5, marginTop: 3, color: bar.subColor }}>{bar.area}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700 }}>{map.barView.name}</div>
              <span style={{ fontSize: 11, color: '#8B8273' }}>{map.barView.type} ・ {map.barView.area}</span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.9, color: '#5C5547', marginBottom: 14 }}>{map.barView.note}</div>
            <iframe src={map.barView.mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: '100%', height: 240, border: 0, borderRadius: 8, display: 'block', background: '#EFE8D8', marginBottom: 12 }}></iframe>
            <a href={map.barView.mapLink} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#32507C', fontWeight: 700, textDecoration: 'none' }}>Googleマップで開く →</a>
            <div style={{ fontSize: 12, fontWeight: 700, margin: '16px 0 8px', borderTop: '1px solid #E3DBCB', paddingTop: 14 }}>飲める銘柄</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {map.barView.brands.map((bb, i: number) => (
                <span key={i} onClick={bb.click} style={{ cursor: 'pointer', background: '#F6F1E7', border: '1px solid #E3DBCB', borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 500 }}>{bb.label} →</span>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#A89D8A', lineHeight: 1.7 }}>※ 提供銘柄は時期により変わります。お出かけ前にお店へご確認ください。</div>
        </div>
      </div>
    </>
  );
}
