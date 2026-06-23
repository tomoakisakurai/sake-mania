import type { ProfileView } from '@/app/actions/profile';

type Props = {
  profile: ProfileView;
  onHometownClick: () => void;
};

// メンバー詳細上部: アバター + ニックネーム + 部署 + 出身地リンク + 自己紹介
export function ProfileHeader({ profile, onHometownClick }: Props) {
  return (
    <header className="mb-6 flex flex-wrap items-center gap-4">
      <div
        style={{ background: profile.avatarBg }}
        className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full text-[26px] font-bold"
      >
        {profile.avatar}
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="m-0 font-serif text-[26px] font-bold leading-tight">{profile.nickname}</h1>
        {profile.dept && (
          <p className="m-0 mt-1 text-[13px] text-muted">{profile.dept}</p>
        )}
        {profile.hometown && (
          <a
            onClick={onHometownClick}
            className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-[11.5px] font-bold text-accent hover:underline"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            出身: {profile.hometown}
          </a>
        )}
        {profile.bio && (
          <p className="m-0 mt-3 max-w-150 text-[13px] leading-[1.9] text-body">{profile.bio}</p>
        )}
      </div>
    </header>
  );
}
