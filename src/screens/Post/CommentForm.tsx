import type { KeyboardEvent, ChangeEvent } from 'react';
import type { Vals } from '@/useVals';
import { Button } from '@/components/shared/Button';
import type { CommentState } from './index';

// コメント投稿フォーム
export function CommentForm({ vals, commentState }: { vals: Vals; commentState: CommentState }) {
  const handleCommentKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const composing = (e.nativeEvent && e.nativeEvent.isComposing) || e.keyCode === 229;
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !composing) {
      e.preventDefault();
      vals.post.commentSend(commentState.draft);
      commentState.setDraft('');
    }
  };

  return (
    <>
      <div className="mt-4 flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mark text-[12px] font-bold">{vals.userAvatar}</span>
        <textarea
          value={commentState.draft}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => commentState.setDraft(e.target.value)}
          onKeyDown={handleCommentKey}
          rows={2}
          placeholder="コメントを書く — この一杯について語り合おう"
          className="min-w-0 flex-1 resize-y rounded-2xl border border-line bg-card px-4.5 py-2.75 text-[13.5px] leading-[1.8] text-ink"
        />
        <Button
          variant="primary"
          size="md"
          className="shrink-0 self-end"
          onClick={() => { vals.post.commentSend(commentState.draft); commentState.setDraft(''); }}
        >送る</Button>
      </div>
      <p className="m-0 mt-1.5 pl-10.5 text-[10.5px] text-faint">Enterで改行 ・ ⌘/Ctrl+Enterで送信</p>
    </>
  );
}
