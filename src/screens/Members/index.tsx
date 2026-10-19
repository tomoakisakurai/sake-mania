'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useStore } from '@/store';
import { listMembers, type MemberRow } from '@/app/actions/members';
import { PrefMap } from './PrefMap';
import { HometownPanel } from './HometownPanel';
import { Loading } from '@/components/shared/Loading';
import { Button } from '@/components/shared/Button';

export function Members() {
  const store = useStore();
  const authReady = useStore((s) => s.authReady);
  const isLoggedIn = useStore((s) => !!s.user);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // 選択中の都道府県は URL クエリ `?pref=X` で保持。
  // メンバー詳細から戻ったときに選択状態が復元できるようにするため。
  const selectedPref = searchParams.get('pref');
  const [members, setMembers] = useState<MemberRow[] | null>(null);

  useEffect(() => {
    if (!authReady || !isLoggedIn) return;
    let active = true;
    listMembers().then((rows) => { if (active) setMembers(rows); });
    return () => { active = false; };
  }, [authReady, isLoggedIn]);

  const setSelectedPref = useCallback((pref: string | null) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (pref) sp.set('pref', pref);
    else sp.delete('pref');
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [router, pathname, searchParams]);

  // 出身地ごとにメンバーを集計
  const membersByPref = new Map<string, MemberRow[]>();
  for (const member of members ?? []) {
    if (!member.hometown) continue;
    const list = membersByPref.get(member.hometown) ?? [];
    list.push(member);
    membersByPref.set(member.hometown, list);
  }

  const totalMembers = Array.from(membersByPref.values()).reduce((sum, list) => sum + list.length, 0);
  const totalPrefs = membersByPref.size;
  const mapStats = `出身地が登録されたメンバー ${totalMembers}名 ・ ${totalPrefs}都道府県`;

  const selectedMembers = selectedPref ? membersByPref.get(selectedPref) ?? [] : [];

  if (!authReady) {
    return <main className="mx-auto max-w-285 px-4.5 pt-7 pb-32.5 md:px-10 md:pt-10 md:pb-20" />;
  }
  if (!isLoggedIn) {
    return (
      <main className="mx-auto max-w-285 px-4.5 pt-7 pb-32.5 md:px-10 md:pt-10 md:pb-20">
        <a onClick={() => store.nav('home')} className="mb-6 block cursor-pointer text-[13px] text-muted transition-colors hover:text-primary">← ホームにもどる</a>
        <h1 className="m-0 mb-6 font-serif text-[28px] font-bold">メンバー出身地マップ</h1>
        <section>
          <h2 className="m-0 mb-3 font-serif text-[22px] font-bold">ログインが必要です</h2>
          <p className="m-0 mb-5 text-[14px] leading-[1.9] text-body">メンバーの出身地や部署を見るにはログインが必要です。</p>
          <Button type="button" onClick={() => store.nav('login')}>ログインする</Button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-285 px-4.5 pt-7 pb-32.5 md:px-10 md:pt-10 md:pb-20">
      <a onClick={() => store.nav('home')} className="mb-6 block cursor-pointer text-[13px] text-muted transition-colors hover:text-primary">← ホームにもどる</a>
      <header>
        <div className="mb-1.5 flex flex-wrap items-baseline gap-4">
          <h1 className="m-0 font-serif text-[28px] font-bold">メンバー出身地マップ</h1>
          <p className="m-0 font-mono text-[11px] text-muted">{mapStats}</p>
        </div>
        <p className="m-0 mb-6 text-[13px] text-muted">日本酒会のメンバーの出身地を地図で。県をタップすると、その県の出身者が見られます。プロフィール編集から出身地を設定すると、ここに表示されます。</p>
      </header>

      {members === null ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <PrefMap membersByPref={membersByPref} selectedPref={selectedPref} onSelect={setSelectedPref} />
          <HometownPanel selectedPref={selectedPref} members={selectedMembers} />
        </div>
      )}
    </main>
  );
}
