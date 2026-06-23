'use client';
import { useMemo, useState } from 'react';
import type { Vals } from '@/useVals';
import { ProfileHeader } from './ProfileHeader';
import { Achievements } from './Achievements';
import { RecordList } from './RecordList';
import { TasteMap } from './TasteMap';
import { WantList } from './WantList';
import { ProfileEditModal } from './ProfileEditModal';

export function MyPage({ vals }: { vals: Vals }) {
  const [editing, setEditing] = useState(false);
  // 出身地selectの選択肢は prefGrid から名前だけ抜き出す(47都道府県)
  const prefOptions = useMemo(() => vals.prefGrid.map((p) => p[0] as string), [vals.prefGrid]);
  return (
    <main className="mx-auto max-w-300" style={{ padding: vals.pagePad }}>
      <ProfileHeader vals={vals} onEdit={() => setEditing(true)} />
      <Achievements vals={vals} />
      <div className="grid items-start gap-8" style={{ gridTemplateColumns: vals.myCols }}>
        <RecordList vals={vals} />
        <aside className="flex flex-col gap-6">
          <TasteMap vals={vals} />
          <WantList vals={vals} />
        </aside>
      </div>
      <ProfileEditModal open={editing} onClose={() => setEditing(false)} prefOptions={prefOptions} />
    </main>
  );
}
