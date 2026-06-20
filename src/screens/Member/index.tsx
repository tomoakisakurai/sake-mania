'use client';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import type { Vals } from '@/useVals';
import { paths } from '@/lib/routes';
import { ProfileHeader } from './ProfileHeader';
import { Stats } from './Stats';
import { BringCard, type BringItem } from './BringCard';
import { RecordCard, type RecordItem } from './RecordCard';

export function Member({ vals, memberName }: { vals: Vals; memberName: string }) {
  const store = useStore();
  const router = useRouter();
  const isMobile = useStore((s) => s.vw < 768);
  const pagePadding = isMobile ? '20px 18px 130px' : '32px 40px 80px';

  const member = vals.allMembers.find((m) => m.name === memberName);
  const isMe = store.user?.name === memberName;

  if (!member) {
    return (
      <main style={{ maxWidth: 880, margin: '0 auto', padding: pagePadding }}>
        <a onClick={() => store.nav('members')} className="block text-[13px] text-muted cursor-pointer mb-6 hover:text-primary transition-colors">← メンバー出身地マップにもどる</a>
        <h1 className="font-serif text-[22px] font-bold m-0">メンバーが見つかりません</h1>
      </main>
    );
  }

  // 持ち寄り集計（meetupsシードのbring/lineupから）
  const brings: BringItem[] = [];
  for (const meet of vals.allMeetups) {
    for (const b of meet.bring || []) {
      if (b.member === memberName) brings.push({ meetName: meet.name, dateShort: meet.dateShort, brandId: b.brandId, note: b.note, isMvp: false });
    }
    for (const lp of meet.lineup || []) {
      if (lp.broughtBy === memberName) brings.push({ meetName: meet.name, dateShort: meet.dateShort, brandId: lp.brandId, note: lp.comment, isMvp: false });
    }
  }
  // MVP集計: 各meetupでvotes最多の銘柄をbroughtByしている人にMVPフラグを立てる
  for (const meet of vals.allMeetups) {
    if (!meet.lineup) continue;
    const top = [...meet.lineup].sort((a, b) => b.votes - a.votes)[0];
    if (top && top.broughtBy === memberName) {
      brings.forEach((bb) => { if (bb.meetName === meet.name && bb.brandId === top.brandId) bb.isMvp = true; });
    }
  }
  const mvpCount = brings.filter((b) => b.isMvp).length;

  // 記録: 自分なら myRecords、他人なら others(シード)
  const records: RecordItem[] = isMe
    ? store.myRecords.map((r) => ({ brandId: r.brandId, rating: r.rating, memo: r.memo, date: r.date }))
    : vals.allOthers.filter((o) => o.user === memberName).map((o) => ({ brandId: o.brandId, rating: o.rating, memo: o.memo, date: o.date }));

  const brandById = (id: string) => vals.allBrands.find((b) => b.id === id);

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: pagePadding }}>
      <a onClick={() => store.nav('members')} className="block text-[13px] text-muted cursor-pointer mb-6 hover:text-primary transition-colors">← メンバー出身地マップにもどる</a>

      <ProfileHeader member={member} onHometownClick={() => store.nav('members')} />

      {member.hometownNote && (
        <blockquote className="bg-surface border-l-[3px] border-accent px-4 py-3.5 mb-7 text-[13.5px] leading-loose text-body m-0">「{member.hometownNote}」</blockquote>
      )}

      <Stats recCount={records.length} bringCount={brings.length} mvpCount={mvpCount} />

      <section className="mb-8">
        <h2 className="font-serif text-[18px] font-bold border-b border-line pb-2.5 mb-4 m-0">SAKE MEETUPでの持ち寄り</h2>
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
          <p className="text-[12.5px] text-faint m-0">まだSAKE MEETUPでの持ち寄り記録はありません。</p>
        )}
      </section>

      <section>
        <h2 className="font-serif text-[18px] font-bold border-b border-line pb-2.5 mb-4 m-0">最近の記録</h2>
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
          <p className="text-[12.5px] text-faint m-0">まだ記録はありません。</p>
        )}
      </section>
    </main>
  );
}
