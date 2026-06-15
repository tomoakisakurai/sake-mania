import type { Vals } from '@/useVals';
import { ProfileHeader } from './ProfileHeader';
import { Achievements } from './Achievements';
import { RecordList } from './RecordList';
import { Sidebar } from './Sidebar';

export function MyPage({ v }: { v: Vals }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: v.pagePad }}>
      <ProfileHeader v={v} />
      <Achievements v={v} />
      <div style={{ display: 'grid', gridTemplateColumns: v.myCols, gap: 32, alignItems: 'start' }}>
        <RecordList v={v} />
        <Sidebar v={v} />
      </div>
    </div>
  );
}
