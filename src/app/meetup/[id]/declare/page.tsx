'use client';
import { useV } from '@/components/Providers';
import { Declare } from '@/screens/Declare';
export default function Page() { return <Declare v={useV()} />; }
