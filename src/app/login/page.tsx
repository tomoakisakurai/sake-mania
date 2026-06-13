'use client';
import { useV } from '@/components/Providers';
import { Login } from '@/screens/Login';
export default function Page() { return <Login v={useV()} />; }
