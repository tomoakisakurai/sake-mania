import type { Vals } from '@/useVals';
// マイページ: 利き酒師ランク + 制覇状況 + 実績バッジ
export function Achievements({ v }: { v: Vals }) {
  return (
    <>
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
        {v.badges.map((bdg, i: number) => (
          <div key={i} style={{ width: 92, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: bdg.bg, color: bdg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700, margin: '0 auto 8px' }}>{bdg.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.4, color: bdg.labelColor }}>{bdg.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}
