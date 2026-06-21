import type { Vals } from '@/useVals';
import { ProfileHeader } from './ProfileHeader';
import { Achievements } from './Achievements';
import { RecordList } from './RecordList';
import { TasteMap } from './TasteMap';
import { WantList } from './WantList';

export function MyPage({ vals }: { vals: Vals }) {
  return (
    <main className="mx-auto max-w-300" style={{ padding: vals.pagePad }}>
      <ProfileHeader vals={vals} />
      <Achievements vals={vals} />
      <div className="grid items-start gap-8" style={{ gridTemplateColumns: vals.myCols }}>
        <RecordList vals={vals} />
        <aside className="flex flex-col gap-6">
          <TasteMap vals={vals} />
          <WantList vals={vals} />
        </aside>
      </div>
    </main>
  );
}
