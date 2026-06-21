import type { KeyboardEvent, ChangeEvent } from 'react';
import type { Vals } from '@/useVals';
import { Button } from '@/components/shared/Button';
import type { CommentState } from './index';

type Comment = Vals['post']['comments'][number];

// 1件分のコメント。本人なら編集・削除可能。
export function CommentItem({ comment, commentState }: { comment: Comment; commentState: CommentState }) {
  const isEditing = comment.id === commentState.editingId;
  const handleEditKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const composing = (e.nativeEvent && e.nativeEvent.isComposing) || e.keyCode === 229;
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !composing) { e.preventDefault(); commentState.saveEdit(); }
    else if (e.key === 'Escape') commentState.cancelEdit();
  };

  return (
    <li className="flex gap-3 border-b border-bg py-3.5 last:border-b-0">
      <span className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: comment.avatarBg }}>{comment.avatar}</span>
      <div className="min-w-0 flex-1">
        <header className="mb-0.5 flex items-baseline gap-2.5">
          <span className="text-[12.5px] font-bold">{comment.user}</span>
          <span className="text-[10.5px] text-faint">{comment.time}</span>
          {comment.canEdit && !isEditing && (
            <span className="ml-auto flex gap-3.5">
              <a onClick={() => commentState.startEdit(comment.id, comment.initEditDraft)} className="cursor-pointer text-[11px] font-bold text-primary">編集</a>
              <a onClick={comment.deleteClick} className="cursor-pointer text-[11px] font-bold text-faint">削除</a>
            </span>
          )}
        </header>
        {!isEditing && (
          <p className="m-0 text-[13px] leading-[1.9] whitespace-pre-wrap text-body">{comment.text}</p>
        )}
        {isEditing && (
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <textarea
              value={commentState.editDraft}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => commentState.setEditDraft(e.target.value)}
              onKeyDown={handleEditKey}
              rows={2}
              className="min-w-45 flex-1 resize-y rounded-xl border border-primary bg-card px-4 py-2.25 text-[13px] leading-[1.8] text-ink"
            />
            <Button variant="primary" size="sm" onClick={commentState.saveEdit}>保存</Button>
            <Button variant="outline" size="sm" onClick={commentState.cancelEdit}>キャンセル</Button>
          </div>
        )}
      </div>
    </li>
  );
}
