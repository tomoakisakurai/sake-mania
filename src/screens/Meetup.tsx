/* eslint-disable @typescript-eslint/no-explicit-any */
export function Meetup({ v }: { v: any }) {
  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: v.pagePadTight }}>
      <div onClick={v.meetup.backHome} style={{ fontSize: 13, color: '#8B8273', cursor: 'pointer', marginBottom: 24 }}>← ホームにもどる</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.18em', color: '#BC6A2D' }}>SAKE MEETUP</div>
        <span style={{ background: v.meetup.phaseBg, color: '#FDFBF5', borderRadius: 999, padding: '2px 12px', fontSize: 11, fontWeight: 700 }}>{v.meetup.phaseLabel}</span>
      </div>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 32, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, marginTop: 6 }}>{v.meetup.name}</div>
      <div style={{ fontSize: 13.5, color: '#8B8273', marginBottom: 4 }}>{v.meetup.dateLabel} ・ {v.meetup.place}</div>
      <div style={{ fontSize: 13, color: '#5C5547', marginBottom: 24 }}>テーマ:{v.meetup.theme} ・ 幹事 {v.meetup.hostName}</div>

      {/* 開催前 = 出欠・持ち寄り宣言 */}
      {v.meetup.isBefore && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
            <div onClick={v.meetup.goToggle} style={{ border: '1.5px solid #32507C', borderRadius: 999, padding: '12px 30px', fontSize: 14.5, fontWeight: 700, cursor: 'pointer', background: v.meetup.goBg, color: v.meetup.goColor }}>{v.meetup.goLabel}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex' }}>
                {v.meetup.goingAvatars.map((ga: any, i: number) => (
                  <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: ga.bg, border: '2px solid #E9E6DF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, marginLeft: -8 }}>{ga.avatar}</div>
                ))}
              </div>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#8B8273' }}>{v.meetup.goCount}人が参加予定</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: v.meetCols, gap: 28, alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid #E3DBCB', paddingBottom: 10, marginBottom: 16 }}>
                <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700 }}>持ち寄りラインナップ</div>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#8B8273' }}>{v.meetup.bringCount}本 宣言済み</span>
              </div>
              {v.meetup.hasDup && (
                <div style={{ background: '#FBF0E6', border: '1px solid #E8C9A8', borderRadius: 10, padding: '12px 16px', fontSize: 12.5, color: '#9A5A20', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path></svg>
                  銘柄がかぶっています。誰かが変えると、当日の種類が増えてもっと楽しめます。
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {v.meetup.bringList.map((bl: any, i: number) => (
                  <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: '50%', background: bl.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{bl.avatar}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11.5, color: '#8B8273' }}>{bl.memberName}</span>
                        {bl.mine && (<span style={{ background: '#DDD3BE', borderRadius: 999, padding: '1px 8px', fontSize: 10, fontWeight: 700 }}>あなた</span>)}
                        {bl.dup && (<span style={{ background: '#F3D9C0', color: '#9A5A20', borderRadius: 999, padding: '1px 9px', fontSize: 10, fontWeight: 700 }}>かぶり</span>)}
                      </div>
                      <div onClick={bl.brandClick} style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 2 }}>{bl.brandName}</div>
                      <div style={{ fontSize: 11, color: '#8B8273' }}>{bl.brandSub}</div>
                      {bl.note && (<div style={{ fontSize: 12, color: '#5C5547', marginTop: 4 }}>「{bl.note}」</div>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: '20px 22px' }}>
                <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>あなたの一本</div>
                {v.meetup.myDeclared && (
                  <>
                    <div style={{ fontSize: 12.5, color: '#5C5547', lineHeight: 1.8, marginBottom: 12 }}>持ち寄りを宣言済みです。当日をお楽しみに。</div>
                    <div onClick={v.meetup.declareClick} style={{ background: '#32507C', color: '#FDFBF5', borderRadius: 999, padding: 11, textAlign: 'center', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', marginBottom: 8 }}>{v.meetup.declareLabel}</div>
                    <div onClick={v.meetup.cancelDeclare} style={{ textAlign: 'center', fontSize: 12, color: '#A89D8A', cursor: 'pointer' }}>宣言を取り消す</div>
                  </>
                )}
                {v.meetup.notMyDeclared && (
                  <>
                    <div style={{ fontSize: 12.5, color: '#5C5547', lineHeight: 1.8, marginBottom: 12 }}>何を持っていくか宣言しましょう。先に宣言された銘柄は「かぶり」で分かるので、自然と種類が散らばります。</div>
                    <div onClick={v.meetup.declareClick} style={{ background: '#BC6A2D', color: '#FDFBF5', borderRadius: 999, padding: 12, textAlign: 'center', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>{v.meetup.declareLabel}</div>
                  </>
                )}
              </div>
            </div>
          </div>
          {v.meetup.hostCanStart && (
            <div onClick={v.meetup.startVoting} style={{ display: 'inline-block', border: '1.5px solid #BC6A2D', color: '#BC6A2D', borderRadius: 999, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 22 }}>幹事メニュー:会を終えてMVP投票を開始する</div>
          )}
        </>
      )}

      {/* 投票受付中 / 確定 = ふりかえり */}
      {v.meetup.showLineup && (
        <>
          {v.meetup.isVoting && (
            <>
              <div style={{ background: '#FBF0E6', border: '1px solid #E8C9A8', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ background: '#BC6A2D', color: '#FDFBF5', borderRadius: 999, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>MVP投票受付中</span>
                <span style={{ fontSize: 12.5, color: '#9A5A20' }}>今日の一本に1人1票。締切 {v.meetup.voteDeadline}。締切後にMVPが確定します。</span>
              </div>
              {v.meetup.hostCanClose && (
                <div onClick={v.meetup.closeVoting} style={{ display: 'inline-block', border: '1.5px solid #5C5547', color: '#5C5547', borderRadius: 999, padding: '9px 22px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', marginBottom: 20 }}>幹事メニュー:投票を締め切ってMVPを確定する</div>
              )}
            </>
          )}
          <div style={{ background: 'linear-gradient(135deg, #32507C, #263d5f)', borderRadius: 14, padding: '24px 28px', color: '#FDFBF5', marginBottom: 28 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.18em', opacity: 0.7, marginBottom: 10 }}>{v.meetup.mvpLabel}</div>
            <div onClick={v.meetup.mvp.brandClick} style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 24, fontWeight: 700, cursor: 'pointer' }}>{v.meetup.mvp.brandName}</div>
            <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 4 }}>{v.meetup.mvp.brandSub} ・ {v.meetup.mvp.broughtBy}さんが持参 ・ {v.meetup.mvp.votesLabel}</div>
            <div style={{ fontSize: 13, lineHeight: 1.9, opacity: 0.95, marginTop: 12 }}>「{v.meetup.mvp.comment}」</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid #E3DBCB', paddingBottom: 10, marginBottom: 18 }}>
            <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700 }}>得票ランキング</div>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#8B8273' }}>{v.meetup.attendees}名参加 ・ 計{v.meetup.totalVotesLabel}</span>
          </div>
          {v.meetup.isClosed && (
            <div style={{ fontSize: 11.5, color: '#A89D8A', marginBottom: 14 }}>この会の投票は締め切られ、MVPは確定しています。</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {v.meetup.lineup.map((lp: any, i: number) => (
              <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 22, fontWeight: 700, color: '#BC6A2D', width: 26, flexShrink: 0, textAlign: 'center' }}>{lp.rankLabel}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <div onClick={lp.brandClick} style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>{lp.brandName}</div>
                    {lp.isMvp && (<span style={{ background: '#BC6A2D', color: '#FDFBF5', borderRadius: 999, padding: '2px 10px', fontSize: 10, fontWeight: 700 }}>MVP</span>)}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#8B8273', marginBottom: 6 }}>{lp.brandSub}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ color: '#BC6A2D', fontSize: 14, letterSpacing: 2 }}>{lp.stars}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#5C5547' }}>平均{lp.score} ・ {lp.votes}</span>
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
      )}
    </div>
  );
}
