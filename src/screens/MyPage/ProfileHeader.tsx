import type { Vals } from '@/useVals';
// マイページ上部: アバター + 名前 + 利き酒師ランク + 統計 + ログアウト
export function ProfileHeader({ vals }: { vals: Vals }) {
  return (
    <header className="mb-8 flex flex-wrap items-center gap-5">
      <span className="flex h-18 w-18 items-center justify-center rounded-full bg-mark font-serif text-[26px] font-bold">{vals.userAvatar}</span>
      <hgroup>
        <h1 className="m-0 font-serif text-[26px] font-bold">{vals.userName}</h1>
        <p className="m-0 mt-1 inline-block whitespace-nowrap rounded-full bg-primary px-3.5 py-1 text-[12px] font-bold leading-snug text-surface">利き酒師ランク · {vals.rankName}</p>
      </hgroup>
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
      <a onClick={vals.doLogout} className="cursor-pointer rounded-full border border-line px-4.5 py-2 text-[12px] font-bold text-muted">ログアウト</a>
    </header>
  );
}
