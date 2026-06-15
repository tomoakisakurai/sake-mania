/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Vals } from '@/useVals';
import { KuraMode } from './KuraMode';
import { BarsMode } from './BarsMode';

export function Map({ v }: { v: Vals }) {
  return (
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: v.pagePad }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginBottom: 4 }}>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700 }}>酒蔵マップ</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#8B8273' }}>{v.mapStats}</div>
        <div onClick={v.openKuraReg} style={{ marginLeft: 'auto', border: '1px solid #32507C', color: '#32507C', borderRadius: 999, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>＋ 蔵を登録する</div>
      </div>
      <div style={{ display: 'inline-flex', background: '#F3EDDF', borderRadius: 999, padding: 4, marginBottom: 20 }}>
        <div onClick={v.setMapKura} style={{ borderRadius: 999, padding: '8px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: v.kuraTabBg, color: v.kuraTabColor }}>酒蔵マップ</div>
        <div onClick={v.setMapBars} style={{ borderRadius: 999, padding: '8px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: v.barsTabBg, color: v.barsTabColor }}>飲める店</div>
      </div>
      {v.mapModeKura && <KuraMode v={v} />}
      {v.mapModeBars && <BarsMode v={v} />}
    </div>
  );
}
