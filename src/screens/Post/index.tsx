'use client';
import { useState } from 'react';
import type { Vals } from '@/useVals';
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

export function Post({ vals }: { vals: Vals }) {
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
    <main className="mx-auto max-w-215" style={{ padding: vals.pagePadTight }}>
      <a onClick={vals.goFeed} className="mb-5.5 block cursor-pointer text-[13px] text-muted">← みんなの利き酒帳にもどる</a>
      <article className="rounded-2xl border border-line bg-card" style={{ padding: vals.postCardPad }}>
        <Header vals={vals} />
        <div className="grid gap-8" style={{ gridTemplateColumns: vals.postCols }}>
          <MediaColumn vals={vals} />
          <TasteColumn vals={vals} />
        </div>
        <Comments vals={vals} commentState={commentState} />
      </article>
    </main>
  );
}
