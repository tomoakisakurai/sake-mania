'use client';
import { useV } from '@/components/Providers';
import { KuraReg } from '@/screens/KuraReg';
export default function Page() { return <KuraReg v={useV()} />; }
