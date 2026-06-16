import type { Vals } from '@/useVals';
import { FeedCard } from '@/components/shared/FeedCard';

export function Feed({ vals }: { vals: Vals }) {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: vals.pagePad }}>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>みんなの利き酒帳</div>
      <div style={{ fontSize: 13, color: '#8B8273', marginBottom: 26 }}>{vals.feedCount}件の記録 — 気になる一杯をタップ</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {vals.feedAll.map((f, i: number) => (
          <FeedCard key={i} f={f} />
        ))}
      </div>
    </div>
  );
}
