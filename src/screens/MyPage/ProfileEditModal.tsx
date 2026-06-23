'use client';
import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useStore } from '@/store';
import { Modal } from '@/components/shared/Modal';
import { Input } from '@/components/shared/Input';
import { Textarea } from '@/components/shared/Textarea';
import { Button } from '@/components/shared/Button';
import { Spinner } from '@/components/shared/Spinner';
import { getMyProfile, updateMyProfile, type ProfileView } from '@/app/actions/profile';

type Props = {
  open: boolean;
  onClose: () => void;
  prefOptions: string[];
  onSaved?: () => void;
};

// マイページの「プロフィール編集」モーダル。プロトタイプ準拠の4項目。
// 写真アップロードはSupabase Storageの整備後に別途追加する。
export function ProfileEditModal({ open, onClose, prefOptions, onSaved }: Props) {
  const store = useStore();
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nickname, setNickname] = useState('');
  const [hometown, setHometown] = useState('');
  const [dept, setDept] = useState('');
  const [bio, setBio] = useState('');

  // モーダルを開くたびにDBから最新のプロフィールを読み直す
  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoaded(false);
    getMyProfile().then((p: ProfileView | null) => {
      if (!active) return;
      setNickname(p?.nickname ?? '');
      setHometown(p?.hometown ?? '');
      setDept(p?.dept ?? '');
      setBio(p?.bio ?? '');
      setLoaded(true);
    });
    return () => { active = false; };
  }, [open]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    const ok = await updateMyProfile({ nickname, hometown, dept, bio });
    setSaving(false);
    if (!ok) {
      store.flash('保存に失敗しました');
      return;
    }
    store.flash('プロフィールを更新しました');
    onSaved?.();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="プロフィール編集" width="sm">
      {!loaded ? (
        <div className="flex items-center justify-center py-10 text-primary"><Spinner className="h-6 w-6" /></div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); handleSave(); }}
          className="flex flex-col gap-4"
        >
          <Field label="ニックネーム" required>
            <Input value={nickname} onChange={(e: ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)} placeholder="例: sake_taro" />
          </Field>
          <Field label="出身地(都道府県)" hint="設定すると「メンバー出身地マップ」に表示されます。未設定なら非表示。">
            <select
              value={hometown}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setHometown(e.target.value)}
              className="w-full rounded-[10px] border border-line bg-surface px-4 py-3 text-[14px] text-ink"
            >
              <option value="">未設定</option>
              {prefOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>
          <Field label="所属部署">
            <Input value={dept} onChange={(e: ChangeEvent<HTMLInputElement>) => setDept(e.target.value)} placeholder="例: プロダクト部" />
          </Field>
          <Field label="ひとこと自己紹介">
            <Textarea
              value={bio}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
              placeholder="好きな銘柄や酒との出会いなど"
              rows={3}
            />
          </Field>
          <footer className="mt-2 flex justify-end gap-2.5">
            <Button variant="outline" size="md" onClick={onClose} type="button">キャンセル</Button>
            <Button variant="primary" size="md" type="submit" disabled={saving || !nickname.trim()}>
              {saving && <Spinner className="h-4 w-4" />}
              保存する
            </Button>
          </footer>
        </form>
      )}
    </Modal>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-bold text-muted">{label}{required && <span className="ml-1 text-accent">*</span>}</span>
      {children}
      {hint && <span className="mt-1 block text-[10.5px] leading-[1.6] text-faint">{hint}</span>}
    </label>
  );
}
