'use client';
import { useV } from '@/components/Providers';
import { Zukan } from '@/screens/Zukan';
export default function Page() { return <Zukan v={useV()} />; }
