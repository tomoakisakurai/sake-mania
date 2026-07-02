'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { useReferenceData } from '@/components/Providers';
import { paths } from '@/lib/routes';
import { getProfileById, type ProfileView } from '@/app/actions/profile';
import { getMemberHistoryById, type MemberHistory } from '@/app/actions/members';
import { Loading } from '@/components/shared/Loading';
import { ProfileHeader } from './ProfileHeader';
import { Stats } from './Stats';
import { BringCard, type BringItem } from './BringCard';
import { RecordCard, type RecordItem } from './RecordCard';
import { AttendedMeetups, type AttendedMeetup } from './AttendedMeetups';

export function Member({ memberId }: { memberId: string }) {
  const store = useStore();
  const router = useRouter();
  const isMobile = useStore((s) => s.vw < 768);
  const pagePadding = isMobile ? '20px 18px 130px' : '32px 40px 80px';
  const isMe = store.user?.id === memberId;
  const { brands } = useReferenceData();

  const [profile, setProfile] = useState<ProfileView | null>(null);
  const [history, setHistory] = useState<MemberHistory>({ attended: [], brings: [], mvpCount: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    setLoaded(false);
    Promise.all([
      getProfileById(memberId),
      getMemberHistoryById(memberId),
    ]).then(([p, h]) => {
      if (!active) return;
      setProfile(p);
      setHistory(h);
      setLoaded(true);
    });
    return () => { active = false; };
  }, [memberId]);

  if (!loaded) {
    return <main style={{ maxWidth: 880, margin: '0 auto', padding: pagePadding }}><Loading /></main>;
  }

  if (!profile) {
    return (
      <main style={{ maxWidth: 880, margin: '0 auto', padding: pagePadding }}>
        <a onClick={() => store.nav('members')} className="mb-6 block cursor-pointer text-[13px] text-muted transition-colors hover:text-primary">← メンバー出身地マップにもどる</a>
        <h1 className="m-0 font-serif text-[22px] font-bold">メンバーが見つかりません</h1>
      </main>
    );
  }

  // 記録: 自分なら myRecords、他人は未対応(別タスクで対応)
  const records: RecordItem[] = isMe
    ? store.myRecords.map((r) => ({ brandId: r.brandId, rating: r.rating, memo: r.memo, date: r.date }))
    : [];

  const attended: AttendedMeetup[] = history.attended.map((a) => ({
    meetupId: a.meetupId, name: a.name, dateShort: a.dateShort,
  }));
  const brings: BringItem[] = history.brings.map((b) => ({
    meetName: b.meetName, dateShort: b.dateShort, brandId: b.brandId, note: b.note, isMvp: b.isMvp,
  }));

  const brandById = (id: string) => brands.find((b) => b.id === id);

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: pagePadding }}>
      <a onClick={() => store.nav('members')} className="mb-6 block cursor-pointer text-[13px] text-muted transition-colors hover:text-primary">← メンバー出身地マップにもどる</a>

      <ProfileHeader profile={profile} onHometownClick={() => store.nav('members')} />

      <Stats recCount={records.length} bringCount={brings.length} mvpCount={history.mvpCount} />

      <AttendedMeetups attended={attended} />

      <section className="mb-8">
        <h2 className="m-0 mb-4 border-b border-line pb-2.5 font-serif text-[18px] font-bold">SAKE MEETUPでの持ち寄り</h2>
        {brings.length > 0 ? (
          <div className="flex flex-col gap-3">
            {brings.map((b, i) => (
              <BringCard
                key={i}
                bring={b}
                brand={brandById(b.brandId)}
                onClick={() => router.push(paths.detail(b.brandId))}
              />
            ))}
          </div>
        ) : (
          <p className="m-0 text-[12.5px] text-faint">まだSAKE MEETUPでの持ち寄り記録はありません。</p>
        )}
      </section>

      <section>
        <h2 className="m-0 mb-4 border-b border-line pb-2.5 font-serif text-[18px] font-bold">最近の記録</h2>
        {records.length > 0 ? (
          <div className="flex flex-col gap-3">
            {records.slice(0, 10).map((r, i) => (
              <RecordCard
                key={i}
                record={r}
                brand={brandById(r.brandId)}
                onClick={() => router.push(paths.detail(r.brandId))}
              />
            ))}
          </div>
        ) : (
          <p className="m-0 text-[12.5px] text-faint">まだ記録はありません。</p>
        )}
      </section>
    </main>
  );
}
