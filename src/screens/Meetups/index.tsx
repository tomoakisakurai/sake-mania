'use client';
import { useStore } from '@/store';
import { MeetupCard } from './MeetupCard';
import { useMeetupsList } from './useMeetupsList';

export function Meetups() {
  const store = useStore();
  const meetupsList = useMeetupsList();
  return (
    <div className="mx-auto max-w-225 px-4.5 pt-7 pb-32.5 md:px-10 md:pt-10 md:pb-20">
      <div className="mb-7 flex flex-wrap items-center gap-4">
        <div className="font-serif text-[28px] font-bold">SAKE MEETUP</div>
        <div onClick={() => store.openMeetupCreate()} className="ml-auto cursor-pointer whitespace-nowrap rounded-full bg-accent px-5.5 py-2.5 text-[13.5px] font-bold text-surface">＋ 会を立てる</div>
      </div>

      <div className="flex flex-col gap-4">
        {meetupsList.map((ml, i) => (
          <MeetupCard key={i} ml={ml} />
        ))}
      </div>
    </div>
  );
}
