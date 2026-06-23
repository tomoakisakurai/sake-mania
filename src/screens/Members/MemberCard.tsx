import type { MemberRow } from '@/app/actions/members';

// 出身県別メンバーカード。クリックでメンバー詳細へ遷移。
export function MemberCard({ member, onClick }: { member: MemberRow; onClick: () => void }) {
  return (
    <article onClick={onClick} className="cursor-pointer rounded-xl border border-line bg-card px-5 py-4 transition-colors hover:border-primary">
      <header className="mb-2 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-bold" style={{ background: member.avatarBg }}>{member.avatar}</span>
        <hgroup className="min-w-0 flex-1">
          <h3 className="m-0 font-serif text-[16px] font-bold">{member.nickname}</h3>
          {member.dept && (<p className="m-0 text-[11.5px] text-muted">{member.dept}</p>)}
        </hgroup>
        <span className="shrink-0 text-[13px] font-bold text-primary">→</span>
      </header>
      {member.bio && (
        <blockquote className="m-0 border-t border-line-soft pt-2.5 text-[12.5px] leading-relaxed text-body">「{member.bio}」</blockquote>
      )}
    </article>
  );
}
