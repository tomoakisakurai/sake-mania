import { useStore } from '@/store';
import type { Vals } from '@/useVals';
import type { MapVM } from './useMapState';

// 酒蔵マップモード: 47都道府県タイル + 凡例 と、選択県の蔵リスト(未選択時は県チップ)
export function KuraMode({ vals, map }: { vals: Vals; map: MapVM }) {
  const isAdmin = useStore((s) => s.user?.isAdmin ?? false);
  return (
    <>
      <div style={{ fontSize: 13, color: '#8B8273', marginBottom: 24 }}>色のついた県をタップすると、その県の蔵が見られます。呑んだ蔵のある県は朱に染まります。</div>
      <div style={{ display: 'grid', gridTemplateColumns: vals.mapCols, gap: 24, alignItems: 'start' }}>
        <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: vals.mapPanelPad }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: vals.mapGap }}>
            {map.prefTiles.map((p, i: number) => (
              <div key={i} onClick={p.click} style={{ gridColumn: p.col, gridRow: p.row, aspectRatio: 1, borderRadius: 6, background: p.bg, color: p.color, border: p.border, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, cursor: p.cursor }}>
                <span style={{ fontSize: p.fs, fontWeight: 700, lineHeight: 1.1 }}>{p.name}</span>
                {p.hasCount && (<span style={{ fontSize: p.fsSub, opacity: 0.85 }}>{p.countLabel}</span>)}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 18, fontSize: 11.5, color: '#5C5547', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: '#BC6A2D', display: 'inline-block' }}></span>呑んだ蔵がある県</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: '#32507C', display: 'inline-block' }}></span>図鑑に蔵がある県</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: '#F3EDDF', border: '1px solid #E3DBCB', display: 'inline-block' }}></span>これからの県</span>
          </div>
        </div>
        <div>
          {map.mapHasSel && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 19, fontWeight: 700, borderBottom: '1px solid #E3DBCB', paddingBottom: 10 }}>{map.mapSelPref}の蔵</div>
              {map.mapKuras.map((k, i: number) => (
                <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '20px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <div onClick={k.nameClick} style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>{k.name} →</div>
                    {k.hasCups && (<span style={{ background: '#BC6A2D', color: '#FDFBF5', borderRadius: 999, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>{k.cupsLabel}</span>)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 11.5, color: '#8B8273' }}>{k.meta}</div>
                    <a href={k.gmapLink} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#32507C', fontWeight: 700, textDecoration: 'none' }}>Googleマップ →</a>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {k.brands.map((kb: { label: string; click: () => void }, j: number) => (
                      <span key={j} onClick={kb.click} style={{ cursor: 'pointer', background: '#F6F1E7', border: '1px solid #E3DBCB', borderRadius: 999, padding: '6px 14px', fontSize: 12, color: '#2E2A24', fontWeight: 500 }}>{kb.label} →</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {map.mapNoSel && (
            <>
              <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: '22px 24px' }}>
                <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>蔵のある県</div>
                <div style={{ fontSize: 12.5, color: '#8B8273', lineHeight: 1.8, marginBottom: 14 }}>マップの色つきの県、または下の県名をタップ。</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {map.prefChipList.map((pc, i: number) => (
                    <span key={i} onClick={pc.click} style={{ cursor: 'pointer', background: pc.bg, color: '#FDFBF5', borderRadius: 999, padding: '7px 16px', fontSize: 12.5, fontWeight: 700 }}>{pc.label}</span>
                  ))}
                </div>
              </div>
              {isAdmin && (
                <div onClick={vals.openKuraReg} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '18px 22px', marginTop: 14, cursor: 'pointer' }}>
                  <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 14.5, fontWeight: 700, marginBottom: 4 }}>載っていない蔵がありますか?</div>
                  <div style={{ fontSize: 12, color: '#8B8273', lineHeight: 1.7 }}>あなたの好きな酒蔵を図鑑に追加申請できます <span style={{ color: '#32507C', fontWeight: 700 }}>→ 蔵を登録する</span></div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
