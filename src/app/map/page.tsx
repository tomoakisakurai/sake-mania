'use client';
import { useV } from '@/components/Providers';
import { Map } from '@/screens/Map';
export default function Page() { return <Map v={useV()} />; }
