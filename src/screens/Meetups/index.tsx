/* eslint-disable @typescript-eslint/no-explicit-any */
import { MeetupCard } from './MeetupCard';

export function Meetups({ v }: { v: any }) {
  return (
    <div className="mx-auto max-w-[900px]" style={{ padding: v.pagePad }}>
      <div className="mb-7 flex flex-wrap items-center gap-4">
        <div className="font-serif text-[28px] font-bold">SAKE MEETUP</div>
        <div onClick={v.openMeetupCreate} className="ml-auto cursor-pointer whitespace-nowrap rounded-full bg-accent px-[22px] py-[10px] text-[13.5px] font-bold text-surface">＋ 会を立てる</div>
      </div>

      <div className="flex flex-col gap-4">
        {v.meetupsList.map((ml: any, i: number) => (
          <MeetupCard key={i} ml={ml} />
        ))}
      </div>
    </div>
  );
}
