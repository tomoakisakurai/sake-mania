'use client';
import { useV } from '@/components/Providers';
import { Post } from '@/screens/Post';
export default function Page() { return <Post v={useV()} />; }
