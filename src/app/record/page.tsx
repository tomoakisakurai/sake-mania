'use client';
import { useV } from '@/components/Providers';
import { Record } from '@/screens/Record';
export default function Page() { return <Record v={useV()} />; }
