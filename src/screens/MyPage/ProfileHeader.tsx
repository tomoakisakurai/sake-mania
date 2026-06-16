import type { Vals } from '@/useVals';
// マイページ上部: アバター + 名前 + 利き酒師ランク + 統計 + ログアウト
export function ProfileHeader({ vals }: { vals: Vals }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, marginBottom: 32 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#DDD3BE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, fontFamily: "'Shippori Mincho', serif" }}>{vals.userAvatar}</div>
      <div>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700 }}>{vals.userName}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span style={{ background: '#32507C', color: '#FDFBF5', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', lineHeight: 1.4, display: 'inline-block' }}>利き酒師ランク · {vals.rankName}</span>
        </div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 28 }}>
        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700 }}>{vals.statCups}</div><div style={{ fontSize: 11, color: '#8B8273' }}>盃</div></div>
        <div style={{ textAlign: 'center', borderLeft: '1px solid #E3DBCB', paddingLeft: 28 }}><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700 }}>{vals.statBrands}</div><div style={{ fontSize: 11, color: '#8B8273' }}>銘柄</div></div>
        <div style={{ textAlign: 'center', borderLeft: '1px solid #E3DBCB', paddingLeft: 28 }}><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700 }}>{vals.statKura}</div><div style={{ fontSize: 11, color: '#8B8273' }}>蔵</div></div>
      </div>
      <div onClick={vals.doLogout} style={{ border: '1px solid #E3DBCB', color: '#8B8273', borderRadius: 999, padding: '8px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>ログアウト</div>
    </div>
  );
}
