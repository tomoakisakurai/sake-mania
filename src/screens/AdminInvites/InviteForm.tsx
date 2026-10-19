'use client';
import { useState } from 'react';
import type { InviteInput } from '@/app/actions/invites';
import { useStore } from '@/store';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Spinner } from '@/components/shared/Spinner';
import { ToggleSwitch } from '@/components/shared/ToggleSwitch';

type Props = {
  onCreate: (input: InviteInput) => Promise<boolean>;
};

/** 空欄は null(無期限・無制限)。正の整数以外は undefined(不正値) */
function parseOptionalPositiveInteger(value: string): number | null | undefined {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

export function InviteForm({ onCreate }: Props) {
  const store = useStore();
  const [label, setLabel] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [notifySlack, setNotifySlack] = useState(true);
  const [creating, setCreating] = useState(false);

  const handleSubmit = async () => {
    if (creating) return;
    const parsedExpiresInDays = parseOptionalPositiveInteger(expiresInDays);
    const parsedMaxUses = parseOptionalPositiveInteger(maxUses);
    if (parsedExpiresInDays === undefined) { store.flash('有効期限は1以上の整数(日数)で入力してください'); return; }
    if (parsedMaxUses === undefined) { store.flash('使用回数の上限は1以上の整数で入力してください'); return; }
    setCreating(true);
    try {
      const ok = await onCreate({ label: label.trim(), expiresInDays: parsedExpiresInDays, maxUses: parsedMaxUses, notifySlack });
      if (ok) { setLabel(''); setExpiresInDays(''); setMaxUses(''); }
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="mb-8 rounded-2xl border border-line bg-card p-6">
      <h2 className="m-0 mb-4 font-serif text-[18px] font-bold">招待リンクを発行する</h2>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="invite-label" className="mb-1.5 block text-[12.5px] font-bold">ラベル</label>
          <Input id="invite-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="例: 10月の新歓用" maxLength={100} />
        </div>
        <div>
          <label htmlFor="invite-expires" className="mb-1.5 block text-[12.5px] font-bold">有効期限(日数)</label>
          <Input id="invite-expires" type="number" min={1} step={1} inputMode="numeric" value={expiresInDays} onChange={(e) => setExpiresInDays(e.target.value)} placeholder="空欄なら無期限" />
        </div>
        <div>
          <label htmlFor="invite-max-uses" className="mb-1.5 block text-[12.5px] font-bold">使用回数の上限</label>
          <Input id="invite-max-uses" type="number" min={1} step={1} inputMode="numeric" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="空欄なら無制限" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[13px] font-bold">Slack にも投稿する</span>
          <ToggleSwitch checked={notifySlack} onChange={setNotifySlack} ariaLabel="Slack にも投稿する" />
        </div>
        <Button type="button" onClick={handleSubmit} disabled={creating}>
          {creating && <Spinner />}
          発行する
        </Button>
      </div>
    </section>
  );
}
