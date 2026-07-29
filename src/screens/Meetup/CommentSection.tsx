'use client';
import { useCallback, useEffect, useState } from 'react';
import { useStore } from '@/store';
import {
  getMeetupComments,
  addMeetupComment,
  editMeetupComment,
  deleteMeetupComment,
  setMeetupCommentLike,
} from '@/app/actions/meetups';
import type { MeetupCommentView } from '@/app/actions/meetups';
import { Button } from '@/components/shared/Button';
import { CommentList } from '@/components/shared/CommentList';

// MEETUP詳細のコメント欄。データは画面から独立して自前で取得する
// (meetupDetail は store 経由のため、store を肥やさないようローカルstateで持つ)。
export function CommentSection({ meetupId }: { meetupId: string }) {
  const store = useStore();
  const isAdmin = useStore((s) => s.user?.isAdmin ?? false);
  const [comments, setComments] = useState<MeetupCommentView[]>([]);
  const [draft, setDraft] = useState('');

  const refresh = useCallback(async () => {
    setComments(await getMeetupComments(meetupId));
  }, [meetupId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleToggleLike = async (commentId: string, liked: boolean) => {
    if (!store.requireLogin()) return false;
    return setMeetupCommentLike(commentId, liked);
  };

  const handleSend = async () => {
    if (!draft.trim()) return;
    if (!store.requireLogin()) return;
    const ok = await addMeetupComment(meetupId, draft);
    if (!ok) { store.flash('送信に失敗しました'); return; }
    setDraft('');
    refresh();
  };

  return (
    <section className="mt-9">
      <h2 className="m-0 mb-4 border-b border-line pb-2 font-serif text-[16px] font-bold">
        コメント <span className="font-mono text-[12px] font-normal text-muted">{comments.length}件</span>
      </h2>
      <CommentList comments={comments} onEdit={editMeetupComment} onDelete={deleteMeetupComment} onToggleLike={handleToggleLike} onChanged={refresh} canModerate={isAdmin} />

      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="flex gap-2.5 mt-4 items-start"
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          placeholder="この会について語ろう — 持ち寄りの相談や感想など"
          className="flex-1 min-w-0 bg-card border border-line rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed text-ink resize-y"
        />
        <Button type="submit" className="shrink-0 self-end">送る</Button>
      </form>
    </section>
  );
}
