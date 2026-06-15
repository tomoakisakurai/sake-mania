'use client';
import { useV } from '@/components/Providers';
import { Meetups } from '@/screens/Meetups';
export default function Page() { return <Meetups v={useV()} />; }
