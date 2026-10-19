'use client';
import { useCallback, useEffect, useState } from 'react';
import { useStore } from '@/store';
import { createInvite, listInvites, revokeInvite, type CreatedInvite, type InviteInput, type InviteView } from '@/app/actions/invites';
import { Button } from '@/components/shared/Button';
import { Loading } from '@/components/shared/Loading';
import { InviteForm } from './InviteForm';
import { CreatedInvitePanel } from './CreatedInvitePanel';
import { InviteList } from './InviteList';

// 新規登録の招待リンク(管理者のみ)。発行・一覧・失効。
export function AdminInvites() {
  const store = useStore();
  const authReady = useStore((s) => s.authReady);
  const isLoggedIn = useStore((s) => !!s.user);
  const isAdmin = useStore((s) => s.user?.isAdmin ?? false);
  const isMobile = useStore((s) => s.vw < 768);
  const pagePadding = isMobile ? '20px 18px 130px' : '32px 40px 80px';

  const [invites, setInvites] = useState<InviteView[] | null>(null);
  const [createdInvite, setCreatedInvite] = useState<CreatedInvite | null>(null);

  const reloadInvites = useCallback(async () => {
    setInvites(await listInvites());
  }, []);

  useEffect(() => {
    if (!authReady || !isAdmin) return;
    let active = true;
    listInvites().then((rows) => { if (active) setInvites(rows); });
    return () => { active = false; };
  }, [authReady, isAdmin]);

  if (!authReady) {
    return <main style={{ maxWidth: 720, margin: '0 auto', padding: pagePadding }} />;
  }
  if (!isLoggedIn || !isAdmin) {
    return (
      <main style={{ maxWidth: 720, margin: '0 auto', padding: pagePadding }}>
        <h1 className="m-0 mb-3 font-serif text-[22px] font-bold">管理者のみ</h1>
        <p className="m-0 mb-5 text-[14px] leading-[1.9] text-body">招待リンクの発行は管理者だけが行えます。</p>
        {!isLoggedIn && <Button type="button" onClick={() => store.nav('login')}>ログインする</Button>}
      </main>
    );
  }

  const handleCreate = async (input: InviteInput): Promise<boolean> => {
    try {
      const created = await createInvite(input);
      if (!created) { store.flash('招待リンクを発行できませんでした'); return false; }
      setCreatedInvite(created);
      store.flash(input.notifySlack ? '招待リンクを発行し、Slack に投稿しました' : '招待リンクを発行しました');
      await reloadInvites();
      return true;
    } catch {
      store.flash('通信エラーで発行できませんでした。時間をおいて再度お試しください');
      return false;
    }
  };

  const handleRevoke = async (id: string): Promise<boolean> => {
    try {
      const ok = await revokeInvite(id);
      if (!ok) { store.flash('失効できませんでした'); return false; }
      store.flash('招待リンクを失効しました');
      await reloadInvites();
      return true;
    } catch {
      store.flash('通信エラーで失効できませんでした。時間をおいて再度お試しください');
      return false;
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: pagePadding }}>
      <h1 className="m-0 mb-2 font-serif text-[24px] font-bold">招待リンク</h1>
      <p className="m-0 mb-8 text-[13px] leading-[1.9] text-body">
        社用メールアドレス以外の方は、招待リンクを開いたときだけ新規登録できます。社用メールアドレスの方には不要です。
      </p>
      <InviteForm onCreate={handleCreate} />
      {createdInvite && <CreatedInvitePanel invite={createdInvite} />}
      <section>
        <h2 className="m-0 mb-4 border-b border-line pb-2.5 font-serif text-[18px] font-bold">発行済みの招待リンク</h2>
        {invites === null ? <Loading /> : <InviteList invites={invites} onRevoke={handleRevoke} />}
      </section>
    </main>
  );
}
