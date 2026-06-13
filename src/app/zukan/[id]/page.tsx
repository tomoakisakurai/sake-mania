'use client';
import { useV } from '@/components/Providers';
import { Detail } from '@/screens/Detail';
export default function Page() { return <Detail v={useV()} />; }
