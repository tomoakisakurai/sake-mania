/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Vals } from '@/useVals';
import { Picked } from './Picked';
import { Search } from './Search';

export function Declare({ v }: { v: Vals }) {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: v.pagePadTight }}>
      <div onClick={v.declare.cancel} style={{ fontSize: 13, color: "#8B8273", cursor: "pointer", marginBottom: 24 }}>← SAKE MEETUPにもどる</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.18em", color: "#BC6A2D", marginBottom: 10 }}>持ち寄り宣言</div>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700, lineHeight: 1.45, marginBottom: 6 }}>何を持っていく?</div>
      <div style={{ fontSize: 13, color: "#8B8273", marginBottom: 24 }}>{v.declare.meetName} に持ち寄る一本を宣言します。</div>

      {v.declare.picked && <Picked v={v} />}
      {v.declare.notPicked && <Search v={v} />}
    </div>
  );
}
