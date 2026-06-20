'use client';
// 各画面の薄いクライアントラッパー。useV()(ValsContext)からビューモデルを取り、
// 画面に渡す。各 page.tsx をサーバーコンポーネント化して metadata を export しつつ、
// 描画はこのクライアント境界に委ねるための仕組み。
import { useParams } from 'next/navigation';
import { useV } from '@/components/Providers';
import { Home } from '@/screens/Home';
import { Zukan } from '@/screens/Zukan';
import { Detail } from '@/screens/Detail';
import { Map } from '@/screens/Map';
import { Feed } from '@/screens/Feed';
import { MyPage } from '@/screens/MyPage';
import { Login } from '@/screens/Login';
import { Record } from '@/screens/Record';
import { Meetups } from '@/screens/Meetups';
import { Meetup } from '@/screens/Meetup';
import { Declare } from '@/screens/Declare';
import { MeetupCreate } from '@/screens/MeetupCreate';
import { Kura } from '@/screens/Kura';
import { KuraReg } from '@/screens/KuraReg';
import { BrandReg } from '@/screens/BrandReg';
import { Events } from '@/screens/Events';
import { Event } from '@/screens/Event';
import { EventReg } from '@/screens/EventReg';
import { Members } from '@/screens/Members';
import { Post } from '@/screens/Post';

export const HomeClient = () => <Home vals={useV()} />;
export const ZukanClient = () => <Zukan vals={useV()} />;
export const DetailClient = () => <Detail vals={useV()} />;
export const MapClient = () => <Map vals={useV()} />;
export const FeedClient = () => <Feed vals={useV()} />;
export const MyPageClient = () => <MyPage vals={useV()} />;
export const LoginClient = () => <Login />;
export const RecordClient = () => <Record vals={useV()} />;
export const MeetupsClient = () => <Meetups vals={useV()} />;
export const MeetupClient = () => <Meetup vals={useV()} />;
export const DeclareClient = () => <Declare vals={useV()} />;
export const MeetupCreateClient = () => <MeetupCreate vals={useV()} />;
export const KuraClient = () => <Kura vals={useV()} />;
export const KuraRegClient = () => <KuraReg vals={useV()} />;
export const BrandRegClient = () => <BrandReg />;
export const EventsClient = () => <Events />;
export const EventRegClient = () => <EventReg />;
export const MembersClient = () => <Members vals={useV()} />;
export const EventClient = () => {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';
  return <Event eventId={decodeURIComponent(id)} />;
};
export const PostClient = () => <Post vals={useV()} />;
