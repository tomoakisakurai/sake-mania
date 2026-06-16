import type { Vals } from '@/useVals';

export function TabBar({ vals }: { vals: Vals }) {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60, display: 'grid', gridTemplateColumns: '1fr 1fr 76px 1fr 1fr', alignItems: 'center', background: '#FDFBF5', borderTop: '1px solid #E3DBCB', padding: '12px 8px 20px' }}>
      {vals.tabLeft.map((tb, i: number) => (
        <div key={i} onClick={tb.click} style={{ textAlign: 'center', fontSize: 11.5, cursor: 'pointer', padding: '6px 0', color: tb.color, fontWeight: tb.weight }}>{tb.label}</div>
      ))}
      <div style={{ textAlign: 'center', marginTop: -30 }}>
        <div onClick={vals.startRecordClick} style={{ width: 54, height: 54, borderRadius: '50%', background: '#32507C', color: '#FDFBF5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 400, boxShadow: '0 4px 14px rgba(50,80,124,0.35)', cursor: 'pointer' }}>＋</div>
      </div>
      {vals.tabRight.map((tb, i: number) => (
        <div key={i} onClick={tb.click} style={{ textAlign: 'center', fontSize: 11.5, cursor: 'pointer', padding: '6px 0', color: tb.color, fontWeight: tb.weight }}>{tb.label}</div>
      ))}
    </div>
  );
}
