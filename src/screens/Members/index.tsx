'use client';
import { useState } from 'react';
import { useStore } from '@/store';
import type { Vals } from '@/useVals';
import type { Member } from '@/types';
import { PrefMap } from './PrefMap';
import { HometownPanel } from './HometownPanel';

export function Members({ vals }: { vals: Vals }) {
  const store = useStore();
  const [selectedPref, setSelectedPref] = useState<string | null>(null);

  // 出身地ごとにメンバーを集計
  const membersByPref = new Map<string, Member[]>();
  for (const member of vals.allMembers) {
    if (!member.hometown) continue;
    const list = membersByPref.get(member.hometown) ?? [];
    list.push(member);
    membersByPref.set(member.hometown, list);
  }

  const totalMembers = Array.from(membersByPref.values()).reduce((sum, list) => sum + list.length, 0);
  const totalPrefs = membersByPref.size;
  const mapStats = `出身地が登録されたメンバー ${totalMembers}名 ・ ${totalPrefs}都道府県`;

  const selectedMembers = selectedPref ? membersByPref.get(selectedPref) ?? [] : [];

  return (
    <main className="mx-auto max-w-285" style={{ padding: vals.pagePad }}>
      <a onClick={() => store.nav('home')} className="mb-6 block cursor-pointer text-[13px] text-muted transition-colors hover:text-primary">← ホームにもどる</a>
      <header>
        <div className="mb-1.5 flex flex-wrap items-baseline gap-4">
          <h1 className="m-0 font-serif text-[28px] font-bold">メンバー出身地マップ</h1>
          <p className="m-0 font-mono text-[11px] text-muted">{mapStats}</p>
        </div>
        <p className="m-0 mb-6 text-[13px] text-muted">日本酒会のメンバーの出身地を地図で。県をタップすると、その県の出身者と「お国自慢」が見られます。</p>
      </header>

      <div className="grid items-start gap-6" style={{ gridTemplateColumns: vals.mapCols }}>
        <PrefMap vals={vals} membersByPref={membersByPref} selectedPref={selectedPref} onSelect={setSelectedPref} />
        <HometownPanel selectedPref={selectedPref} members={selectedMembers} />
      </div>
    </main>
  );
}
