// 酒蔵登録: 申請完了画面
export function Done({ registeredName, onAnother, onBackToMap }: { registeredName: string; onAnother: () => void; onBackToMap: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0 20px' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#32507C', color: '#FDFBF5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700, marginBottom: 12 }}>申請ありがとうございます</div>
      <div style={{ fontSize: 14, lineHeight: 2, color: '#5C5547', maxWidth: 400, margin: '0 auto 8px' }}>「{registeredName}」の掲載リクエストを受け付けました。編集部が内容を確認のうえ、図鑑に追加します。</div>
      <div style={{ fontSize: 12.5, color: '#8B8273', marginBottom: 32 }}>通常3〜5日ほどお時間をいただきます。</div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <div onClick={onAnother} style={{ border: '1px solid #E3DBCB', borderRadius: 999, padding: '12px 26px', fontSize: 13.5, fontWeight: 700, color: '#5C5547', cursor: 'pointer', background: '#FDFBF5' }}>続けて登録する</div>
        <div onClick={onBackToMap} style={{ background: '#32507C', color: '#FDFBF5', borderRadius: 999, padding: '12px 26px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>酒蔵マップへ</div>
      </div>
    </div>
  );
}
