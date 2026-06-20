'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import type { Vals } from '@/useVals';
import type { Member } from '@/types';
import { paths } from '@/lib/routes';

export function Members({ vals }: { vals: Vals }) {
  const store = useStore();
  const router = useRouter();
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
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: vals.pagePad }}>
      <div onClick={() => store.nav('home')} className="text-[13px] text-muted cursor-pointer mb-6 hover:text-primary transition-colors">← ホームにもどる</div>
      <div className="flex flex-wrap items-baseline gap-4 mb-1.5">
        <div className="font-serif text-[28px] font-bold">メンバー出身地マップ</div>
        <div className="font-mono text-[11px] text-muted">{mapStats}</div>
      </div>
      <div className="text-[13px] text-muted mb-6">日本酒会のメンバーの出身地を地図で。県をタップすると、その県の出身者と「お国自慢」が見られます。</div>

      <div style={{ display: 'grid', gridTemplateColumns: vals.mapCols, gap: 24, alignItems: 'start' }}>
        <div className="bg-surface border border-line rounded-xl" style={{ padding: vals.mapPanelPad }}>
          <div className="grid grid-cols-12" style={{ gap: vals.mapGap }}>
            {vals.prefGrid.map((p, i) => {
              const name = p[0] as string;
              const memberList = membersByPref.get(name) ?? [];
              const hasMembers = memberList.length > 0;
              const isSelected = selectedPref === name;
              const tileBg = hasMembers ? (isSelected ? 'bg-accent' : 'bg-primary') : 'bg-line-soft';
              const tileColor = hasMembers ? 'text-surface' : 'text-faint';
              return (
                <div
                  key={i}
                  onClick={hasMembers ? () => setSelectedPref(isSelected ? null : name) : undefined}
                  className={`${tileBg} ${tileColor} aspect-square rounded-md flex flex-col items-center justify-center gap-px ${hasMembers ? 'cursor-pointer' : 'cursor-default'}`}
                  style={{ gridColumn: p[1], gridRow: p[2] }}
                >
                  <span className="font-bold leading-none" style={{ fontSize: name.length >= 4 ? (vals.isMobile ? '6.5px' : '8.5px') : (vals.isMobile ? '8.5px' : '11px') }}>{name}</span>
                  {hasMembers && (
                    <span className="opacity-85" style={{ fontSize: vals.isMobile ? '7px' : '9px' }}>{memberList.length}人</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {selectedPref && (
            <>
              <div className="font-serif text-[19px] font-bold border-b border-line pb-2.5 mb-4">{selectedPref} 出身のメンバー</div>
              <div className="flex flex-col gap-3">
                {selectedMembers.map((member) => (
                  <div
                    key={member.name}
                    onClick={() => router.push(paths.member(member.name))}
                    className="bg-card border border-line rounded-xl px-5 py-4 hover:border-primary cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold flex-shrink-0" style={{ background: member.avatarBg }}>{member.avatar}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-serif text-[16px] font-bold">{member.display}</div>
                        <div className="text-[11.5px] text-muted">{member.dept} ・ {member.taste}</div>
                      </div>
                      <span className="text-primary font-bold text-[13px] flex-shrink-0">→</span>
                    </div>
                    {member.hometownNote && (
                      <div className="text-[12.5px] leading-relaxed text-body pt-2.5 border-t border-line-soft">「{member.hometownNote}」</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          {!selectedPref && (
            <div className="bg-surface border border-line rounded-xl px-6 py-5">
              <div className="font-serif text-[16px] font-bold mb-2">全国津々浦々</div>
              <div className="text-[12.5px] text-muted leading-relaxed">日本酒会の魅力は全国各地の出身者が集まること。マップの色つきの県をタップすると、その県の出身者とお国自慢が見られます。月1回のSAKE MEETUPでは、それぞれの地元の希少銘柄とご当地おつまみが集結します。</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
