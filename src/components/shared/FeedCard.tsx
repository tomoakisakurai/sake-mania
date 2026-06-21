import clsx from 'clsx';
import type { Vals } from '@/useVals';
// みんなの利き酒帳の投稿カード。ホーム(サイドの抜粋)とフィード一覧で共有する。

function NomiCup() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 3h16c0 6.2-3.5 9.8-7 10.7V18h4v2.5H7V18h4v-4.3C7.5 12.8 4 9.2 4 3z" />
    </svg>
  );
}

export function FeedCard({ feed, padClass = 'p-5.5 px-6.5' }: { feed: Vals['feedAll'][number]; padClass?: string }) {
  return (
    <article onClick={feed.click} className={clsx('cursor-pointer rounded-xl border border-line bg-card', padClass)}>
      <header className="mb-3 flex items-center gap-2.5">
        <span className="flex h-7.5 w-7.5 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: feed.avatarBg }}>{feed.avatar}</span>
        <p className="m-0 text-[13px] font-bold">{feed.user} <span className="font-normal text-faint">{feed.mine}</span></p>
        <span className="text-[11px] text-faint">{feed.time}</span>
        <span className="ml-auto text-[14px] tracking-[2px] text-accent">{feed.stars}</span>
      </header>

      <div className="flex gap-4.5">
        {feed.hasPhoto && (<img src={feed.photo} alt="" className="h-24 w-18 shrink-0 rounded-sm object-cover" />)}
        {feed.noPhoto && (
          <span className="flex h-24 w-18 shrink-0 items-center justify-center rounded-sm" style={{ background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }}>
            <span className="font-mono text-[9px] text-muted">ラベル</span>
          </span>
        )}
        <div className="flex min-w-0 flex-col gap-1.5">
          <h3 onClick={feed.brandClick} className="m-0 cursor-pointer font-serif text-[18px] font-bold">{feed.name}</h3>
          <p className="m-0 text-[12px] text-muted">{feed.sub}</p>
          <p className="m-0 text-[13px] leading-[1.8] text-body">{feed.memo}</p>
          <ul className="m-0 mt-0.5 flex flex-wrap gap-2 p-0 list-none">
            {feed.tags.map((tag: string, i: number) => (
              <li key={i} className="rounded-full bg-bg px-3 py-0.5 text-[11px] text-body">{tag}</li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="mt-3.5 flex items-center gap-4 border-t border-line-soft pt-3">
        {feed.canNomi && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); feed.nomiClick(e); }}
            className={clsx(
              'inline-flex cursor-pointer items-center gap-[7px] rounded-full border border-accent px-4 py-1.5 text-[12px] font-bold',
              feed.nomiLiked ? 'bg-accent text-surface' : 'bg-surface text-accent',
            )}
          >
            <NomiCup />
            のみたいね <span className="font-mono text-[11.5px]">{feed.nomiCount}</span>
          </button>
        )}
        {feed.cantNomi && (
          <span className="inline-flex items-center gap-[7px] text-[12px] font-bold text-accent">
            <NomiCup />
            のみたいね <span className="font-mono text-[11.5px]">{feed.nomiCount}</span>
          </span>
        )}
        <span className="text-[12px] text-muted">コメント <span className="font-mono text-[11.5px]">{feed.commentCount}</span></span>
      </footer>
    </article>
  );
}
