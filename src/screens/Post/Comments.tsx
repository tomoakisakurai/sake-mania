import type { Vals } from '@/useVals';
// 投稿詳細フッタ: のみたいね + コメント一覧 + 投稿フォーム
export function Comments({ v }: { v: Vals }) {
  return (
    <>
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
        {v.post.comments.map((cm: { avatar: string; avatarBg: string; user: string; time: string; canEdit: boolean; notEditing: boolean; isEditing: boolean; text: string; editClick: () => void; deleteClick: () => void }, i: number) => (
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
    </>
  );
}
