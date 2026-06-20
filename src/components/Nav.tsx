'use client';
import { useState } from 'react';
import type { Vals } from '@/useVals';
import { Notifications } from './Notifications';

export function Nav({ vals }: { vals: Vals }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 20, padding: '16px 32px', borderBottom: '1px solid #E3DBCB', background: '#FDFBF5' }}>
      <div onClick={vals.goHome} style={{ display: 'flex', alignItems: 'baseline', gap: 10, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 22, fontWeight: 800, letterSpacing: '0.06em' }}>酒マニア</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: '#8B8273' }}>SAKE MANIA</span>
      </div>
      {vals.isDesktopNav && (
        <div style={{ display: 'flex', gap: 22, fontSize: 14, flexShrink: 0, whiteSpace: 'nowrap' }}>
          {vals.navItems.map((n, i: number) => (
            <span key={i} onClick={n.click} style={{ cursor: 'pointer', paddingBottom: 2, color: n.color, fontWeight: n.weight, borderBottom: n.border }}>{n.label}</span>
          ))}
        </div>
      )}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        {vals.isDesktopNav && (
          <>
            <div onClick={vals.goZukan} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 999, padding: '8px 18px', fontSize: 13, color: '#A89D8A', flex: '0 1 240px', minWidth: 90, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}>銘柄・酒蔵をさがす</div>
            <div onClick={vals.startRecordClick} style={{ background: '#32507C', color: '#FDFBF5', borderRadius: 999, padding: '9px 22px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>＋ 記録する</div>
          </>
        )}
        {vals.loggedIn && (
          <>
            <Notifications />
            <div onClick={vals.goMy} style={{ width: 36, height: 36, borderRadius: '50%', background: '#DDD3BE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>{vals.userAvatar}</div>
            {vals.isMobile && (
              <div onClick={() => setMenuOpen(true)} className="flex h-9 w-9 shrink-0 cursor-pointer flex-col items-center justify-center gap-[5px]">
                <span className="block h-[2px] w-5 rounded-[2px] bg-ink"></span>
                <span className="block h-[2px] w-5 rounded-[2px] bg-ink"></span>
                <span className="block h-[2px] w-5 rounded-[2px] bg-ink"></span>
              </div>
            )}
          </>
        )}
        {vals.loggedOut && (
          <div onClick={vals.goLogin} style={{ border: '1px solid #32507C', color: '#32507C', borderRadius: 999, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>ログイン</div>
        )}
      </div>

      {/* SP ハンバーガーメニュー（右スライドイン） */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} className="fixed inset-0 z-[70] animate-[fadeInOverlay_0.2s_ease_both] bg-[rgba(46,42,36,0.35)]"></div>
          <div className="fixed bottom-0 right-0 top-0 z-[71] flex w-[78vw] max-w-[300px] animate-[slideInRight_0.25s_cubic-bezier(0.32,0.72,0,1)_both] flex-col bg-surface pb-8 shadow-[-4px_0_24px_rgba(46,42,36,0.18)]">
            <div className="flex items-center justify-between border-b border-line px-[22px] py-[18px]">
              <div className="font-serif text-[17px] font-bold tracking-[0.04em]">酒マニア</div>
              <div onClick={() => setMenuOpen(false)} className="flex h-8 w-8 cursor-pointer items-center justify-center text-[20px] text-muted">✕</div>
            </div>
            <div className="flex-1 overflow-y-auto py-3">
              {vals.menuItems.map((mi, i: number) => (
                <div key={i} onClick={() => { setMenuOpen(false); mi.click(); }} className="cursor-pointer border-b border-[#F6F1E7] px-6 py-4 text-[15px] font-medium">{mi.label}</div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
