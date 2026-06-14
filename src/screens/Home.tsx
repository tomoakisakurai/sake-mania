/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
export function Home({ v }: { v: any }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: v.pagePad }}>
      {/* hero */}
      <div style={{ display: 'grid', gridTemplateColumns: v.heroCols, gap: 32, marginBottom: 36 }}>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.18em', color: '#8B8273', marginBottom: 14 }}>MY SAKE JOURNAL</div>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: v.heroTitleSize, fontWeight: 700, lineHeight: 1.45, letterSpacing: '0.03em', marginBottom: 16 }}>一杯ごとに、<br />記憶を醸す。</div>
          <div style={{ fontSize: 14, lineHeight: 2, color: '#5C5547', maxWidth: 420 }}>飲んだ日本酒を、味わいの座標と言葉で残す。あなただけの利き酒帳が、次の一本を教えてくれる。</div>
          <div style={{ display: 'flex', gap: 32, marginTop: 26 }}>
            <div><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 30, fontWeight: 700 }}>{v.statCups}</div><div style={{ fontSize: 12, color: '#8B8273' }}>記録した盃</div></div>
            <div style={{ borderLeft: '1px solid #E3DBCB', paddingLeft: 32 }}><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 30, fontWeight: 700 }}>{v.statBrands}</div><div style={{ fontSize: 12, color: '#8B8273' }}>出会った銘柄</div></div>
            <div style={{ borderLeft: '1px solid #E3DBCB', paddingLeft: 32 }}><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 30, fontWeight: 700 }}>{v.statKura}</div><div style={{ fontSize: 12, color: '#8B8273' }}>出会った蔵</div></div>
          </div>
        </div>
        <div onClick={v.todayClick} style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: 24, display: 'flex', gap: 20, cursor: 'pointer' }}>
          <div style={{ width: 100, height: 170, flexShrink: 0, borderRadius: 6, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#8B8273', writingMode: 'vertical-rl' }}>ボトル写真</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.16em', color: '#BC6A2D' }}>今日の一本 — 未踏領域へ</div>
            <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 21, fontWeight: 700, lineHeight: 1.5 }}>{v.today.name}</div>
            <div style={{ fontSize: 12, color: '#8B8273' }}>{v.today.sub}</div>
            <div style={{ fontSize: 13, lineHeight: 1.8, color: '#5C5547' }}>あなたのマップの空白「中庸×やや香り」に位置する一本。酸のキレは新政系と通じます。</div>
            <div style={{ marginTop: 'auto', fontSize: 13, fontWeight: 700, color: '#32507C' }}>図鑑で見る →</div>
          </div>
        </div>
      </div>

      {/* taste map */}
      <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: '28px 32px', marginBottom: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 19, fontWeight: 700 }}>あなたの味わいマップ</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#8B8273' }}>{v.statCups}盃 / {v.statBrands}銘柄</div>
        </div>
        <div style={{ position: 'relative', width: '100%', height: v.mapH, background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 8 }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#EAE2D0' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#EAE2D0' }}></div>
          <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', fontSize: 11, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '0 8px' }}>香り高い</div>
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', fontSize: 11, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '0 8px' }}>穏やか</div>
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 11, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '4px 0' }}>淡麗</div>
          <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 11, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '4px 0' }}>濃醇</div>
          {v.myDots.map((d: any, i: number) => (
            <Fragment key={i}>
              <div style={{ position: 'absolute', left: `${d.left}%`, top: `${d.top}%`, transform: 'translate(-50%, -50%)', width: `${d.size}px`, height: `${d.size}px`, borderRadius: '50%', background: d.bg }}></div>
              <div style={{ position: 'absolute', left: `${d.left}%`, top: `${d.top}%`, transform: 'translate(11px, -7px)', fontSize: 11, color: '#5C5547' }}>{d.label}</div>
            </Fragment>
          ))}
          <div style={{ position: 'absolute', left: '44%', top: '50%', transform: 'translate(-50%, -50%)', width: 20, height: 20, borderRadius: '50%', border: '2px dashed #BC6A2D', background: 'rgba(188,106,45,0.07)' }}></div>
          <div style={{ position: 'absolute', left: '44%', top: '50%', transform: 'translate(14px, -8px)', fontSize: 11, color: '#BC6A2D', fontWeight: 700 }}>未踏の領域</div>
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 14, fontSize: 11.5, color: '#5C5547', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 11, height: 11, borderRadius: '50%', background: '#BC6A2D', display: 'inline-block' }}></span>五つ星の盃</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: '50%', background: '#32507C', display: 'inline-block' }}></span>記録済み</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px dashed #BC6A2D', display: 'inline-block' }}></span>まだ飲んでいない座標 — ここを開拓しよう</span>
        </div>
      </div>

      {/* feed + sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: v.homeSplitCols, gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid #E3DBCB', paddingBottom: 10 }}>
            <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700 }}>みんなの利き酒帳</div>
            <div onClick={v.goFeed} style={{ fontSize: 13, color: '#32507C', fontWeight: 700, cursor: 'pointer' }}>すべて見る →</div>
          </div>
          {v.feedItems.map((f: any, i: number) => (
            <div key={i} onClick={f.click} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '20px 24px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: f.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{f.avatar}</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{f.user} <span style={{ fontWeight: 400, color: '#A89D8A' }}>{f.mine}</span></div>
                <div style={{ fontSize: 11, color: '#A89D8A' }}>{f.time}</div>
                <div style={{ marginLeft: 'auto', color: '#BC6A2D', fontSize: 14, letterSpacing: 2 }}>{f.stars}</div>
              </div>
              <div style={{ display: 'flex', gap: 18 }}>
                {f.hasPhoto && (<img src={f.photo} style={{ width: 72, height: 96, flexShrink: 0, borderRadius: 4, objectFit: 'cover' }} alt="" />)}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, paddingTop: 12, borderTop: '1px solid #F0EADC' }}>
                {f.canNomi && (
                  <div onClick={f.nomiClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid #BC6A2D', borderRadius: 999, padding: '6px 16px', cursor: 'pointer', background: f.nomiBg, color: f.nomiColor, fontSize: 12, fontWeight: 700 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h16c0 6.2-3.5 9.8-7 10.7V18h4v2.5H7V18h4v-4.3C7.5 12.8 4 9.2 4 3z"></path></svg>
                    のみたいね <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>{f.nomiCount}</span>
                  </div>
                )}
                {f.cantNomi && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#BC6A2D', fontSize: 12, fontWeight: 700 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h16c0 6.2-3.5 9.8-7 10.7V18h4v2.5H7V18h4v-4.3C7.5 12.8 4 9.2 4 3z"></path></svg>
                    のみたいね <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>{f.nomiCount}</span>
                  </div>
                )}
                <div style={{ fontSize: 12, color: '#8B8273' }}>コメント <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>{f.commentCount}</span></div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700, borderBottom: '1px solid #E3DBCB', paddingBottom: 10 }}>今週の人気銘柄</div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '8px 24px' }}>
            {v.ranking.map((r: any, i: number) => (
              <div key={i} onClick={r.click} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid #F0EADC', cursor: 'pointer' }}>
                <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 20, fontWeight: 700, width: 24, flexShrink: 0, color: r.color }}>{r.rank}</div>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div><div style={{ fontSize: 11, color: '#8B8273', lineHeight: 1.5 }}>{r.brewery}</div></div>
                <div style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#8B8273' }}>{r.count}</div>
              </div>
            ))}
          </div>
          {v.homeNext ? (
            <div onClick={v.homeNext.click} style={{ background: '#32507C', borderRadius: 12, padding: '22px 24px', color: '#FDFBF5', cursor: 'pointer' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.16em', opacity: 0.7, marginBottom: 8 }}>次回のSAKE MEETUP</div>
              <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 19, fontWeight: 700, lineHeight: 1.5 }}>{v.homeNext.name}</div>
              <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 6 }}>{v.homeNext.dateLabel} ・ {v.homeNext.place}</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>テーマ:{v.homeNext.theme}</div>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, opacity: 0.85 }}><span>{v.homeNext.goingLabel}</span><span>{v.homeNext.bringLabel}</span></div>
              <div style={{ fontSize: 12, fontWeight: 700, marginTop: 12 }}>詳細・持ち寄りを宣言する →</div>
            </div>
          ) : (
            <div style={{ background: '#FDFBF5', border: '1px dashed #D9D0BC', borderRadius: 12, padding: '22px 24px', color: '#8B8273' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.16em', marginBottom: 8 }}>次回のSAKE MEETUP</div>
              <div style={{ fontSize: 13, lineHeight: 1.8 }}>予定されている会はまだありません。<br />下の「＋ SAKE MEETUPを立てる」から作成できます。</div>
            </div>
          )}
          {v.hasVoting && (
            <div onClick={v.homeVoting.click} style={{ background: '#FBF0E6', border: '1px solid #E8C9A8', borderRadius: 12, padding: '16px 20px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ background: '#BC6A2D', color: '#FDFBF5', borderRadius: 999, padding: '2px 10px', fontSize: 10, fontWeight: 700 }}>MVP投票受付中</span>
                <span style={{ fontSize: 11, color: '#9A5A20' }}>締切 {v.homeVoting.deadline}</span>
              </div>
              <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700, color: '#2E2A24' }}>{v.homeVoting.name}</div>
              <div style={{ fontSize: 12, color: '#9A5A20', fontWeight: 700, marginTop: 4 }}>あなたの一本に投票する →</div>
            </div>
          )}
          <div style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '16px 20px 6px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8B8273', marginBottom: 4 }}>過去のふりかえり</div>
            {v.homePast.map((hp: any, i: number) => (
              <div key={i} onClick={hp.click} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F0EADC', cursor: 'pointer' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#BC6A2D', width: 40, flexShrink: 0, fontWeight: 500 }}>{hp.dateShort}</div>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hp.name}</div><div style={{ fontSize: 10.5, color: '#8B8273', lineHeight: 1.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>テーマ:{hp.theme}</div></div>
                {hp.isVoting && (<span style={{ background: '#BC6A2D', color: '#FDFBF5', borderRadius: 999, padding: '2px 9px', fontSize: 9.5, fontWeight: 700, flexShrink: 0 }}>投票中</span>)}
                {hp.notVoting && (<div style={{ color: '#32507C', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>→</div>)}
              </div>
            ))}
            <div onClick={v.openMeetupCreate} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 0', cursor: 'pointer', color: '#32507C', fontSize: 12.5, fontWeight: 700 }}>
              <span style={{ fontSize: 15 }}>＋</span> SAKE MEETUPを立てる
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
