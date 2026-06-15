import type { Vals } from '@/useVals';
import { Header } from './Header';
import { MediaColumn } from './MediaColumn';
import { TasteColumn } from './TasteColumn';
import { Comments } from './Comments';

export function Post({ v }: { v: Vals }) {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: v.pagePadTight }}>
      <div onClick={v.goFeed} style={{ fontSize: 13, color: '#8B8273', cursor: 'pointer', marginBottom: 22 }}>← みんなの利き酒帳にもどる</div>
      <div style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 16, padding: v.postCardPad }}>
        <Header v={v} />
        <div style={{ display: 'grid', gridTemplateColumns: v.postCols, gap: 32 }}>
          <MediaColumn v={v} />
          <TasteColumn v={v} />
        </div>
        <Comments v={v} />
      </div>
    </div>
  );
}
