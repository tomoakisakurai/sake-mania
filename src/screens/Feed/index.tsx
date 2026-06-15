/* eslint-disable @typescript-eslint/no-explicit-any */
import { FeedCard } from '@/components/shared/FeedCard';

export function Feed({ v }: { v: any }) {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: v.pagePad }}>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>みんなの利き酒帳</div>
      <div style={{ fontSize: 13, color: '#8B8273', marginBottom: 26 }}>{v.feedCount}件の記録 — 気になる一杯をタップ</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {v.feedAll.map((f: any, i: number) => (
          <FeedCard key={i} f={f} />
        ))}
      </div>
    </div>
  );
}
