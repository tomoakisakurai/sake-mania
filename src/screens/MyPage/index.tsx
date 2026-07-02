'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useMyPageVals } from './useMyPageVals';
import { useStore } from '@/store';
import { getMyProfile, type ProfileView } from '@/app/actions/profile';
import { useReferenceData } from '@/components/Providers';
import { useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { Achievements } from './Achievements';
import { RecordList } from './RecordList';
import { TasteMap } from './TasteMap';
import { WantList } from './WantList';
import { ProfileEditModal } from './ProfileEditModal';

export function MyPage() {
  const my = useMyPageVals();
  const authReady = useStore((s) => s.authReady);
  const userId = useStore((s) => s.user?.id);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // モーダル状態は URL クエリ ?edit=1 で管理。ナビのドロップダウンや
  // ハンバーガーメニュー、マイページの編集ボタン、どこからでも開ける。
  const editing = searchParams.get('edit') === '1';
  const [profile, setProfile] = useState<ProfileView | null>(null);

  const { prefGrid } = useReferenceData();
  const prefOptions = useMemo(() => prefGrid.map((p) => p[0] as string), [prefGrid]);

  const reload = useCallback(async () => {
    const p = await getMyProfile();
    setProfile(p);
    // 表示名の source of truth は profiles。ニックネーム変更を
    // ナビ/ヘッダー(store.user 経由)にも即時反映する。
    const store = useStore.getState();
    if (p && store.user) {
      store.setUser({ ...store.user, name: p.nickname, avatar: p.avatar });
    }
  }, []);

  const openEdit = () => router.replace(`${pathname}?edit=1`, { scroll: false });
  const closeEdit = () => router.replace(pathname, { scroll: false });

  // 認証が確定したら / ユーザーが変わったら プロフィールをDBから取得
  useEffect(() => {
    if (!authReady) return;
    if (!userId) { setProfile(null); return; }
    reload();
  }, [authReady, userId, reload]);

  return (
    <main className="mx-auto max-w-300 px-4.5 pt-7 pb-32.5 md:px-10 md:pt-10 md:pb-20">
      <ProfileHeader my={my} profile={profile} onEdit={openEdit} />
      <Achievements my={my} />
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_380px]">
        <RecordList my={my} />
        <aside className="flex flex-col gap-6">
          <TasteMap my={my} />
          <WantList my={my} />
        </aside>
      </div>
      <ProfileEditModal
        open={editing}
        onClose={closeEdit}
        prefOptions={prefOptions}
        onSaved={reload}
      />
    </main>
  );
}
