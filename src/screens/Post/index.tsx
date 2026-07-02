'use client';
import { useState } from 'react';
import type { PostRef } from '@/types';
import { usePostVals } from './usePostVals';
import { useStore } from '@/store';
import { editComment as editCommentAction } from '@/app/actions/social';
import { Header } from './Header';
import { MediaColumn } from './MediaColumn';
import { TasteColumn } from './TasteColumn';
import { Comments } from './Comments';

export interface CommentState {
  draft: string;
  setDraft: (s: string) => void;
  editingId: string | null;
  editDraft: string;
  setEditDraft: (s: string) => void;
  startEdit: (id: string, text: string) => void;
  cancelEdit: () => void;
  saveEdit: () => void;
}

export function Post({ postRef }: { postRef: PostRef | null }) {
  const post = usePostVals(postRef);
  const store = useStore();
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');

  const startEdit = (id: string, text: string) => { setEditingId(id); setEditDraft(text); };
  const cancelEdit = () => { setEditingId(null); setEditDraft(''); };
  const saveEdit = async () => {
    if (!editingId || !editDraft.trim()) return;
    const ok = await editCommentAction(editingId, editDraft.trim());
    if (ok) await store.loadSocial();
    else store.flash('編集に失敗しました');
    setEditingId(null);
    setEditDraft('');
  };

  const commentState: CommentState = { draft, setDraft, editingId, editDraft, setEditDraft, startEdit, cancelEdit, saveEdit };

  return (
    <main className="mx-auto max-w-215 px-4.5 pt-5 pb-32.5 md:px-10 md:pt-8 md:pb-20">
      <a onClick={() => store.nav('feed')} className="mb-5.5 block cursor-pointer text-[13px] text-muted">← みんなの利き酒帳にもどる</a>
      <article className="rounded-2xl border border-line bg-card px-4.5 py-5 md:px-9 md:py-8">
        <Header post={post} />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
          <MediaColumn post={post} />
          <TasteColumn post={post} />
        </div>
        <Comments post={post} commentState={commentState} />
      </article>
    </main>
  );
}
