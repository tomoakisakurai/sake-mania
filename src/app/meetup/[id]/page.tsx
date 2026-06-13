'use client';
import { useV } from '@/components/Providers';
import { Meetup } from '@/screens/Meetup';
export default function Page() { return <Meetup v={useV()} />; }
