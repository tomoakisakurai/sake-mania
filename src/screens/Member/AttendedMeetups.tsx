'use client';
import { useRouter } from 'next/navigation';
import { paths } from '@/lib/routes';

export type AttendedMeetup = {
  meetupId: string;
  name: string;
  dateShort: string;
};

type Props = {
  attended: AttendedMeetup[];
};

// メンバー詳細: SAKE MEETUP参加履歴セクション
export function AttendedMeetups({ attended }: Props) {
  const router = useRouter();
  return (
    <section className="mb-8">
      <header className="mb-3.5 flex items-baseline justify-between border-b border-line pb-2.5">
        <h2 className="m-0 font-serif text-[18px] font-bold">SAKE MEETUP参加履歴</h2>
        <span className="font-mono text-[11px] text-muted">{attended.length}回</span>
      </header>
      {attended.length > 0 ? (
        <ul className="m-0 flex flex-col gap-2.5 p-0 list-none">
          {attended.map((meet) => (
            <li
              key={meet.meetupId}
              onClick={() => router.push(paths.meetup(meet.meetupId))}
              className="flex cursor-pointer items-center gap-3.5 rounded-[10px] border border-line bg-surface px-4 py-2.5 transition-colors hover:border-primary"
            >
              <span className="w-9 shrink-0 font-mono text-[11px] font-bold text-accent">{meet.dateShort}</span>
              <span className="min-w-0 flex-1 truncate text-[13px] font-bold">{meet.name}</span>
              <span className="font-bold text-primary text-[12px]">→</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 text-[12.5px] text-faint">まだSAKE MEETUPへの参加履歴はありません。</p>
      )}
    </section>
  );
}
