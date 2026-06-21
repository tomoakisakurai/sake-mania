import type { Vals } from '@/useVals';
import type { CommentState } from './index';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';

// 投稿詳細フッタ: のみたいね + コメント一覧 + 投稿フォーム
export function Comments({ vals, commentState }: { vals: Vals; commentState: CommentState }) {
  return (
    <>
      <section className="mt-6.5 flex flex-wrap items-center gap-4.5 border-t border-line-soft pt-5">
        {vals.post.canNomi && (
          <button
            type="button"
            onClick={vals.post.nomiClick}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-accent px-6 py-2.5 text-[13.5px] font-bold ${vals.post.nomiLiked ? 'bg-accent text-surface' : 'bg-surface text-accent'}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h16c0 6.2-3.5 9.8-7 10.7V18h4v2.5H7V18h4v-4.3C7.5 12.8 4 9.2 4 3z"></path></svg>
            のみたいね <span className="font-mono text-[12.5px]">{vals.post.nomiCount}</span>
          </button>
        )}
        {vals.post.cantNomi && (
          <p className="m-0 inline-flex items-center gap-2 text-[13.5px] font-bold text-accent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h16c0 6.2-3.5 9.8-7 10.7V18h4v2.5H7V18h4v-4.3C7.5 12.8 4 9.2 4 3z"></path></svg>
            のみたいね {vals.post.nomiCount} <span className="text-[12px] font-normal text-muted">— みんなが飲みたがっています</span>
          </p>
        )}
      </section>
      <section className="mt-5.5">
        <h2 className="m-0 mb-1 font-serif text-[16px] font-bold">コメント <span className="font-mono text-[12px] font-normal text-muted">{vals.post.commentCount}件</span></h2>
        <ul className="m-0 p-0 list-none">
          {vals.post.comments.map((comment, i) => (
            <CommentItem key={i} comment={comment} commentState={commentState} />
          ))}
        </ul>
        <CommentForm vals={vals} commentState={commentState} />
      </section>
    </>
  );
}
