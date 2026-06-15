/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Vals } from '@/useVals';
// ホーム右カラム: 次回MEETUP/投票カード(PCのみ) + 過去のふりかえり + 今週の人気銘柄
export function MeetupSidebar({ v }: { v: Vals }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 次回MEETUP/投票カードはPCの右カラムのみ（SPは最上部に表示し重複させない） */}
      {v.isDesktopNav && (
        <>
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
          {v.homeVoting && (
            <div onClick={v.homeVoting.click} style={{ background: '#FBF0E6', border: '1px solid #E8C9A8', borderRadius: 12, padding: '16px 20px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ background: '#BC6A2D', color: '#FDFBF5', borderRadius: 999, padding: '2px 10px', fontSize: 10, fontWeight: 700 }}>MVP投票受付中</span>
                <span style={{ fontSize: 11, color: '#9A5A20' }}>締切 {v.homeVoting.deadline}</span>
              </div>
              <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700, color: '#2E2A24' }}>{v.homeVoting.name}</div>
              <div style={{ fontSize: 12, color: '#9A5A20', fontWeight: 700, marginTop: 4 }}>あなたの一本に投票する →</div>
            </div>
          )}
        </>
      )}

      {/* 過去のふりかえり */}
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

      {/* 今週の人気銘柄 */}
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
    </div>
  );
}
