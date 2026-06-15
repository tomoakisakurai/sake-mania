/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Vals } from '@/useVals';
import { FeedCard } from '@/components/shared/FeedCard';
import { Hero } from './Hero';
import { TasteMap } from './TasteMap';
import { SpMeetupCards } from './SpMeetupCards';
import { MeetupSidebar } from './MeetupSidebar';

export function Home({ v }: { v: Vals }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: v.pagePad }}>
      <SpMeetupCards v={v} />
      <Hero v={v} />
      <TasteMap v={v} />

      {/* フィード抜粋 + サイドバー */}
      <div style={{ display: 'grid', gridTemplateColumns: v.homeSplitCols, gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid #E3DBCB', paddingBottom: 10 }}>
            <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700 }}>みんなの利き酒帳</div>
            <div onClick={v.goFeed} style={{ fontSize: 13, color: '#32507C', fontWeight: 700, cursor: 'pointer' }}>すべて見る →</div>
          </div>
          {v.feedItems.map((f: any, i: number) => (
            <FeedCard key={i} f={f} pad="20px 24px" />
          ))}
        </div>
        <MeetupSidebar v={v} />
      </div>
    </div>
  );
}
