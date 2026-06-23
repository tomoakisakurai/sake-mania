import type { Vals } from '@/useVals';
import type { ProfileView } from '@/app/actions/profile';

type Props = {
  vals: Vals;
  profile: ProfileView | null;
  onEdit: () => void;
};

// マイページ上部: アバター + 名前 + 利き酒師ランク + 部署/出身地 + 自己紹介 + 統計 + プロフィール編集
// 1段(flex-wrap)で配置し、SPでは下に折り返す。
export function ProfileHeader({ vals, profile, onEdit }: Props) {
  const dept = profile?.dept ?? '';
  const hometown = profile?.hometown ?? '';
  const bio = profile?.bio ?? '';
  const profileParts = [dept, hometown && `出身: ${hometown}`].filter(Boolean).join(' ・ ');
  const noProfile = !dept && !hometown && !bio;
  return (
    <header className="mb-8 flex flex-wrap items-start gap-5">
      <div className="flex min-w-0 flex-1 basis-70 items-start gap-5">
        <span className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-mark font-serif text-[26px] font-bold">{vals.userAvatar}</span>
        <hgroup className="min-w-0 flex-1">
          <h1 className="m-0 font-serif text-[26px] font-bold">{vals.userName}</h1>
          <p className="m-0 mt-1 inline-block whitespace-nowrap rounded-full bg-primary px-3.5 py-1 text-[12px] font-bold leading-snug text-surface">利き酒師ランク · {vals.rankName}</p>
          {profileParts && (
            <p className="m-0 mt-1.5 text-[12px] text-muted">{profileParts}</p>
          )}
          {bio && (
            <p className="m-0 mt-2 text-[12.5px] leading-[1.8] text-body">{bio}</p>
          )}
          {noProfile && (
            <button type="button" onClick={onEdit} className="mt-2 cursor-pointer text-[11.5px] font-bold text-accent hover:underline">プロフィールを設定する →</button>
          )}
        </hgroup>
      </div>
      <dl className="m-0 ml-auto flex gap-7">
        <div className="text-center">
          <dd className="m-0 font-serif text-[26px] font-bold">{vals.statCups}</dd>
          <dt className="text-[11px] text-muted">盃</dt>
        </div>
        <div className="border-l border-line pl-7 text-center">
          <dd className="m-0 font-serif text-[26px] font-bold">{vals.statBrands}</dd>
          <dt className="text-[11px] text-muted">銘柄</dt>
        </div>
        <div className="border-l border-line pl-7 text-center">
          <dd className="m-0 font-serif text-[26px] font-bold">{vals.statKura}</dd>
          <dt className="text-[11px] text-muted">蔵</dt>
        </div>
      </dl>
      <button type="button" onClick={onEdit} className="shrink-0 cursor-pointer whitespace-nowrap rounded-full border border-line bg-surface px-4.5 py-2 text-[12px] font-bold text-body transition-colors hover:border-primary hover:text-primary">
        プロフィール編集
      </button>
    </header>
  );
}
