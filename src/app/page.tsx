'use client';
import { useV } from '@/components/Providers';
import { Home } from '@/screens/Home';
export default function Page() { return <Home v={useV()} />; }
