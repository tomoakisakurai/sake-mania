'use client';
import clsx from 'clsx';
import type { InviteView } from '@/app/actions/invites';
import { RevokeButton } from './RevokeButton';

type Props = {
  invites: InviteView[];
  onRevoke: (id: string) => Promise<boolean>;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ja-JP');
}

function statusLabel(invite: InviteView): string {
  if (invite.revokedAt) return '失効済み';
  if (invite.isActive) return '有効';
  if (invite.maxUses != null && invite.usedCount >= invite.maxUses) return '上限到達';
  return '期限切れ';
}

export function InviteList({ invites, onRevoke }: Props) {
  if (invites.length === 0) {
    return <p className="m-0 text-[12.5px] text-faint">まだ招待リンクはありません。</p>;
  }
  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {invites.map((invite) => (
        <li key={invite.id} className="flex items-center justify-between gap-4 rounded-xl border border-line bg-card px-5 py-4">
          <div className="min-w-0">
            <p className="m-0 mb-1 truncate text-[14px] font-bold text-ink">{invite.label || '(ラベルなし)'}</p>
            <p className="m-0 text-[12px] text-muted">
              作成 {formatDate(invite.createdAt)} / 期限 {invite.expiresAt ? formatDate(invite.expiresAt) : '無期限'} / 使用 {invite.usedCount}/{invite.maxUses ?? '無制限'}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className={clsx('text-[12px] font-bold', invite.isActive ? 'text-success' : 'text-faint')}>{statusLabel(invite)}</span>
            {!invite.revokedAt && <RevokeButton revoked={false} onRevoke={() => onRevoke(invite.id)} />}
          </div>
        </li>
      ))}
    </ul>
  );
}
