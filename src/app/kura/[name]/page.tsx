'use client';
import { useV } from '@/components/Providers';
import { Kura } from '@/screens/Kura';
export default function Page() { return <Kura v={useV()} />; }
