import type { Vals } from '@/useVals';
// ホーム上部: コピー + 統計 と 「今日の一本」カード
export function Hero({ v }: { v: Vals }) {
  return (
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
  );
}
