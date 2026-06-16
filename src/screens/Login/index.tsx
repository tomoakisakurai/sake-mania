import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { Vals } from '@/useVals';
import { useStore } from '@/store';

export function Login({ v }: { v: Vals }) {
  const st = useStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const loginTabs = (['login', 'signup'] as const).map((t) => ({
    label: t === 'login' ? 'ログイン' : '新規登録',
    click: () => setMode(t),
    color: mode === t ? '#2E2A24' : '#A89D8A',
    weight: mode === t ? 700 : 400,
    border: mode === t ? '2px solid #32507C' : '2px solid transparent',
  }));
  const isSignup = mode === 'signup';
  const loginCta = isSignup ? '登録してはじめる' : 'ログイン';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 18px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 42, fontWeight: 800, letterSpacing: '0.08em' }}>酒マニア</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.3em', color: '#8B8273', marginTop: 6 }}>SAKE MANIA</div>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, color: '#5C5547', marginTop: 20, letterSpacing: '0.06em' }}>一杯ごとに、記憶を醸す。</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 16, padding: '28px 26px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #E3DBCB', marginBottom: 24 }}>
            {loginTabs.map((lt, i: number) => (
              <div key={i} onClick={lt.click} style={{ flex: 1, textAlign: 'center', paddingBottom: 12, fontSize: 14, cursor: 'pointer', color: lt.color, fontWeight: lt.weight, borderBottom: lt.border, marginBottom: -1 }}>{lt.label}</div>
            ))}
          </div>
          {isSignup && (
            <>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>ニックネーム</div>
              <input type="text" value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="例: sake_taro" style={{ width: '100%', background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24', marginBottom: 16 }} />
            </>
          )}
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>メールアドレス</div>
          <input type="email" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: '100%', background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24', marginBottom: 16 }} />
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>パスワード</div>
          <input type="password" value={pw} onChange={(e: ChangeEvent<HTMLInputElement>) => setPw(e.target.value)} placeholder="••••••••" style={{ width: '100%', background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24', marginBottom: 22 }} />
          <div onClick={() => st.doLogin(email.trim(), pw, name, mode)} style={{ background: '#32507C', color: '#FDFBF5', borderRadius: 999, padding: 14, textAlign: 'center', fontSize: 14.5, fontWeight: 700, cursor: 'pointer' }}>{loginCta}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E3DBCB' }}></div>
            <span style={{ fontSize: 11, color: '#A89D8A' }}>または</span>
            <div style={{ flex: 1, height: 1, background: '#E3DBCB' }}></div>
          </div>
          <div onClick={v.githubLogin} style={{ border: '1px solid #24292F', borderRadius: 999, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', background: '#24292F', color: '#FFFFFF' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-1.7c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.6 18 4.9 18 4.9c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"></path></svg>
            <span style={{ fontSize: 13.5, fontWeight: 700 }}>GitHubでログイン</span>
          </div>
          <div onClick={v.guestClick} style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8B8273', cursor: 'pointer' }}>ログインせずにのぞいてみる →</div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#A89D8A', marginTop: 14 }}>新規登録はメールアドレスとパスワード（6文字以上）だけ。確認メールなしですぐ始められます。</div>
      </div>
    </div>
  );
}
