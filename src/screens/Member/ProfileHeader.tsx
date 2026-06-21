import type { Member } from '@/types';

type Props = {
  member: Member;
  onHometownClick: () => void;
};

export function ProfileHeader({ member, onHometownClick }: Props) {
  return (
    <header className="flex gap-4 items-center mb-6 flex-wrap">
      <div
        style={{ background: member.avatarBg }}
        className="w-18 h-18 rounded-full flex items-center justify-center text-[26px] font-bold shrink-0"
      >
        {member.avatar}
      </div>
      <div className="min-w-0">
        <h1 className="font-serif text-[26px] font-bold leading-tight m-0">{member.display}</h1>
        <p className="text-[13px] text-muted mt-1 m-0">{member.dept} ・ {member.taste}</p>
        {member.hometown && (
          <a
            onClick={onHometownClick}
            className="inline-flex items-center gap-1.5 mt-2 text-[11.5px] text-accent font-bold cursor-pointer hover:underline"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            出身: {member.hometown}
          </a>
        )}
      </div>
    </header>
  );
}
