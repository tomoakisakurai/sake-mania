import { useState } from 'react';
import type { Vals } from '@/useVals';
import { useStore } from '@/store';
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

export function Post({ v }: { v: Vals }) {
  const st = useStore();
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');

  const startEdit = (id: string, text: string) => { setEditingId(id); setEditDraft(text); };
  const cancelEdit = () => { setEditingId(null); setEditDraft(''); };
  const saveEdit = async () => {
    if (!editingId || !editDraft.trim()) return;
    await st.saveEditComment(editingId, editDraft.trim());
    setEditingId(null);
    setEditDraft('');
  };

  const cs: CommentState = { draft, setDraft, editingId, editDraft, setEditDraft, startEdit, cancelEdit, saveEdit };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: v.pagePadTight }}>
      <div onClick={v.goFeed} style={{ fontSize: 13, color: '#8B8273', cursor: 'pointer', marginBottom: 22 }}>← みんなの利き酒帳にもどる</div>
      <div style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 16, padding: v.postCardPad }}>
        <Header v={v} />
        <div style={{ display: 'grid', gridTemplateColumns: v.postCols, gap: 32 }}>
          <MediaColumn v={v} />
          <TasteColumn v={v} />
        </div>
        <Comments v={v} cs={cs} />
      </div>
    </div>
  );
}
