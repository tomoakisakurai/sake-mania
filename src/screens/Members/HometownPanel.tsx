'use client';
import { useRouter } from 'next/navigation';
import { paths } from '@/lib/routes';
import type { MemberRow } from '@/app/actions/members';
import { MemberCard } from './MemberCard';

// 右カラム: 県が選ばれていればその出身者一覧、未選択なら全国の案内文
export function HometownPanel({ selectedPref, members }: { selectedPref: string | null; members: MemberRow[] }) {
  const router = useRouter();
  if (!selectedPref) {
    return (
      <section className="rounded-xl border border-line bg-surface px-6 py-5">
        <h2 className="m-0 mb-2 font-serif text-[16px] font-bold">全国津々浦々</h2>
        <p className="m-0 text-[12.5px] leading-relaxed text-muted">日本酒会の魅力は全国各地の出身者が集まること。マップの色つきの県をタップすると、その県の出身者と自己紹介が見られます。月1回のSAKE MEETUPでは、それぞれの地元の希少銘柄とご当地おつまみが集結します。</p>
      </section>
    );
  }
  return (
    <section>
      <h2 className="m-0 mb-4 border-b border-line pb-2.5 font-serif text-[19px] font-bold">{selectedPref} 出身のメンバー</h2>
      <ul className="m-0 flex flex-col gap-3 p-0 list-none">
        {members.map((member) => (
          <li key={member.id}>
            <MemberCard member={member} onClick={() => router.push(paths.member(member.id))} />
          </li>
        ))}
      </ul>
    </section>
  );
}
