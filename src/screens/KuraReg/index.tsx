/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Vals } from '@/useVals';
import { Done } from './Done';

export function KuraReg({ v }: { v: Vals }) {
  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: v.pagePadTight }}>
      {v.kuraReg.notDone && (
        <>
          <div onClick={v.kuraReg.backToMap} style={{ fontSize: 13, color: '#8B8273', cursor: 'pointer', marginBottom: 24 }}>← 酒蔵マップにもどる</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.18em', color: '#8B8273', marginBottom: 10 }}>REGISTER A BREWERY</div>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>酒蔵を登録する</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.9, color: '#5C5547', marginBottom: 28 }}>図鑑にまだ載っていない酒蔵を申請できます。蔵元の方も、ファンの方からの掲載リクエストも歓迎です。内容は編集部が確認のうえ掲載します。</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>蔵名 <span style={{ color: '#BC6A2D' }}>必須</span></div>
              <input type="text" value={v.kuraReg.krName} onChange={v.kuraReg.onName} placeholder="例: 〇〇酒造" style={{ width: '100%', background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24' }} />
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>都道府県 <span style={{ color: '#BC6A2D' }}>必須</span></div>
              <input type="text" value={v.kuraReg.krPref} onChange={v.kuraReg.onPref} placeholder="例: 新潟" style={{ width: '100%', background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24' }} />
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>市区町村</div>
              <input type="text" value={v.kuraReg.krCity} onChange={v.kuraReg.onCity} placeholder="例: 長岡市" style={{ width: '100%', background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24' }} />
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>創業年</div>
              <input type="text" value={v.kuraReg.krFounded} onChange={v.kuraReg.onFounded} placeholder="例: 1830" style={{ width: '100%', background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24' }} />
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>代表銘柄</div>
              <input type="text" value={v.kuraReg.krBrands} onChange={v.kuraReg.onBrands} placeholder="例: 〇〇、△△" style={{ width: '100%', background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24' }} />
            </div>
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>蔵の紹介</div>
          <textarea value={v.kuraReg.krDesc} onChange={v.kuraReg.onDesc} rows={4} placeholder="蔵の歴史や酒造りの特徴など" style={{ width: '100%', background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 10, padding: '12px 16px', fontSize: 14, lineHeight: 1.8, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24', resize: 'vertical', marginBottom: 24 }}></textarea>

          <div style={{ background: '#FDFBF5', border: '1px dashed #D9D0BC', borderRadius: 12, padding: 24, textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#5C5547', marginBottom: 4 }}>蔵の写真を追加(任意)</div>
            <div style={{ fontSize: 11.5, color: '#A89D8A' }}>外観・仕込み蔵・ロゴなど</div>
          </div>
          <div onClick={v.kuraReg.submit} style={{ background: '#32507C', color: '#FDFBF5', borderRadius: 999, padding: 15, textAlign: 'center', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>掲載を申請する</div>
          <div style={{ textAlign: 'center', fontSize: 11, color: '#A89D8A', marginTop: 12 }}>プロトタイプのため、申請内容は保存されません</div>
        </>
      )}
      {v.kuraReg.done && <Done v={v} />}
    </div>
  );
}
