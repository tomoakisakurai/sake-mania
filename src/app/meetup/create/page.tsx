'use client';
import { useV } from '@/components/Providers';
import { MeetupCreate } from '@/screens/MeetupCreate';
export default function Page() { return <MeetupCreate v={useV()} />; }
