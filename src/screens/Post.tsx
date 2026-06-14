/* eslint-disable @typescript-eslint/no-explicit-any */
export function Post({ v }: { v: any }) {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: v.pagePadTight }}>
      <div onClick={v.goFeed} style={{ fontSize: 13, color: '#8B8273', cursor: 'pointer', marginBottom: 22 }}>← みんなの利き酒帳にもどる</div>
      <div style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 16, padding: v.postCardPad }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: v.postCols, gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {v.post.hasPhoto && (<img src={v.post.photo} style={{ width: '100%', height: 340, borderRadius: 10, objectFit: 'cover', border: '1px solid #E3DBCB', display: 'block' }} alt="" />)}
            {v.post.noPhoto && (<div style={{ height: 340, borderRadius: 10, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E3DBCB' }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#8B8273', writingMode: 'vertical-rl' }}>ラベル・ボトル写真</span></div>)}
            <div onClick={v.post.brandClick} style={{ border: '1px solid #32507C', color: '#32507C', borderRadius: 999, padding: 11, textAlign: 'center', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>図鑑でこの銘柄を見る</div>
            <div onClick={v.post.recordClick} style={{ background: '#32507C', color: '#FDFBF5', borderRadius: 999, padding: 12, textAlign: 'center', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>わたしも記録する</div>
            {v.post.canPublish && (
              <div onClick={v.post.publishToggle} style={{ border: `1.5px solid ${v.post.isPublic ? '#BC6A2D' : '#E3DBCB'}`, background: v.post.isPublic ? '#FBF0E6' : '#FDFBF5', color: v.post.isPublic ? '#9A5A20' : '#5C5547', borderRadius: 999, padding: 11, textAlign: 'center', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{v.post.publishLabel}</div>
            )}
          </div>
          <div>
            <div onClick={v.post.brandClick} style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700, lineHeight: 1.4, cursor: 'pointer' }}>{v.post.brandName}</div>
            <div style={{ fontSize: 12.5, color: '#8B8273', marginTop: 4, marginBottom: 20 }}><span onClick={v.post.kuraClick} style={{ cursor: 'pointer', fontWeight: 700, color: '#32507C' }}>{v.post.brewery}</span> / {v.post.brandSubRest}</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>この一杯の座標 <span style={{ fontWeight: 400, color: '#8B8273', fontSize: 11.5 }}>{v.post.tasteLabel}</span></div>
            <div style={{ position: 'relative', width: '100%', height: 230, background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 8, marginBottom: 8 }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#EAE2D0' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#EAE2D0' }}></div>
              <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: '#8B8273', background: '#FDFBF5', padding: '0 6px' }}>香り高い</div>
              <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: '#8B8273', background: '#FDFBF5', padding: '0 6px' }}>穏やか</div>
              <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontWeight: 700, color: '#8B8273' }}>淡麗</div>
              <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontWeight: 700, color: '#8B8273' }}>濃醇</div>
              <div style={{ position: 'absolute', left: `${v.post.bx}%`, top: `${v.post.by}%`, transform: 'translate(-50%, -50%)', width: 10, height: 10, borderRadius: '50%', background: '#D9D0BC' }}></div>
              <div style={{ position: 'absolute', left: `${v.post.bx}%`, top: `${v.post.by}%`, transform: 'translate(9px, -5px)', fontSize: 10, color: '#A89D8A' }}>みんなの平均</div>
              <div style={{ position: 'absolute', left: `${v.post.x}%`, top: `${v.post.y}%`, transform: 'translate(-50%, -50%)', width: 30, height: 30, borderRadius: '50%', background: 'rgba(50,80,124,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#32507C' }}></div></div>
              <div style={{ position: 'absolute', left: `${v.post.x}%`, top: `${v.post.y}%`, transform: 'translate(19px, -8px)', fontSize: 11, fontWeight: 700, color: '#32507C' }}>この一杯</div>
            </div>
            <div style={{ margin: '18px 0 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, marginBottom: 6 }}><span>甘口</span><span style={{ color: '#8B8273', fontWeight: 400, fontSize: 11 }}>{v.post.sweetLabel}</span><span>辛口</span></div>
              <div style={{ height: 5, background: '#E3DBCB', borderRadius: 3, position: 'relative' }}>
                <div style={{ position: 'absolute', left: `${v.post.sweet}%`, top: '50%', transform: 'translate(-50%, -50%)', width: 16, height: 16, borderRadius: '50%', background: '#FDFBF5', border: '3px solid #32507C' }}></div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#E3DBCB', border: '1px solid #E3DBCB', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ background: '#FDFBF5', padding: '12px 16px' }}><div style={{ fontSize: 10.5, color: '#8B8273', marginBottom: 3 }}>飲み方</div><div style={{ fontSize: 14, fontWeight: 700 }}>{v.post.temps}</div></div>
              <div style={{ background: '#FDFBF5', padding: '12px 16px' }}><div style={{ fontSize: 10.5, color: '#8B8273', marginBottom: 3 }}>合わせた料理(肴)</div><div style={{ fontSize: 14, fontWeight: 700 }}>{v.post.pairing}</div></div>
            </div>
            <div style={{ background: '#F6F1E7', borderRadius: 10, padding: '20px 24px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.16em', color: '#8B8273', marginBottom: 8 }}>MEMO</div>
              <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15.5, lineHeight: 2.2, color: '#2E2A24' }}>{v.post.memo}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 26, paddingTop: 20, borderTop: '1px solid #F0EADC', flexWrap: 'wrap' }}>
          {v.post.canNomi && (
            <div onClick={v.post.nomiClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid #BC6A2D', borderRadius: 999, padding: '10px 24px', cursor: 'pointer', background: v.post.nomiBg, color: v.post.nomiColor, fontSize: 13.5, fontWeight: 700 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h16c0 6.2-3.5 9.8-7 10.7V18h4v2.5H7V18h4v-4.3C7.5 12.8 4 9.2 4 3z"></path></svg>
              のみたいね <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5 }}>{v.post.nomiCount}</span>
            </div>
          )}
          {v.post.cantNomi && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#BC6A2D', fontSize: 13.5, fontWeight: 700 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h16c0 6.2-3.5 9.8-7 10.7V18h4v2.5H7V18h4v-4.3C7.5 12.8 4 9.2 4 3z"></path></svg>
              のみたいね {v.post.nomiCount} <span style={{ fontWeight: 400, color: '#8B8273', fontSize: 12 }}>— みんなが飲みたがっています</span>
            </div>
          )}
        </div>
        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>コメント <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 400, color: '#8B8273' }}>{v.post.commentCount}件</span></div>
          {v.post.comments.map((cm: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid #F6F1E7' }}>
              <div style={{ width: 30, height: 30, flexShrink: 0, borderRadius: '50%', background: cm.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{cm.avatar}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 3 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700 }}>{cm.user}</span>
                  <span style={{ fontSize: 10.5, color: '#A89D8A' }}>{cm.time}</span>
                  {cm.canEdit && (
                    <span style={{ marginLeft: 'auto', display: 'flex', gap: 14 }}>
                      <span onClick={cm.editClick} style={{ fontSize: 11, color: '#32507C', cursor: 'pointer', fontWeight: 700 }}>編集</span>
                      <span onClick={cm.deleteClick} style={{ fontSize: 11, color: '#A89D8A', cursor: 'pointer', fontWeight: 700 }}>削除</span>
                    </span>
                  )}
                </div>
                {cm.notEditing && (
                  <div style={{ fontSize: 13, lineHeight: 1.9, color: '#5C5547', whiteSpace: 'pre-wrap' }}>{cm.text}</div>
                )}
                {cm.isEditing && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
                    <textarea value={v.editDraft} onChange={v.onEditDraft} onKeyDown={v.onEditKey} rows={2} style={{ flex: 1, minWidth: 180, background: '#FFFFFF', border: '1px solid #32507C', borderRadius: 12, padding: '9px 16px', fontSize: 13, lineHeight: 1.8, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24', resize: 'vertical' }}></textarea>
                    <div onClick={v.editSave} style={{ background: '#32507C', color: '#FDFBF5', borderRadius: 999, padding: '9px 20px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>保存</div>
                    <div onClick={v.editCancel} style={{ border: '1px solid #E3DBCB', color: '#5C5547', borderRadius: 999, padding: '9px 18px', fontSize: 12.5, cursor: 'pointer', background: '#FDFBF5' }}>キャンセル</div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: '50%', background: '#DDD3BE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{v.userAvatar}</div>
            <textarea value={v.commentDraft} onChange={v.onCommentDraft} onKeyDown={v.post.onCommentKey} rows={2} placeholder="コメントを書く — この一杯について語り合おう" style={{ flex: 1, minWidth: 0, background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 14, padding: '11px 18px', fontSize: 13.5, lineHeight: 1.8, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24', resize: 'vertical' }}></textarea>
            <div onClick={v.post.commentSend} style={{ background: '#32507C', color: '#FDFBF5', borderRadius: 999, padding: '11px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0, alignSelf: 'flex-end' }}>送る</div>
          </div>
          <div style={{ fontSize: 10.5, color: '#A89D8A', marginTop: 6, paddingLeft: 42 }}>Enterで改行 ・ ⌘/Ctrl+Enterで送信</div>
        </div>
      </div>
    </div>
  );
}
