import type { MyPageVals } from './useMyPageVals';
import type { ProfileView } from '@/app/actions/profile';

type Props = {
  my: MyPageVals;
  profile: ProfileView | null;
  onEdit: () => void;
};

// マイページ上部: アバター + 名前(+編集アイコン) + 利き酒師ランク + 部署/出身地 + 自己紹介 + 統計
// 編集はユーザー名右の鉛筆アイコンから起動する。
export function ProfileHeader({ my, profile, onEdit }: Props) {
  const dept = profile?.dept ?? '';
  const hometown = profile?.hometown ?? '';
  const bio = profile?.bio ?? '';
  const profileParts = [dept, hometown && `出身: ${hometown}`].filter(Boolean).join(' ・ ');
  const noProfile = !dept && !hometown && !bio;
  return (
    <header className="mb-8 flex flex-wrap items-start gap-5">
      <div className="flex min-w-0 max-w-120 flex-1 basis-70 items-start gap-5">
        <span className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-mark font-serif text-[26px] font-bold">{my.userAvatar}</span>
        <hgroup className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h1 className="m-0 font-serif text-[26px] font-bold">{my.userName}</h1>
            <button
              type="button"
              onClick={onEdit}
              title="プロフィールを編集"
              aria-label="プロフィールを編集"
              className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          </div>
          <p className="m-0 mt-1 inline-block whitespace-nowrap rounded-full bg-primary px-3.5 py-1 text-[12px] font-bold leading-snug text-surface">利き酒師ランク · {my.rankName}</p>
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
      <dl className="m-0 ml-23 flex gap-7 md:ml-auto">
        <div className="text-center">
          <dd className="m-0 font-serif text-[26px] font-bold">{my.statCups}</dd>
          <dt className="text-[11px] text-muted">盃</dt>
        </div>
        <div className="border-l border-line pl-7 text-center">
          <dd className="m-0 font-serif text-[26px] font-bold">{my.statBrands}</dd>
          <dt className="text-[11px] text-muted">銘柄</dt>
        </div>
        <div className="border-l border-line pl-7 text-center">
          <dd className="m-0 font-serif text-[26px] font-bold">{my.statKura}</dd>
          <dt className="text-[11px] text-muted">蔵</dt>
        </div>
      </dl>
    </header>
  );
}
