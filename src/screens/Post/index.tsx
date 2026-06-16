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
  const st = useStore();
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');

  const startEdit = (id: string, text: string) => { setEditingId(id); setEditDraft(text); };
  const cancelEdit = () => { setEditingId(null); setEditDraft(''); };
  const saveEdit = async () => {
    if (!editingId || !editDraft.trim()) return;
    const ok = await editCommentAction(editingId, editDraft.trim());
    if (ok) await st.loadSocial();
    else st.flash('編集に失敗しました');
    setEditingId(null);
    setEditDraft('');
  };

  const cs: CommentState = { draft, setDraft, editingId, editDraft, setEditDraft, startEdit, cancelEdit, saveEdit };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: vals.pagePadTight }}>
      <div onClick={vals.goFeed} style={{ fontSize: 13, color: '#8B8273', cursor: 'pointer', marginBottom: 22 }}>← みんなの利き酒帳にもどる</div>
      <div style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 16, padding: vals.postCardPad }}>
        <Header vals={vals} />
        <div style={{ display: 'grid', gridTemplateColumns: vals.postCols, gap: 32 }}>
          <MediaColumn vals={vals} />
          <TasteColumn vals={vals} />
        </div>
        <Comments vals={vals} cs={cs} />
      </div>
    </div>
  );
}
