/* eslint-disable @typescript-eslint/no-explicit-any */
export function MyPage({ v }: { v: any }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: v.pagePad }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, marginBottom: 32 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#DDD3BE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, fontFamily: "'Shippori Mincho', serif" }}>{v.userAvatar}</div>
        <div>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700 }}>{v.userName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ background: '#32507C', color: '#FDFBF5', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', lineHeight: 1.4, display: 'inline-block' }}>利き酒師ランク · {v.rankName}</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 28 }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700 }}>{v.statCups}</div><div style={{ fontSize: 11, color: '#8B8273' }}>盃</div></div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid #E3DBCB', paddingLeft: 28 }}><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700 }}>{v.statBrands}</div><div style={{ fontSize: 11, color: '#8B8273' }}>銘柄</div></div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid #E3DBCB', paddingLeft: 28 }}><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700 }}>{v.statKura}</div><div style={{ fontSize: 11, color: '#8B8273' }}>蔵</div></div>
        </div>
        <div onClick={v.doLogout} style={{ border: '1px solid #E3DBCB', color: '#8B8273', borderRadius: 999, padding: '8px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>ログアウト</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: v.myCols, gap: 32, alignItems: 'start', marginBottom: 32 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 14, padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 16, fontWeight: 700 }}>利き酒師ランク</div>
            <span style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 20, fontWeight: 700, color: '#32507C' }}>{v.rankName}</span>
          </div>
          <div style={{ height: 8, background: '#EFEAE0', borderRadius: 4, position: 'relative', marginBottom: 8 }}><div style={{ position: 'absolute', left: 0, top: 0, height: 8, borderRadius: 4, background: '#BC6A2D', width: `${v.rankPct}%` }}></div></div>
          <div style={{ fontSize: 12, color: '#8B8273' }}>{v.rankNextLabel}</div>
        </div>
        <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 14, padding: '22px 24px' }}>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>制覇状況</div>
          <div style={{ display: 'flex', gap: 24, marginTop: 10 }}>
            <div><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 24, fontWeight: 700, color: '#BC6A2D' }}>{v.badgePref}<span style={{ fontSize: 13, color: '#8B8273' }}> / 47</span></div><div style={{ fontSize: 11, color: '#8B8273' }}>都道府県</div></div>
            <div style={{ borderLeft: '1px solid #E3DBCB', paddingLeft: 24 }}><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 24, fontWeight: 700 }}>{v.badgeKura}</div><div style={{ fontSize: 11, color: '#8B8273' }}>蔵数</div></div>
            <div style={{ borderLeft: '1px solid #E3DBCB', paddingLeft: 24 }}><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 24, fontWeight: 700 }}>{v.achievedCount}<span style={{ fontSize: 13, color: '#8B8273' }}> / {v.badgeTotal}</span></div><div style={{ fontSize: 11, color: '#8B8273' }}>バッジ</div></div>
          </div>
        </div>
      </div>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700, borderBottom: '1px solid #E3DBCB', paddingBottom: 10, marginBottom: 16 }}>実績バッジ</div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 36 }}>
        {v.badges.map((bdg: any, i: number) => (
          <div key={i} style={{ width: 92, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: bdg.bg, color: bdg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700, margin: '0 auto 8px' }}>{bdg.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.4, color: bdg.labelColor }}>{bdg.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: v.myCols, gap: 32, alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700, borderBottom: '1px solid #E3DBCB', paddingBottom: 10, marginBottom: 16 }}>わたしの利き酒帳</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {v.myList.map((m: any, i: number) => (
              <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '18px 22px', display: 'flex', gap: 16 }}>
                {m.hasPhoto && (<img src={m.photo} alt="" style={{ width: 56, height: 76, flexShrink: 0, borderRadius: 4, objectFit: 'cover' }} />)}
                {m.noPhoto && (<div style={{ width: 56, height: 76, flexShrink: 0, borderRadius: 4, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }}></div>)}
                <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div onClick={m.click} style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 16.5, fontWeight: 700, cursor: 'pointer' }}>{m.name}</div>
                  <div style={{ fontSize: 11.5, color: '#8B8273' }}>{m.sub}</div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: '#BC6A2D', fontSize: 13, letterSpacing: 2 }}>{m.stars}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#A89D8A' }}>{m.date}</span>
                  </div>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.9, color: '#5C5547', marginBottom: 8 }}>{m.memo}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {m.tags.map((mt: any, i: number) => (
                    <span key={i} style={{ background: '#F6F1E7', borderRadius: 999, padding: '3px 12px', fontSize: 11, color: '#5C5547' }}>{mt}</span>
                  ))}
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: '22px 24px' }}>
            <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>舌の地図</div>
            <div style={{ position: 'relative', width: '100%', height: 260, background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 8 }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#EAE2D0' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#EAE2D0' }}></div>
              <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 9.5, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '0 6px' }}>香り高い</div>
              <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 9.5, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '0 6px' }}>穏やか</div>
              <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 9.5, fontWeight: 700, color: '#8B8273' }}>淡麗</div>
              <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 9.5, fontWeight: 700, color: '#8B8273' }}>濃醇</div>
              {v.myDots.map((d2: any, i: number) => (
                <div key={i} style={{ position: 'absolute', left: `${d2.left}%`, top: `${d2.top}%`, transform: 'translate(-50%, -50%)', width: d2.size, height: d2.size, borderRadius: '50%', background: d2.bg }}></div>
              ))}
            </div>
            <div style={{ fontSize: 11.5, color: '#8B8273', marginTop: 12, lineHeight: 1.8 }}>あなたの打点は「香り高い×濃醇」に集中。淡麗系の名酒を試すと地図が広がります。</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '22px 24px' }}>
            <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>飲みたいリスト</div>
            {v.wantList.map((w: any, i: number) => (
              <div key={i} onClick={w.click} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F0EADC', cursor: 'pointer' }}>
                <div style={{ width: 34, height: 46, flexShrink: 0, borderRadius: 3, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }}></div>
                <div><div style={{ fontSize: 13.5, fontWeight: 700 }}>{w.name}</div><div style={{ fontSize: 11, color: '#8B8273' }}>{w.sub}</div></div>
                <a href={w.buyUrl} target="_blank" rel="noreferrer" onClick={v.stopProp} style={{ marginLeft: 'auto', fontSize: 11.5, color: '#BC6A2D', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>買う ↗</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
