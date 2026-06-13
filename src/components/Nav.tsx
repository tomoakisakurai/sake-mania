/* eslint-disable @typescript-eslint/no-explicit-any */

export function Nav({ v }: { v: any }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 20, padding: '16px 32px', borderBottom: '1px solid #E3DBCB', background: '#FDFBF5' }}>
      <div onClick={v.goHome} style={{ display: 'flex', alignItems: 'baseline', gap: 10, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 22, fontWeight: 800, letterSpacing: '0.06em' }}>酒マニア</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: '#8B8273' }}>SAKE MANIA</span>
      </div>
      {v.isDesktopNav && (
        <div style={{ display: 'flex', gap: 22, fontSize: 14, flexShrink: 0, whiteSpace: 'nowrap' }}>
          {v.navItems.map((n: any, i: number) => (
            <span key={i} onClick={n.click} style={{ cursor: 'pointer', paddingBottom: 2, color: n.color, fontWeight: n.weight, borderBottom: n.border }}>{n.label}</span>
          ))}
        </div>
      )}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        {v.isDesktopNav && (
          <>
            <div onClick={v.goZukan} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 999, padding: '8px 18px', fontSize: 13, color: '#A89D8A', flex: '0 1 240px', minWidth: 90, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}>銘柄・酒蔵をさがす</div>
            <div onClick={v.startRecordClick} style={{ background: '#32507C', color: '#FDFBF5', borderRadius: 999, padding: '9px 22px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>＋ 記録する</div>
          </>
        )}
        {v.loggedIn && (
          <div onClick={v.goMy} style={{ width: 36, height: 36, borderRadius: '50%', background: '#DDD3BE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>{v.userAvatar}</div>
        )}
        {v.loggedOut && (
          <div onClick={v.goLogin} style={{ border: '1px solid #32507C', color: '#32507C', borderRadius: 999, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>ログイン</div>
        )}
      </div>
    </div>
  );
}
