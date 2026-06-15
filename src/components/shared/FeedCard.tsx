/* eslint-disable @typescript-eslint/no-explicit-any */
// みんなの利き酒帳の投稿カード。ホーム(サイドの抜粋)とフィード一覧で共有する。
// 見た目はプロトタイプ通り(インラインスタイル)。padはホーム=20px 24px / フィード=22px 26px。

function NomiCup() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 3h16c0 6.2-3.5 9.8-7 10.7V18h4v2.5H7V18h4v-4.3C7.5 12.8 4 9.2 4 3z" />
    </svg>
  );
}

export function FeedCard({ f, pad = '22px 26px' }: { f: any; pad?: string }) {
  return (
    <div onClick={f.click} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: pad, cursor: 'pointer' }}>
      {/* author row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: f.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{f.avatar}</div>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{f.user} <span style={{ fontWeight: 400, color: '#A89D8A' }}>{f.mine}</span></div>
        <div style={{ fontSize: 11, color: '#A89D8A' }}>{f.time}</div>
        <div style={{ marginLeft: 'auto', color: '#BC6A2D', fontSize: 14, letterSpacing: 2 }}>{f.stars}</div>
      </div>

      {/* body: label photo + brand/memo */}
      <div style={{ display: 'flex', gap: 18 }}>
        {f.hasPhoto && (<img src={f.photo} alt="" style={{ width: 72, height: 96, flexShrink: 0, borderRadius: 4, objectFit: 'cover' }} />)}
        {f.noPhoto && (<div style={{ width: 72, height: 96, flexShrink: 0, borderRadius: 4, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#8B8273' }}>ラベル</span></div>)}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          <div onClick={f.brandClick} style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700, cursor: 'pointer' }}>{f.name}</div>
          <div style={{ fontSize: 12, color: '#8B8273' }}>{f.sub}</div>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: '#5C5547' }}>{f.memo}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
            {f.tags.map((t: any, i: number) => (
              <span key={i} style={{ background: '#F6F1E7', borderRadius: 999, padding: '3px 12px', fontSize: 11, color: '#5C5547' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* footer: のみたいね + comment count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, paddingTop: 12, borderTop: '1px solid #F0EADC' }}>
        {f.canNomi && (
          <div onClick={f.nomiClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid #BC6A2D', borderRadius: 999, padding: '6px 16px', cursor: 'pointer', background: f.nomiBg, color: f.nomiColor, fontSize: 12, fontWeight: 700 }}>
            <NomiCup />
            のみたいね <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>{f.nomiCount}</span>
          </div>
        )}
        {f.cantNomi && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#BC6A2D', fontSize: 12, fontWeight: 700 }}>
            <NomiCup />
            のみたいね <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>{f.nomiCount}</span>
          </div>
        )}
        <div style={{ fontSize: 12, color: '#8B8273' }}>コメント <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>{f.commentCount}</span></div>
      </div>
    </div>
  );
}
