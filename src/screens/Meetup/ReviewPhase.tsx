import type { Vals } from '@/useVals';
// 投票受付中 / 結果確定フェーズ: 投票バナー + MVPカード + 得票ランキング
export function ReviewPhase({ vals }: { vals: Vals }) {
  const m = vals.meetup;
  return (
    <>
      {m.isVoting && (
        <>
          <div style={{ background: '#FBF0E6', border: '1px solid #E8C9A8', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: '#BC6A2D', color: '#FDFBF5', borderRadius: 999, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>MVP投票受付中</span>
            <span style={{ fontSize: 12.5, color: '#9A5A20' }}>今日の一本に1人1票。締切 {m.voteDeadline}。締切後にMVPが確定します。</span>
          </div>
          {m.hostCanClose && (
            <div onClick={m.closeVoting} style={{ display: 'inline-block', border: '1.5px solid #5C5547', color: '#5C5547', borderRadius: 999, padding: '9px 22px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', marginBottom: 20 }}>幹事メニュー:投票を締め切ってMVPを確定する</div>
          )}
        </>
      )}
      <div style={{ background: 'linear-gradient(135deg, #32507C, #263d5f)', borderRadius: 14, padding: '24px 28px', color: '#FDFBF5', marginBottom: 28 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.18em', opacity: 0.7, marginBottom: 10 }}>{m.mvpLabel}</div>
        <div onClick={m.mvp.brandClick} style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 24, fontWeight: 700, cursor: 'pointer' }}>{m.mvp.brandName}</div>
        <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 4 }}>{m.mvp.brandSub} ・ {m.mvp.broughtBy}さんが持参 ・ {m.mvp.votesLabel}</div>
        <div style={{ fontSize: 13, lineHeight: 1.9, opacity: 0.95, marginTop: 12 }}>「{m.mvp.comment}」</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid #E3DBCB', paddingBottom: 10, marginBottom: 18 }}>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700 }}>得票ランキング</div>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#8B8273' }}>{m.attendees}名参加 ・ 計{m.totalVotesLabel}</span>
      </div>
      {m.isClosed && (
        <div style={{ fontSize: 11.5, color: '#A89D8A', marginBottom: 14 }}>この会の投票は締め切られ、MVPは確定しています。</div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {m.lineup.map((lp, i: number) => (
          <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 22, fontWeight: 700, color: '#BC6A2D', width: 26, flexShrink: 0, textAlign: 'center' }}>{lp.rankLabel}</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div onClick={lp.brandClick} style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>{lp.brandName}</div>
                {lp.isMvp && (<span style={{ background: '#BC6A2D', color: '#FDFBF5', borderRadius: 999, padding: '2px 10px', fontSize: 10, fontWeight: 700 }}>MVP</span>)}
              </div>
              <div style={{ fontSize: 11.5, color: '#8B8273', marginBottom: 6 }}>{lp.brandSub}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#BC6A2D', fontWeight: 700 }}>得票 {lp.votes}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: lp.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{lp.avatar}</div>
                <span style={{ fontSize: 11.5, color: '#8B8273' }}>{lp.broughtBy}さんが持参</span>
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.8, color: '#5C5547', marginBottom: 12 }}>「{lp.comment}」</div>
              {lp.canVote && (
                <div onClick={lp.voteClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1.5px solid #BC6A2D', borderRadius: 999, padding: '7px 18px', cursor: 'pointer', background: lp.voteBg, color: lp.voteColor, fontSize: 12.5, fontWeight: 700 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"></path></svg>
                  {lp.voteLabel}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
