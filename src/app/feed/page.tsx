'use client';
import { useV } from '@/components/Providers';
import { Feed } from '@/screens/Feed';
export default function Page() { return <Feed v={useV()} />; }
