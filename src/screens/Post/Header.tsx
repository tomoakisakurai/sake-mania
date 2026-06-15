import type { Vals } from '@/useVals';
// 投稿詳細ヘッダ: 投稿者 + 評価(星)
export function Header({ v }: { v: Vals }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26, paddingBottom: 18, borderBottom: '1px solid #F0EADC' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: v.post.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>{v.post.avatar}</div>
      <div>
        <div style={{ fontSize: 14.5, fontWeight: 700 }}>{v.post.user} <span style={{ fontWeight: 400, color: '#A89D8A' }}>{v.post.mine}</span></div>
        <div style={{ fontSize: 11.5, color: '#A89D8A', marginTop: 2 }}>{v.post.timePlace}</div>
      </div>
      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
        <div style={{ color: '#BC6A2D', fontSize: 19, letterSpacing: 3 }}>{v.post.stars}</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#8B8273', marginTop: 2 }}>{v.post.ratingNum} / 5.0</div>
      </div>
    </div>
  );
}
