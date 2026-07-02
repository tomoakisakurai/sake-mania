import type { PostVM } from '@/types';
// 投稿詳細ヘッダ: 投稿者 + 評価(星)
export function Header({ post }: { post: PostVM }) {
  return (
    <header className="mb-6.5 flex items-center gap-3 border-b border-line-soft pb-4.5">
      <span className="flex h-11 w-11 items-center justify-center rounded-full text-[16px] font-bold" style={{ background: post.avatarBg }}>{post.avatar}</span>
      <hgroup>
        <h1 className="m-0 text-[14.5px] font-bold">{post.user} <span className="font-normal text-faint">{post.mine}</span></h1>
        <p className="m-0 mt-0.5 text-[11.5px] text-faint">{post.timePlace}</p>
      </hgroup>
      <div className="ml-auto text-right">
        <p className="m-0 text-[19px] tracking-[3px] text-accent">{post.stars}</p>
        <p className="m-0 mt-0.5 font-mono text-[11px] text-muted">{post.ratingNum} / 5.0</p>
      </div>
    </header>
  );
}
