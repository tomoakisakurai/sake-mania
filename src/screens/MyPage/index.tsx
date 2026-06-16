import type { Vals } from '@/useVals';
import { ProfileHeader } from './ProfileHeader';
import { Achievements } from './Achievements';
import { RecordList } from './RecordList';
import { Sidebar } from './Sidebar';

export function MyPage({ vals }: { vals: Vals }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: vals.pagePad }}>
      <ProfileHeader vals={vals} />
      <Achievements vals={vals} />
      <div style={{ display: 'grid', gridTemplateColumns: vals.myCols, gap: 32, alignItems: 'start' }}>
        <RecordList vals={vals} />
        <Sidebar vals={vals} />
      </div>
    </div>
  );
}
