import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { getMeetupDetail } from '@/app/actions/meetups';
import { MeetupClient } from '@/app/_screens';

// 共有時に会の名前を出す（例:「6月のSAKE MEETUP — 酒マニア」）
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const d = await getMeetupDetail(decodeURIComponent(id));
  return d
    ? pageMeta(d.name, `${d.dateLabel} ・ ${d.place}`)
    : pageMeta('SAKE MEETUP', 'SAKE MEETUPの詳細。');
}

export default function Page() { return <MeetupClient />; }
