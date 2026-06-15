import type { Vals } from '@/useVals';
import { Step1Brand } from './Step1Brand';
import { Step2Taste } from './Step2Taste';
import { Step3Pairing } from './Step3Pairing';
import { Step4Memo } from './Step4Memo';

export function Record({ v }: { v: Vals }) {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: v.pagePad }}>
      {/* progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
        {v.recSteps.map((st, i: number) => (
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

      {v.isRecStep1 && <Step1Brand v={v} />}
      {v.isRecStep2 && <Step2Taste v={v} />}
      {v.isRecStep3 && <Step3Pairing v={v} />}
      {v.isRecStep4 && <Step4Memo v={v} />}

      {/* footer buttons */}
      {v.recShowFooter && (
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <div onClick={v.recBack} style={{ flex: 1, textAlign: 'center', border: '1px solid #E3DBCB', borderRadius: 999, padding: 14, fontSize: 14, color: '#5C5547', background: '#FDFBF5', cursor: 'pointer' }}>もどる</div>
          <div onClick={v.recNext} style={{ flex: 2, textAlign: 'center', borderRadius: 999, padding: 14, fontSize: 14, fontWeight: 700, color: '#FDFBF5', background: v.recNextBg, cursor: v.recNextCursor }}>{v.recNextLabel}</div>
        </div>
      )}
    </div>
  );
}
