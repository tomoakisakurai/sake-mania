import type { Vals } from '@/useVals';
import { MeetupCard } from './MeetupCard';

export function Meetups({ vals }: { vals: Vals }) {
  return (
    <div className="mx-auto max-w-225" style={{ padding: vals.pagePad }}>
      <div className="mb-7 flex flex-wrap items-center gap-4">
        <div className="font-serif text-[28px] font-bold">SAKE MEETUP</div>
        <div onClick={vals.openMeetupCreate} className="ml-auto cursor-pointer whitespace-nowrap rounded-full bg-accent px-5.5 py-2.5 text-[13.5px] font-bold text-surface">＋ 会を立てる</div>
      </div>

      <div className="flex flex-col gap-4">
        {vals.meetupsList.map((ml, i: number) => (
          <MeetupCard key={i} ml={ml} />
        ))}
      </div>
    </div>
  );
}
