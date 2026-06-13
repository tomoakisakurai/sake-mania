'use client';
import { useV } from '@/components/Providers';
import { MyPage } from '@/screens/MyPage';
export default function Page() { return <MyPage v={useV()} />; }
