/* eslint-disable @typescript-eslint/no-explicit-any */
// 記録ステップ1: 銘柄を検索して選ぶ
export function Step1Brand({ v }: { v: any }) {
  return (
    <>
      <input type="text" value={v.recQuery} onChange={v.onRecSearch} placeholder="銘柄名・酒蔵でさがす" style={{ width: '100%', background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 999, padding: '14px 24px', fontSize: 14.5, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24', display: 'block', marginBottom: 16 }} />
      <div style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, overflow: 'hidden' }}>
        {v.recResults.map((rb: any, i: number) => (
          <div key={i} onClick={rb.click} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '1px solid #F0EADC', cursor: 'pointer' }}>
            <div style={{ width: 40, height: 54, flexShrink: 0, borderRadius: 4, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }} />
            <div><div style={{ fontSize: 14.5, fontWeight: 700 }}>{rb.name}</div><div style={{ fontSize: 11.5, color: '#8B8273' }}>{rb.sub}</div></div>
            <div style={{ marginLeft: 'auto', fontSize: 13, color: '#32507C', fontWeight: 700 }}>選ぶ →</div>
          </div>
        ))}
      </div>
    </>
  );
}
