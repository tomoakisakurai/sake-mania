/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Vals } from '@/useVals';
import { BeforePhase } from './BeforePhase';
import { ReviewPhase } from './ReviewPhase';

export function Meetup({ v }: { v: Vals }) {
  const m = v.meetup;
  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: v.pagePadTight }}>
      <div onClick={m.backHome} style={{ fontSize: 13, color: '#8B8273', cursor: 'pointer', marginBottom: 24 }}>← ホームにもどる</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.18em', color: '#BC6A2D' }}>SAKE MEETUP</div>
        <span style={{ background: m.phaseBg, color: '#FDFBF5', borderRadius: 999, padding: '2px 12px', fontSize: 11, fontWeight: 700 }}>{m.phaseLabel}</span>
      </div>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 32, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, marginTop: 6 }}>{m.name}</div>
      <div style={{ fontSize: 13.5, color: '#8B8273', marginBottom: 4 }}>{m.dateLabel} ・ {m.place}</div>
      <div style={{ fontSize: 13, color: '#5C5547', marginBottom: 24 }}>テーマ:{m.theme} ・ 幹事 {m.hostName}</div>

      {m.isBefore && <BeforePhase v={v} />}
      {m.showLineup && <ReviewPhase v={v} />}
    </div>
  );
}
