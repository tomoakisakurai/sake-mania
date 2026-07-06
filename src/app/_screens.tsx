'use client';
// 各画面の薄いクライアントラッパー。URLパラメータの取り出しだけを担い、
// 各 page.tsx をサーバーコンポーネント化して metadata を export しつつ、
// 描画はこのクライアント境界に委ねるための仕組み。
import { useParams } from 'next/navigation';
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
import { Member } from '@/screens/Member';
import { Post } from '@/screens/Post';

export const HomeClient = () => <Home />;
export const ZukanClient = () => <Zukan />;
export const DetailClient = () => {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';
  return <Detail detailId={decodeURIComponent(id)} />;
};
export const MapClient = () => <Map />;
export const FeedClient = () => <Feed />;
export const MyPageClient = () => <MyPage />;
export const LoginClient = () => <Login />;
export const RecordClient = () => <Record />;
export const MeetupsClient = () => <Meetups />;
export const MeetupClient = () => {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';
  return <Meetup meetupId={decodeURIComponent(id)} />;
};
export const DeclareClient = () => {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';
  return <Declare meetupId={decodeURIComponent(id)} />;
};
export const MeetupCreateClient = () => <MeetupCreate />;
export const MeetupEditClient = () => {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';
  return <MeetupCreate editingId={decodeURIComponent(id)} />;
};
export const KuraClient = () => {
  const params = useParams<{ name: string }>();
  const name = typeof params?.name === 'string' ? params.name : '';
  return <Kura kuraName={decodeURIComponent(name)} />;
};
export const KuraRegClient = () => <KuraReg />;
export const BrandRegClient = () => <BrandReg />;
export const EventsClient = () => <Events />;
export const EventRegClient = () => <EventReg />;
export const EventEditClient = () => {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';
  return <EventReg editingId={decodeURIComponent(id)} />;
};
export const MembersClient = () => <Members />;
export const MemberClient = () => {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';
  return <Member memberId={decodeURIComponent(id)} />;
};
export const EventClient = () => {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';
  return <Event eventId={decodeURIComponent(id)} />;
};
export const PostClient = () => {
  const params = useParams<{ src: string; i: string }>();
  const src = params?.src === 'mine' ? 'mine' : params?.src === 'public' ? 'public' : 'other';
  const i = Number(params?.i ?? -1);
  return <Post postRef={Number.isNaN(i) || i < 0 ? null : { src, i }} />;
};
