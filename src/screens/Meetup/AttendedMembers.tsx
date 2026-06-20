'use client';
import { useStore } from '@/store';

export function AttendedMembers() {
  const attendees = useStore((s) => s.meetupDetail?.attendees ?? []);
  if (attendees.length === 0) return null;
  return (
    <section className="mb-8">
      <header className="flex items-baseline justify-between border-b border-line pb-2.5 mb-3.5">
        <h2 className="font-serif text-[18px] font-bold m-0">参加メンバー</h2>
        <span className="font-mono text-[11px] text-muted">{attendees.length}名</span>
      </header>
      <ul className="flex gap-3.5 flex-wrap m-0 p-0 list-none">
        {attendees.map((member, i) => (
          <li key={i} className="flex flex-col items-center gap-1.5 w-14">
            <span
              style={{ background: member.avatarBg }}
              className="w-11 h-11 rounded-full flex items-center justify-center text-[16px] font-bold"
            >
              {member.avatar}
            </span>
            <p className="text-[10.5px] text-body text-center leading-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-14 m-0">
              {member.name}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
