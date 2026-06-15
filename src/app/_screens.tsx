'use client';
// 各画面の薄いクライアントラッパー。useV()(ValsContext)からビューモデルを取り、
// 画面に渡す。各 page.tsx をサーバーコンポーネント化して metadata を export しつつ、
// 描画はこのクライアント境界に委ねるための仕組み。
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
import { Post } from '@/screens/Post';

export const HomeClient = () => <Home v={useV()} />;
export const ZukanClient = () => <Zukan v={useV()} />;
export const DetailClient = () => <Detail v={useV()} />;
export const MapClient = () => <Map v={useV()} />;
export const FeedClient = () => <Feed v={useV()} />;
export const MyPageClient = () => <MyPage v={useV()} />;
export const LoginClient = () => <Login v={useV()} />;
export const RecordClient = () => <Record v={useV()} />;
export const MeetupsClient = () => <Meetups v={useV()} />;
export const MeetupClient = () => <Meetup v={useV()} />;
export const DeclareClient = () => <Declare v={useV()} />;
export const MeetupCreateClient = () => <MeetupCreate v={useV()} />;
export const KuraClient = () => <Kura v={useV()} />;
export const KuraRegClient = () => <KuraReg v={useV()} />;
export const PostClient = () => <Post v={useV()} />;
