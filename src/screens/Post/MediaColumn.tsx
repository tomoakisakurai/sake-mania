/* eslint-disable @typescript-eslint/no-explicit-any */
// 投稿詳細の左カラム: 写真 + アクション(図鑑/記録/公開トグル)
export function MediaColumn({ v }: { v: any }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {v.post.hasPhoto && (<img src={v.post.photo} style={{ width: '100%', height: 340, borderRadius: 10, objectFit: 'cover', border: '1px solid #E3DBCB', display: 'block' }} alt="" />)}
      {v.post.noPhoto && (<div style={{ height: 340, borderRadius: 10, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E3DBCB' }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#8B8273', writingMode: 'vertical-rl' }}>ラベル・ボトル写真</span></div>)}
      <div onClick={v.post.brandClick} style={{ border: '1px solid #32507C', color: '#32507C', borderRadius: 999, padding: 11, textAlign: 'center', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>図鑑でこの銘柄を見る</div>
      <div onClick={v.post.recordClick} style={{ background: '#32507C', color: '#FDFBF5', borderRadius: 999, padding: 12, textAlign: 'center', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>わたしも記録する</div>
      {v.post.canPublish && (
        <div onClick={v.post.publishToggle} style={{ border: `1.5px solid ${v.post.isPublic ? '#BC6A2D' : '#E3DBCB'}`, background: v.post.isPublic ? '#FBF0E6' : '#FDFBF5', color: v.post.isPublic ? '#9A5A20' : '#5C5547', borderRadius: 999, padding: 11, textAlign: 'center', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{v.post.publishLabel}</div>
      )}
    </div>
  );
}
