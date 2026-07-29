'use client';
import { useState } from 'react';
import clsx from 'clsx';

// イベント詳細・MEETUP詳細で共用するコメント一覧。
// 編集・削除・いいねの実処理は画面側から server action を注入する。
export interface CommentView {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  avatarBg: string;
  text: string;
  edited: boolean;
  createdAt: string;
  mine: boolean;
  likeCount: number;
  iLiked: boolean;
}

type Props = {
  comments: CommentView[];
  onEdit: (commentId: string, text: string) => Promise<boolean>;
  onDelete: (commentId: string) => Promise<boolean>;
  /** いいねを target state で反映する。未ログイン誘導は画面側で行い false を返す */
  onToggleLike: (commentId: string, liked: boolean) => Promise<boolean>;
  onChanged: () => void;
  /** 管理者モデレーション: 他人のコメントにも削除を出す(編集は本人のみ) */
  canModerate?: boolean;
};

function relativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'たった今';
  if (min < 60) return `${min}分前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}時間前`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}日前`;
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

export function CommentList({ comments, onEdit, onDelete, onToggleLike, onChanged, canModerate = false }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [likeBusyId, setLikeBusyId] = useState<string | null>(null);

  const handleLike = async (comment: CommentView) => {
    if (likeBusyId) return;
    setLikeBusyId(comment.id);
    const ok = await onToggleLike(comment.id, !comment.iLiked);
    setLikeBusyId(null);
    if (ok) onChanged();
  };

  const startEdit = (comment: CommentView) => {
    setEditingId(comment.id);
    setDraft(comment.text);
  };

  const save = async (id: string) => {
    if (!draft.trim()) return;
    const ok = await onEdit(id, draft);
    if (ok) {
      setEditingId(null);
      setDraft('');
      onChanged();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('このコメントを削除しますか?')) return;
    const ok = await onDelete(id);
    if (ok) onChanged();
  };

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3 py-3.5 border-b border-bg">
          <div
            style={{ background: comment.avatarBg }}
            className="w-7.5 h-7.5 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold"
          >
            {comment.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2.5 mb-1 flex-wrap">
              <span className="text-[12.5px] font-bold">{comment.userName}</span>
              <span className="text-[10.5px] text-faint">{relativeTime(comment.createdAt)}{comment.edited ? ' (編集済み)' : ''}</span>
              {(comment.mine || canModerate) && editingId !== comment.id && (
                <span className="ml-auto flex gap-3.5">
                  {comment.mine && (
                    <span onClick={() => startEdit(comment)} className="text-[11px] text-primary hover:underline cursor-pointer font-bold">編集</span>
                  )}
                  <span onClick={() => handleDelete(comment.id)} className="text-[11px] text-faint hover:text-danger cursor-pointer font-bold transition-colors">削除</span>
                </span>
              )}
            </div>
            {editingId === comment.id ? (
              <div className="flex gap-2 items-center mt-1.5 flex-wrap">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={2}
                  className="flex-1 min-w-45 bg-white border border-primary rounded-xl px-4 py-2.5 text-[13px] leading-relaxed text-ink resize-y"
                />
                <div onClick={() => save(comment.id)} className="bg-primary hover:bg-primary-dark text-surface rounded-full px-5 py-2 text-[12.5px] font-bold cursor-pointer transition-colors">保存</div>
                <div onClick={() => { setEditingId(null); setDraft(''); }} className="border border-line text-body rounded-full px-4 py-2 text-[12.5px] cursor-pointer bg-surface">キャンセル</div>
              </div>
            ) : (
              <>
                <div className="text-[13px] leading-relaxed text-body whitespace-pre-wrap">{comment.text}</div>
                <button
                  type="button"
                  onClick={() => handleLike(comment)}
                  disabled={likeBusyId === comment.id}
                  aria-label="いいね"
                  className={clsx(
                    'mt-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-0.5 text-[11px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                    comment.iLiked
                      ? 'border-accent bg-accent text-surface'
                      : 'border-line bg-surface text-muted hover:border-accent hover:text-accent',
                  )}
                >
                  ♡
                  {comment.likeCount > 0 && <span className="font-mono text-[10.5px]">{comment.likeCount}</span>}
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
