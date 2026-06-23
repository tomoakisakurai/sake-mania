'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Vals } from '@/useVals';
import { useStore } from '@/store';
import { getMyProfile, type ProfileView } from '@/app/actions/profile';
import { ProfileHeader } from './ProfileHeader';
import { Achievements } from './Achievements';
import { RecordList } from './RecordList';
import { TasteMap } from './TasteMap';
import { WantList } from './WantList';
import { ProfileEditModal } from './ProfileEditModal';

export function MyPage({ vals }: { vals: Vals }) {
  const authReady = useStore((s) => s.authReady);
  const userId = useStore((s) => s.user?.name);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileView | null>(null);

  const prefOptions = useMemo(() => vals.prefGrid.map((p) => p[0] as string), [vals.prefGrid]);

  const reload = useCallback(async () => {
    const p = await getMyProfile();
    setProfile(p);
  }, []);

  // 認証が確定したら / ユーザーが変わったら プロフィールをDBから取得
  useEffect(() => {
    if (!authReady) return;
    if (!userId) { setProfile(null); return; }
    reload();
  }, [authReady, userId, reload]);

  return (
    <main className="mx-auto max-w-300" style={{ padding: vals.pagePad }}>
      <ProfileHeader vals={vals} profile={profile} onEdit={() => setEditing(true)} />
      <Achievements vals={vals} />
      <div className="grid items-start gap-8" style={{ gridTemplateColumns: vals.myCols }}>
        <RecordList vals={vals} />
        <aside className="flex flex-col gap-6">
          <TasteMap vals={vals} />
          <WantList vals={vals} />
        </aside>
      </div>
      <ProfileEditModal
        open={editing}
        onClose={() => setEditing(false)}
        prefOptions={prefOptions}
        onSaved={reload}
      />
    </main>
  );
}
