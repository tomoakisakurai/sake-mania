/* eslint-disable @typescript-eslint/no-explicit-any */
export function Map({ v }: { v: any }) {
  return (
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: v.pagePad }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginBottom: 4 }}>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700 }}>酒蔵マップ</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#8B8273' }}>{v.mapStats}</div>
        <div onClick={v.openKuraReg} style={{ marginLeft: 'auto', border: '1px solid #32507C', color: '#32507C', borderRadius: 999, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>＋ 蔵を登録する</div>
      </div>
      <div style={{ display: 'inline-flex', background: '#F3EDDF', borderRadius: 999, padding: 4, marginBottom: 20 }}>
        <div onClick={v.setMapKura} style={{ borderRadius: 999, padding: '8px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: v.kuraTabBg, color: v.kuraTabColor }}>酒蔵マップ</div>
        <div onClick={v.setMapBars} style={{ borderRadius: 999, padding: '8px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: v.barsTabBg, color: v.barsTabColor }}>飲める店</div>
      </div>
      {v.mapModeKura && (
        <>
          <div style={{ fontSize: 13, color: '#8B8273', marginBottom: 24 }}>色のついた県をタップすると、その県の蔵が見られます。呑んだ蔵のある県は朱に染まります。</div>
          <div style={{ display: 'grid', gridTemplateColumns: v.mapCols, gap: 24, alignItems: 'start' }}>
            <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: v.mapPanelPad }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: v.mapGap }}>
                {v.prefTiles.map((p: any, i: number) => (
                  <div key={i} onClick={p.click} style={{ gridColumn: p.col, gridRow: p.row, aspectRatio: 1, borderRadius: 6, background: p.bg, color: p.color, border: p.border, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, cursor: p.cursor }}>
                    <span style={{ fontSize: p.fs, fontWeight: 700, lineHeight: 1.1 }}>{p.name}</span>
                    {p.hasCount && (<span style={{ fontSize: p.fsSub, opacity: 0.85 }}>{p.countLabel}</span>)}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 18, marginTop: 18, fontSize: 11.5, color: '#5C5547', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: '#BC6A2D', display: 'inline-block' }}></span>呑んだ蔵がある県</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: '#32507C', display: 'inline-block' }}></span>図鑑に蔵がある県</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: '#F3EDDF', border: '1px solid #E3DBCB', display: 'inline-block' }}></span>これからの県</span>
              </div>
            </div>
            <div>
              {v.mapHasSel && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 19, fontWeight: 700, borderBottom: '1px solid #E3DBCB', paddingBottom: 10 }}>{v.mapSelPref}の蔵</div>
                  {v.mapKuras.map((k: any, i: number) => (
                    <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '20px 22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                        <div onClick={k.nameClick} style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>{k.name} →</div>
                        {k.hasCups && (<span style={{ background: '#BC6A2D', color: '#FDFBF5', borderRadius: 999, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>{k.cupsLabel}</span>)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                        <div style={{ fontSize: 11.5, color: '#8B8273' }}>{k.meta}</div>
                        <a href={k.gmapLink} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#32507C', fontWeight: 700, textDecoration: 'none' }}>Googleマップ →</a>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {k.brands.map((kb: any, i: number) => (
                          <span key={i} onClick={kb.click} style={{ cursor: 'pointer', background: '#F6F1E7', border: '1px solid #E3DBCB', borderRadius: 999, padding: '6px 14px', fontSize: 12, color: '#2E2A24', fontWeight: 500 }}>{kb.label} →</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {v.mapNoSel && (
                <>
                  <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: '22px 24px' }}>
                    <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>蔵のある県</div>
                    <div style={{ fontSize: 12.5, color: '#8B8273', lineHeight: 1.8, marginBottom: 14 }}>マップの色つきの県、または下の県名をタップ。</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {v.prefChipList.map((pc: any, i: number) => (
                        <span key={i} onClick={pc.click} style={{ cursor: 'pointer', background: pc.bg, color: '#FDFBF5', borderRadius: 999, padding: '7px 16px', fontSize: 12.5, fontWeight: 700 }}>{pc.label}</span>
                      ))}
                    </div>
                  </div>
                  <div onClick={v.openKuraReg} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '18px 22px', marginTop: 14, cursor: 'pointer' }}>
                    <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 14.5, fontWeight: 700, marginBottom: 4 }}>載っていない蔵がありますか?</div>
                    <div style={{ fontSize: 12, color: '#8B8273', lineHeight: 1.7 }}>あなたの好きな酒蔵を図鑑に追加申請できます <span style={{ color: '#32507C', fontWeight: 700 }}>→ 蔵を登録する</span></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
      {v.mapModeBars && (
        <>
          <div style={{ fontSize: 13, color: '#8B8273', marginBottom: 24 }}>銘酒を飲める居酒屋・角打ちを集めました。店をタップすると地図と提供銘柄が見られます。</div>
          <div style={{ display: 'grid', gridTemplateColumns: v.mapCols, gap: 24, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {v.barList.map((bar: any, i: number) => (
                <div key={i} onClick={bar.click} style={{ border: '1px solid #E3DBCB', borderRadius: 12, padding: '16px 18px', cursor: 'pointer', background: bar.bg, color: bar.color }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 16, fontWeight: 700 }}>{bar.name}</div>
                    <span style={{ fontSize: 10.5, border: '1px solid currentColor', borderRadius: 999, padding: '1px 9px', opacity: 0.75 }}>{bar.type}</span>
                  </div>
                  <div style={{ fontSize: 11.5, marginTop: 3, color: bar.subColor }}>{bar.area}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: '20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700 }}>{v.barView.name}</div>
                  <span style={{ fontSize: 11, color: '#8B8273' }}>{v.barView.type} ・ {v.barView.area}</span>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.9, color: '#5C5547', marginBottom: 14 }}>{v.barView.note}</div>
                <iframe src={v.barView.mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: '100%', height: 240, border: 0, borderRadius: 8, display: 'block', background: '#EFE8D8', marginBottom: 12 }}></iframe>
                <a href={v.barView.mapLink} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#32507C', fontWeight: 700, textDecoration: 'none' }}>Googleマップで開く →</a>
                <div style={{ fontSize: 12, fontWeight: 700, margin: '16px 0 8px', borderTop: '1px solid #E3DBCB', paddingTop: 14 }}>飲める銘柄</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {v.barView.brands.map((bb: any, i: number) => (
                    <span key={i} onClick={bb.click} style={{ cursor: 'pointer', background: '#F6F1E7', border: '1px solid #E3DBCB', borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 500 }}>{bb.label} →</span>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#A89D8A', lineHeight: 1.7 }}>※ 提供銘柄は時期により変わります。お出かけ前にお店へご確認ください。</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
