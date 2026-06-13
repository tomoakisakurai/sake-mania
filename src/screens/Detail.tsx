/* eslint-disable @typescript-eslint/no-explicit-any */
export function Detail({ v }: { v: any }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: v.pagePadTight }}>
      <div onClick={v.goZukan} style={{ fontSize: 13, color: "#8B8273", cursor: "pointer", marginBottom: 24 }}>← 図鑑にもどる</div>
      <div style={{ display: "grid", gridTemplateColumns: v.detailCols, gap: 40 }}>
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
        <div>
          <div style={{ fontSize: 12, color: "#8B8273", marginBottom: 6 }}><span onClick={v.dBreweryClick} style={{ cursor: "pointer", fontWeight: 700, color: "#32507C" }}>{v.d.brewery}</span> / {v.d.pref}</div>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 34, fontWeight: 700, lineHeight: 1.4, marginBottom: 10 }}>{v.d.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <span style={{ color: "#BC6A2D", fontSize: 16, letterSpacing: 2 }}>{v.dStars}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#5C5547" }}>{v.d.rating} ・ {v.d.count}記録</span>
            <span style={{ background: "#F0EADC", borderRadius: 999, padding: "4px 14px", fontSize: 12, color: "#5C5547" }}>{v.d.class}</span>
          </div>
          <div style={{ fontSize: 14, lineHeight: 2.1, color: "#5C5547", maxWidth: 560, marginBottom: 26 }}>{v.d.desc}</div>
          <div style={{ display: "grid", gridTemplateColumns: v.specCols, gap: 1, background: "#E3DBCB", border: "1px solid #E3DBCB", borderRadius: 10, overflow: "hidden", maxWidth: 560, marginBottom: 28 }}>
            <div style={{ background: "#FDFBF5", padding: "14px 18px" }}><div style={{ fontSize: 10.5, color: "#8B8273", marginBottom: 3 }}>精米歩合</div><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 17, fontWeight: 700 }}>{v.d.polish}</div></div>
            <div style={{ background: "#FDFBF5", padding: "14px 18px" }}><div style={{ fontSize: 10.5, color: "#8B8273", marginBottom: 3 }}>酒米</div><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 17, fontWeight: 700 }}>{v.d.rice}</div></div>
            <div style={{ background: "#FDFBF5", padding: "14px 18px" }}><div style={{ fontSize: 10.5, color: "#8B8273", marginBottom: 3 }}>酵母</div><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 17, fontWeight: 700 }}>{v.d.yeast}</div></div>
            <div style={{ background: "#FDFBF5", padding: "14px 18px" }}><div style={{ fontSize: 10.5, color: "#8B8273", marginBottom: 3 }}>日本酒度</div><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 17, fontWeight: 700 }}>{v.d.smv}</div></div>
            <div style={{ background: "#FDFBF5", padding: "14px 18px" }}><div style={{ fontSize: 10.5, color: "#8B8273", marginBottom: 3 }}>アルコール</div><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 17, fontWeight: 700 }}>{v.d.abv}</div></div>
            <div style={{ background: "#FDFBF5", padding: "14px 18px" }}><div style={{ fontSize: 10.5, color: "#8B8273", marginBottom: 3 }}>おすすめ温度</div><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 17, fontWeight: 700 }}>{v.d.temp}</div></div>
          </div>
          {/* mini map */}
          <div style={{ maxWidth: 560, background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 12, padding: "20px 24px", marginBottom: 28 }}>
            <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>味わいの座標</div>
            <div style={{ position: "relative", width: "100%", height: 220, background: "#FFFFFF", border: "1px solid #E3DBCB", borderRadius: 8 }}>
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "#EAE2D0" }}></div>
              <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "#EAE2D0" }}></div>
              <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontWeight: 700, color: "#8B8273", background: "#FFFFFF", padding: "0 6px" }}>香り高い</div>
              <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontWeight: 700, color: "#8B8273", background: "#FFFFFF", padding: "0 6px" }}>穏やか</div>
              <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, fontWeight: 700, color: "#8B8273" }}>淡麗</div>
              <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, fontWeight: 700, color: "#8B8273" }}>濃醇</div>
              <div style={{ position: "absolute", left: `${v.d.x}%`, top: `${v.d.y}%`, transform: "translate(-50%, -50%)", width: 14, height: 14, borderRadius: "50%", background: "#32507C" }}></div>
              <div style={{ position: "absolute", left: `${v.d.x}%`, top: `${v.d.y}%`, transform: "translate(11px, -7px)", fontSize: 11, fontWeight: 700, color: "#32507C" }}>みんなの平均</div>
              {v.dHasMyPoint && (
                <>
                  <div style={{ position: "absolute", left: `${v.dMyX}%`, top: `${v.dMyY}%`, transform: "translate(-50%, -50%)", width: 14, height: 14, borderRadius: "50%", background: "#BC6A2D" }}></div>
                  <div style={{ position: "absolute", left: `${v.dMyX}%`, top: `${v.dMyY}%`, transform: "translate(11px, -7px)", fontSize: 11, fontWeight: 700, color: "#BC6A2D" }}>あなたの打点</div>
                </>
              )}
            </div>
          </div>
          {/* reviews */}
          <div style={{ maxWidth: 560 }}>
            <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700, borderBottom: "1px solid #E3DBCB", paddingBottom: 10, marginBottom: 4 }}>この銘柄の利き酒帳</div>
            {v.dReviews.map((rv: any, i: number) => (
              <div key={i} style={{ padding: "16px 4px", borderBottom: "1px solid #F0EADC" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{rv.user}</div>
                  <div style={{ fontSize: 11, color: "#A89D8A" }}>{rv.date}</div>
                  <div style={{ marginLeft: "auto", color: "#BC6A2D", fontSize: 13, letterSpacing: 2 }}>{rv.stars}</div>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.9, color: "#5C5547" }}>{rv.memo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
