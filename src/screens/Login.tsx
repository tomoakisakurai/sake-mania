/* eslint-disable @typescript-eslint/no-explicit-any */
export function Login({ v }: { v: any }) {
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
            {v.loginTabs.map((lt: any, i: number) => (
              <div key={i} onClick={lt.click} style={{ flex: 1, textAlign: 'center', paddingBottom: 12, fontSize: 14, cursor: 'pointer', color: lt.color, fontWeight: lt.weight, borderBottom: lt.border, marginBottom: -1 }}>{lt.label}</div>
            ))}
          </div>
          {v.isSignup && (
            <>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>ニックネーム</div>
              <input type="text" value={v.loginName} onChange={v.onLoginName} placeholder="例: sake_taro" style={{ width: '100%', background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24', marginBottom: 16 }} />
            </>
          )}
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>メールアドレス</div>
          <input type="email" value={v.loginEmail} onChange={v.onLoginEmail} placeholder="you@example.com" style={{ width: '100%', background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24', marginBottom: 16 }} />
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>パスワード</div>
          <input type="password" value={v.loginPw} onChange={v.onLoginPw} placeholder="••••••••" style={{ width: '100%', background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24', marginBottom: 22 }} />
          <div onClick={v.doLoginClick} style={{ background: '#32507C', color: '#FDFBF5', borderRadius: 999, padding: 14, textAlign: 'center', fontSize: 14.5, fontWeight: 700, cursor: 'pointer' }}>{v.loginCta}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E3DBCB' }}></div>
            <span style={{ fontSize: 11, color: '#A89D8A' }}>または</span>
            <div style={{ flex: 1, height: 1, background: '#E3DBCB' }}></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {v.socialBtns.map((sb: any, i: number) => (
              <div key={i} onClick={sb.click} style={{ border: '1px solid #E3DBCB', borderRadius: 999, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', background: '#FDFBF5' }}>
                <span style={{ fontWeight: 800, color: sb.markColor, fontSize: 14 }}>{sb.mark}</span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#2E2A24' }}>{sb.label}</span>
              </div>
            ))}
          </div>
          <div onClick={v.guestClick} style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8B8273', cursor: 'pointer' }}>ログインせずにのぞいてみる →</div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#A89D8A', marginTop: 14 }}>プロトタイプのため、入力内容にかかわらずログインできます</div>
      </div>
    </div>
  );
}
