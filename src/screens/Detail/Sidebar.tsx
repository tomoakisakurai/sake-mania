/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Vals } from '@/useVals';
// 銘柄詳細の左カラム: ボトル写真 + 記録/飲みたい + 「この銘柄を買う」導線
export function Sidebar({ v }: { v: Vals }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ height: v.bottleH, borderRadius: 12, background: "repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E3DBCB" }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#8B8273", writingMode: "vertical-rl" }}>ボトル写真</span></div>
      <div onClick={v.dRecordClick} style={{ background: "#32507C", color: "#FDFBF5", borderRadius: 999, padding: 14, textAlign: "center", fontSize: 14.5, fontWeight: 700, cursor: "pointer" }}>＋ この銘柄を記録する</div>
      <div onClick={v.dWantClick} style={{ background: v.dWantBg, color: v.dWantColor, border: "1px solid #32507C", borderRadius: 999, padding: 13, textAlign: "center", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{v.dWantLabel}</div>
      <div style={{ background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>この銘柄を買う</div>
        <div style={{ fontSize: 11, color: "#8B8273", marginBottom: 12 }}>取扱店・通販で探す</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {v.dShop.map((sh: any, i: number) => (
            <a key={i} href={sh.url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #E3DBCB", borderRadius: 8, padding: "9px 12px", textDecoration: "none", background: "#FFFFFF" }}>
              <span style={{ width: 22, height: 22, flexShrink: 0, borderRadius: 5, background: sh.markColor, color: "#FFFFFF", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>{sh.mark}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#2E2A24" }}>{sh.label}</span>
              <span style={{ marginLeft: "auto", color: "#A89D8A", fontSize: 12 }}>↗</span>
            </a>
          ))}
        </div>
        <div style={{ fontSize: 10.5, color: "#A89D8A", marginTop: 10, lineHeight: 1.6 }}>外部サイトの検索結果が開きます。希少銘柄は正規特約店での購入がおすすめです。</div>
      </div>
    </div>
  );
}
