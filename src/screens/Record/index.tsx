import type { Vals } from '@/useVals';
import { Button } from '@/components/shared/Button';
import { Step1Brand } from './Step1Brand';
import { Step2Taste } from './Step2Taste';
import { Step3Pairing } from './Step3Pairing';
import { Step4Memo } from './Step4Memo';

export function Record({ vals }: { vals: Vals }) {
  return (
    <main className="mx-auto max-w-170" style={{ padding: vals.pagePad }}>
      <nav className="mb-2.5 flex items-center gap-3.5">
        {vals.recSteps.map((step, i) => (
          <span key={i} className="flex items-center gap-1.75">
            <span className="flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold" style={{ background: step.bg, color: step.color, border: step.border }}>{step.n}</span>
            <span className="text-[12px]" style={{ color: step.labelColor, fontWeight: step.weight }}>{step.label}</span>
          </span>
        ))}
        <a onClick={vals.goHome} className="ml-auto cursor-pointer text-[13px] text-faint">✕ やめる</a>
      </nav>
      <div className="relative mb-8 h-[3px] rounded-sm bg-line">
        <div className="absolute top-0 left-0 h-[3px] rounded-sm bg-primary transition-[width] duration-300 ease-in-out" style={{ width: `${vals.recProgress}%` }} />
      </div>

      <h1 className="m-0 mb-1 font-serif text-[24px] font-bold">{vals.recTitle}</h1>
      <p className="m-0 mb-6.5 text-[13px] text-muted">{vals.recSub}</p>

      {vals.isRecStep1 && <Step1Brand vals={vals} />}
      {vals.isRecStep2 && <Step2Taste vals={vals} />}
      {vals.isRecStep3 && <Step3Pairing vals={vals} />}
      {vals.isRecStep4 && <Step4Memo vals={vals} />}

      {vals.recShowFooter && (
        <footer className="mt-8 flex gap-3">
          <Button variant="outline" size="lg" onClick={vals.recBack} className="flex-1">もどる</Button>
          <Button variant="primary" size="lg" onClick={vals.recNext} disabled={vals.recNextDisabled} className="flex-2">{vals.recNextLabel}</Button>
        </footer>
      )}
    </main>
  );
}
