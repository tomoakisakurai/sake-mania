/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useRef } from 'react';

export function Record({ v }: { v: any }) {
  const photoRef = useRef<HTMLInputElement>(null);
  const onPhotoClick = () => photoRef.current?.click();

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: v.pagePad }}>
      {/* progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
        {v.recSteps.map((st: any, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: st.bg, color: st.color, border: st.border }}>{st.n}</div>
            <span style={{ fontSize: 12, color: st.labelColor, fontWeight: st.weight }}>{st.label}</span>
          </div>
        ))}
        <div onClick={v.goHome} style={{ marginLeft: 'auto', fontSize: 13, color: '#A89D8A', cursor: 'pointer' }}>✕ やめる</div>
      </div>
      <div style={{ height: 3, background: '#E3DBCB', borderRadius: 2, position: 'relative', marginBottom: 32 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: 3, width: `${v.recProgress}%`, background: '#32507C', borderRadius: 2, transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{v.recTitle}</div>
      <div style={{ fontSize: 13, color: '#8B8273', marginBottom: 26 }}>{v.recSub}</div>

      {/* step 1: 銘柄 */}
      {v.isRecStep1 && (
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
      )}

      {/* step 2: 味わい */}
      {v.isRecStep2 && (
        <>
          <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <div style={{ width: 40, height: 54, flexShrink: 0, borderRadius: 4, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }} />
            <div><div style={{ fontSize: 14.5, fontWeight: 700 }}>{v.recBrandName}</div><div style={{ fontSize: 11.5, color: '#8B8273' }}>{v.recBrandSub}</div></div>
            <div onClick={v.recChangeBrand} style={{ marginLeft: 'auto', fontSize: 12, color: '#32507C', fontWeight: 700, cursor: 'pointer' }}>変更</div>
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>この一杯はどの座標? <span style={{ fontWeight: 400, color: '#8B8273', fontSize: 12 }}>マップをタップして打点</span></div>
          <div onClick={v.onMapTap} style={{ position: 'relative', width: '100%', height: 320, background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 8, cursor: 'crosshair', marginBottom: 8 }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#EAE2D0' }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#EAE2D0' }} />
            <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', fontSize: 10.5, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '0 6px' }}>香り高い</div>
            <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', fontSize: 10.5, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '0 6px' }}>穏やか</div>
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 10.5, fontWeight: 700, color: '#8B8273' }}>淡麗</div>
            <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 10.5, fontWeight: 700, color: '#8B8273' }}>濃醇</div>
            {v.recGhostDots.map((g: any, i: number) => (
              <div key={i} style={{ position: 'absolute', left: `${g.left}%`, top: `${g.top}%`, transform: 'translate(-50%, -50%)', width: 8, height: 8, borderRadius: '50%', background: '#D9D0BC' }} />
            ))}
            {v.recHasPoint && (
              <>
                <div style={{ position: 'absolute', left: `${v.recX}%`, top: `${v.recY}%`, transform: 'translate(-50%, -50%)', width: 38, height: 38, borderRadius: '50%', background: 'rgba(50,80,124,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <div style={{ width: 17, height: 17, borderRadius: '50%', background: '#32507C', boxShadow: '0 1px 6px rgba(50,80,124,0.5)' }} />
                </div>
                <div style={{ position: 'absolute', left: `${v.recX}%`, top: `${v.recY}%`, transform: 'translate(24px, -10px)', fontSize: 11.5, fontWeight: 700, color: '#32507C', pointerEvents: 'none' }}>この一杯</div>
              </>
            )}
          </div>
          <div style={{ fontSize: 11, color: '#A89D8A', marginBottom: 24 }}>薄い点はあなたの過去の盃。打点すると味わいの言葉に自動変換されます — <b style={{ color: '#5C5547' }}>{v.recTasteLabel}</b></div>
          <div style={{ marginBottom: 26 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}><span>甘口</span><span style={{ color: '#8B8273', fontWeight: 400, fontSize: 11 }}>甘辛 — {v.recSweetLabel}</span><span>辛口</span></div>
            <input type="range" min={0} max={100} value={v.recSweet} onChange={v.onSweet} style={{ width: '100%', accentColor: '#32507C', cursor: 'pointer' }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>総合評価</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {v.recStars.map((sr: any, i: number) => (
                <span key={i} onClick={sr.click} style={{ fontSize: 30, cursor: 'pointer', color: sr.color, lineHeight: 1 }}>★</span>
              ))}
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: '#8B8273', marginLeft: 8 }}>{v.recRatingLabel}</span>
            </div>
          </div>
        </>
      )}

      {/* step 3: 合わせ */}
      {v.isRecStep3 && (
        <>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>飲み方 <span style={{ fontWeight: 400, color: '#8B8273', fontSize: 12 }}>複数OK</span></div>
            <div style={{ display: 'flex', gap: 8 }}>
              {v.tempChips.map((tc: any, i: number) => (
                <span key={i} onClick={tc.click} style={{ cursor: 'pointer', borderRadius: 999, padding: '9px 22px', fontSize: 13, background: tc.bg, color: tc.color, border: tc.border }}>{tc.label}</span>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>合わせた料理(肴)</div>
            <input type="text" value={v.recPairing} onChange={v.onPairing} placeholder="例: 白子ポン酢、鯖の塩焼き" style={{ width: '100%', background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 10, padding: '13px 18px', fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24' }} />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>写真</div>
            <input type="file" accept="image/*" ref={photoRef} onChange={v.onPhoto} style={{ display: 'none' }} />
            {v.recHasPhoto && (
              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid #E3DBCB' }}>
                <img src={v.recPhoto} alt="" style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', right: 12, bottom: 12, display: 'flex', gap: 8 }}>
                  <div onClick={onPhotoClick} style={{ background: 'rgba(46,42,36,0.78)', color: '#F6F1E7', borderRadius: 999, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>差し替え</div>
                  <div onClick={v.onPhotoRemove} style={{ background: 'rgba(46,42,36,0.78)', color: '#F6F1E7', borderRadius: 999, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>削除</div>
                </div>
              </div>
            )}
            {v.recNoPhoto && (
              <div onClick={onPhotoClick} style={{ border: '2px dashed #D9D0BC', borderRadius: 12, padding: 36, textAlign: 'center', background: '#FDFBF5', cursor: 'pointer' }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#5C5547', marginBottom: 4 }}>ラベル・ボトルの写真を追加</div>
                <div style={{ fontSize: 11.5, color: '#A89D8A' }}>タップして撮影 / 画像をアップロード</div>
              </div>
            )}
          </div>
        </>
      )}

      {/* step 4: メモ */}
      {v.isRecStep4 && (
        <>
          <textarea value={v.recMemo} onChange={v.onMemo} placeholder="香り、含み、余韻。未来の自分が読み返したくなる一言を。" style={{ width: '100%', height: 140, background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '16px 20px', fontSize: 14, lineHeight: 1.9, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24', resize: 'vertical', marginBottom: 24 }} />
          <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.16em', color: '#8B8273', marginBottom: 12 }}>この一杯のまとめ</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5 }}>
              <div style={{ display: 'flex', gap: 12 }}><span style={{ color: '#8B8273', width: 64 }}>銘柄</span><b style={{ fontFamily: "'Shippori Mincho', serif" }}>{v.recBrandName}</b></div>
              <div style={{ display: 'flex', gap: 12 }}><span style={{ color: '#8B8273', width: 64 }}>評価</span><span style={{ color: '#BC6A2D', letterSpacing: '2px' }}>{v.recStarsStr}</span></div>
              <div style={{ display: 'flex', gap: 12 }}><span style={{ color: '#8B8273', width: 64 }}>味わい</span><span>{v.recTasteLabel} / {v.recSweetLabel}</span></div>
              <div style={{ display: 'flex', gap: 12 }}><span style={{ color: '#8B8273', width: 64 }}>楽しみ方</span><span>{v.recEnjoyLabel}</span></div>
            </div>
          </div>
          <div onClick={v.toggleRecPublic} style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, background: v.recPublic ? '#FBF0E6' : '#FFFFFF', border: `1px solid ${v.recPublic ? '#E8C9A8' : '#E3DBCB'}`, borderRadius: 12, padding: '14px 18px', cursor: 'pointer' }}>
            <div style={{ width: 42, height: 24, borderRadius: 999, background: v.recPublic ? '#BC6A2D' : '#D9D0BC', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
              <div style={{ position: 'absolute', top: 2, left: v.recPublic ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: '#FDFBF5', transition: 'left 0.2s' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>みんなの利き酒帳に公開する</div>
              <div style={{ fontSize: 11.5, color: '#8B8273', marginTop: 2 }}>{v.recPublic ? '部員みんなのフィードに表示されます' : '非公開（自分のマイページのみ）'}</div>
            </div>
          </div>
        </>
      )}

      {/* footer buttons */}
      {v.recShowFooter && (
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <div onClick={v.recBack} style={{ flex: 1, textAlign: 'center', border: '1px solid #E3DBCB', borderRadius: 999, padding: 14, fontSize: 14, color: '#5C5547', background: '#FDFBF5', cursor: 'pointer' }}>もどる</div>
          <div onClick={v.recNext} style={{ flex: 2, textAlign: 'center', borderRadius: 999, padding: 14, fontSize: 14, fontWeight: 700, color: '#FDFBF5', background: v.recNextBg, cursor: v.recNextCursor }}>{v.recNextLabel}</div>
        </div>
      )}
      <Fragment />
    </div>
  );
}
