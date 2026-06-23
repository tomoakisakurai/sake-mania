'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import type { Vals } from '@/useVals';
import { paths } from '@/lib/routes';
import { getProfileByNickname, type ProfileView } from '@/app/actions/profile';
import { Loading } from '@/components/shared/Loading';
import { ProfileHeader } from './ProfileHeader';
import { Stats } from './Stats';
import { BringCard, type BringItem } from './BringCard';
import { RecordCard, type RecordItem } from './RecordCard';
import { AttendedMeetups, type AttendedMeetup } from './AttendedMeetups';

export function Member({ vals, memberName }: { vals: Vals; memberName: string }) {
  const store = useStore();
  const router = useRouter();
  const isMobile = useStore((s) => s.vw < 768);
  const pagePadding = isMobile ? '20px 18px 130px' : '32px 40px 80px';
  const isMe = store.user?.name === memberName;

  // 表示するメンバーのDBプロフィールを取得
  const [profile, setProfile] = useState<ProfileView | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    setLoaded(false);
    getProfileByNickname(memberName).then((p) => {
      if (!active) return;
      setProfile(p);
      setLoaded(true);
    });
    return () => { active = false; };
  }, [memberName]);

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

  // 持ち寄り集計(meetupsシードのbring/lineupから)。シード上は memberName と
  // 一致するときだけマッチするので、まだ持ち寄り履歴のない実ユーザーは空配列になる。
  const brings: BringItem[] = [];
  for (const meet of vals.allMeetups) {
    for (const b of meet.bring || []) {
      if (b.member === memberName) brings.push({ meetName: meet.name, dateShort: meet.dateShort, brandId: b.brandId, note: b.note, isMvp: false });
    }
    for (const lp of meet.lineup || []) {
      if (lp.broughtBy === memberName) brings.push({ meetName: meet.name, dateShort: meet.dateShort, brandId: lp.brandId, note: lp.comment, isMvp: false });
    }
  }
  for (const meet of vals.allMeetups) {
    if (!meet.lineup) continue;
    const top = [...meet.lineup].sort((a, b) => b.votes - a.votes)[0];
    if (top && top.broughtBy === memberName) {
      brings.forEach((bb) => { if (bb.meetName === meet.name && bb.brandId === top.brandId) bb.isMvp = true; });
    }
  }
  const mvpCount = brings.filter((b) => b.isMvp).length;

  // 参加履歴: going/bring/lineup のいずれかに名前があれば参加とみなす
  const attended: AttendedMeetup[] = [];
  for (const meet of vals.allMeetups) {
    const inGoing = (meet.going || []).includes(memberName);
    const inBring = (meet.bring || []).some((b) => b.member === memberName);
    const inLineup = (meet.lineup || []).some((lp) => lp.broughtBy === memberName);
    if (inGoing || inBring || inLineup) {
      attended.push({ meetupId: meet.id, name: meet.name, dateShort: meet.dateShort });
    }
  }

  // 記録: 自分なら myRecords、他人ならまだ未対応(他人の記録はDBにないため空)
  const records: RecordItem[] = isMe
    ? store.myRecords.map((r) => ({ brandId: r.brandId, rating: r.rating, memo: r.memo, date: r.date }))
    : vals.allOthers.filter((o) => o.user === memberName).map((o) => ({ brandId: o.brandId, rating: o.rating, memo: o.memo, date: o.date }));

  const brandById = (id: string) => vals.allBrands.find((b) => b.id === id);

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: pagePadding }}>
      <a onClick={() => store.nav('members')} className="mb-6 block cursor-pointer text-[13px] text-muted transition-colors hover:text-primary">← メンバー出身地マップにもどる</a>

      <ProfileHeader profile={profile} onHometownClick={() => store.nav('members')} />

      <Stats recCount={records.length} bringCount={brings.length} mvpCount={mvpCount} />

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
