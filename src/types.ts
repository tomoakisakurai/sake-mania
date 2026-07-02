// Types mirror the Claude Design prototype data shapes exactly.
export type Screen =
  | 'login'
  | 'home'
  | 'zukan'
  | 'detail'
  | 'record'
  | 'mypage'
  | 'feed'
  | 'post'
  | 'map'
  | 'kura'
  | 'kuraReg'
  | 'brandReg'
  | 'meetups'
  | 'meetup'
  | 'declare'
  | 'meetupCreate'
  | 'events'
  | 'event'
  | 'eventCreate'
  | 'eventEdit'
  | 'members'
  | 'member';

export interface Brand {
  id: string;
  name: string;
  brewery: string;
  pref: string;
  cls: string;
  polish: string;
  rice: string;
  yeast: string;
  smv: string;
  abv: string;
  temp: string;
  x: number;
  y: number;
  rating: number;
  count: number;
  tags: string[];
  desc: string;
  photo?: string | null;
}

export interface Comment {
  user: string;
  avatar: string;
  avatarBg: string;
  time: string;
  text: string;
  edited?: boolean;
}

export interface OtherRec {
  recordId: string;
  nomi: number;
  comments: Comment[];
  user: string;
  avatar: string;
  avatarBg: string;
  time: string;
  place: string;
  brandId: string;
  rating: number;
  x: number;
  y: number;
  sweet: number;
  temps: string[];
  pairing: string;
  memo: string;
  date: string;
}

export interface MyRec {
  recordId: string;
  nomi: number;
  comments: Comment[];
  brandId: string;
  date: string;
  rating: number;
  x: number | null;
  y: number | null;
  sweet: number;
  temps: string[];
  pairing: string;
  memo: string;
  photo?: string | null;
  isNew?: boolean;
  isPublic?: boolean;
}

export interface Member {
  name: string;
  display: string;
  avatar: string;
  avatarBg: string;
  dept?: string;
  taste?: string;
  hometown?: string;
  hometownNote?: string;
}

export interface MeetupBring {
  member: string;
  brandId: string;
  note: string;
}

export interface MeetupLineup {
  brandId: string;
  broughtBy: string;
  score: number;
  votes: number;
  comment: string;
}

export type MeetupPhase = 'before' | 'voting' | 'closed';

export interface Meetup {
  id: string;
  status: 'upcoming' | 'past';
  phase: MeetupPhase;
  name: string;
  dateShort: string;
  dateLabel: string;
  place: string;
  theme: string;
  host: string;
  capacity?: number;
  going?: string[];
  bring?: MeetupBring[];
  attendees?: number;
  voteDeadline?: string;
  lineup?: MeetupLineup[];
}

export interface Bar {
  id: string;
  name: string;
  area: string;
  type: string;
  venueQ: string;
  brands: string[];
  note: string;
}

export interface KuraMetaEntry {
  city: string;
  founded: number;
  desc: string;
}

export interface User {
  id: string; // = auth.users.id = profiles.id
  name: string;
  avatar: string;
  isAdmin: boolean;
}

export interface PostRef {
  src: 'mine' | 'other' | 'public';
  i: number;
}

// A published record by any user, shaped to be feed/post compatible.
export interface PublicRec {
  recordId: string;
  brandId: string;
  rating: number;
  x: number;
  y: number;
  sweet: number;
  temps: string[];
  pairing: string;
  memo: string;
  photo?: string | null;
  nomi: number;
  commentCount: number;
  liked: boolean;
  comments: Comment[];
  user: string;
  avatar: string;
  avatarBg: string;
  mine: boolean;
  date: string;
}

export interface Rec {
  step: number;
  brandId: string | null;
  x: number | null;
  y: number | null;
  sweet: number;
  rating: number;
  temps: string[];
  pairing: string;
  memo: string;
  query: string;
  photo: string | null;
  isPublic: boolean;
}

export interface EditingComment {
  recordId: string;
  i: number;
}

export interface CommentVM {
  id: string;
  user: string;
  avatar: string;
  avatarBg: string;
  time: string;
  text: string;
  canEdit: boolean;
  initEditDraft: string;
  deleteClick: () => void;
}

export interface PostVM {
  user: string;
  mine: string;
  avatar: string;
  avatarBg: string;
  timePlace: string;
  canPublish: boolean;
  isPublic: boolean;
  publishLabel: string;
  publishToggle: () => void;
  canDelete: boolean;
  deleteClick: () => void;
  brandName: string;
  brewery: string;
  brandSubRest: string;
  kuraClick: () => void;
  stars: string;
  ratingNum: string;
  x: number | null;
  y: number | null;
  bx: number;
  by: number;
  sweet: number;
  sweetLabel: string;
  tasteLabel: string;
  temps: string;
  pairing: string;
  memo: string;
  photo: string;
  hasPhoto: boolean;
  noPhoto: boolean;
  brandClick: () => void;
  recordClick: () => void;
  canNomi: boolean;
  cantNomi: boolean;
  nomiCount: number;
  nomiLiked: boolean;
  nomiClick: () => void;
  comments: CommentVM[];
  commentCount: number;
  hasComments: boolean;
  commentSend: (draft: string) => void;
}
