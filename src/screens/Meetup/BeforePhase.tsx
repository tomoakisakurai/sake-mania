import type { Vals } from '@/useVals';
// 開催前フェーズ: 出欠トグル + 持ち寄りラインナップ + あなたの一本 + 幹事メニュー
export function BeforePhase({ v }: { v: Vals }) {
  const m = v.meetup;
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div onClick={m.goToggle} style={{ border: '1.5px solid #32507C', borderRadius: 999, padding: '12px 30px', fontSize: 14.5, fontWeight: 700, cursor: 'pointer', background: m.goBg, color: m.goColor }}>{m.goLabel}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex' }}>
            {m.goingAvatars.map((ga, i: number) => (
              <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: ga.bg, border: '2px solid #E9E6DF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, marginLeft: -8 }}>{ga.avatar}</div>
            ))}
          </div>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#8B8273' }}>{m.goCount}人が参加予定</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: v.meetCols, gap: 28, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid #E3DBCB', paddingBottom: 10, marginBottom: 16 }}>
            <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700 }}>持ち寄りラインナップ</div>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#8B8273' }}>{m.bringCount}本 宣言済み</span>
          </div>
          {m.hasDup && (
            <div style={{ background: '#FBF0E6', border: '1px solid #E8C9A8', borderRadius: 10, padding: '12px 16px', fontSize: 12.5, color: '#9A5A20', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path></svg>
              銘柄がかぶっています。誰かが変えると、当日の種類が増えてもっと楽しめます。
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {m.bringList.map((bl, i: number) => (
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
            {m.myDeclared && (
              <>
                <div style={{ fontSize: 12.5, color: '#5C5547', lineHeight: 1.8, marginBottom: 12 }}>持ち寄りを宣言済みです。当日をお楽しみに。</div>
                <div onClick={m.declareClick} style={{ background: '#32507C', color: '#FDFBF5', borderRadius: 999, padding: 11, textAlign: 'center', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', marginBottom: 8 }}>{m.declareLabel}</div>
                <div onClick={m.cancelDeclare} style={{ textAlign: 'center', fontSize: 12, color: '#A89D8A', cursor: 'pointer' }}>宣言を取り消す</div>
              </>
            )}
            {m.notMyDeclared && (
              <>
                <div style={{ fontSize: 12.5, color: '#5C5547', lineHeight: 1.8, marginBottom: 12 }}>何を持っていくか宣言しましょう。先に宣言された銘柄は「かぶり」で分かるので、自然と種類が散らばります。</div>
                <div onClick={m.declareClick} style={{ background: '#BC6A2D', color: '#FDFBF5', borderRadius: 999, padding: 12, textAlign: 'center', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>{m.declareLabel}</div>
              </>
            )}
          </div>
        </div>
      </div>
      {m.hostCanStart && (
        <div onClick={m.startVoting} style={{ display: 'inline-block', border: '1.5px solid #BC6A2D', color: '#BC6A2D', borderRadius: 999, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 22 }}>幹事メニュー:会を終えてMVP投票を開始する</div>
      )}
    </>
  );
}
