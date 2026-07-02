'use client';
import { useRecordVals } from './useRecordVals';
import { Button } from '@/components/shared/Button';
import { Step1Brand } from './Step1Brand';
import { Step2Taste } from './Step2Taste';
import { Step3Pairing } from './Step3Pairing';
import { Step4Memo } from './Step4Memo';

export function Record() {
  const recVals = useRecordVals();
  return (
    <main className="mx-auto max-w-170 px-4.5 pt-7 pb-32.5 md:px-10 md:pt-10 md:pb-20">
      <nav className="mb-2.5 flex items-center gap-3.5">
        {recVals.recSteps.map((step, i) => (
          <span key={i} className="flex items-center gap-1.75">
            <span className="flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold" style={{ background: step.bg, color: step.color, border: step.border }}>{step.n}</span>
            <span className="text-[12px]" style={{ color: step.labelColor, fontWeight: step.weight }}>{step.label}</span>
          </span>
        ))}
        <a onClick={recVals.goHome} className="ml-auto cursor-pointer text-[13px] text-faint">✕ やめる</a>
      </nav>
      <div className="relative mb-8 h-[3px] rounded-sm bg-line">
        <div className="absolute top-0 left-0 h-[3px] rounded-sm bg-primary transition-[width] duration-300 ease-in-out" style={{ width: `${recVals.recProgress}%` }} />
      </div>

      <h1 className="m-0 mb-1 font-serif text-[24px] font-bold">{recVals.recTitle}</h1>
      <p className="m-0 mb-6.5 text-[13px] text-muted">{recVals.recSub}</p>

      {recVals.isRecStep1 && <Step1Brand recVals={recVals} />}
      {recVals.isRecStep2 && <Step2Taste recVals={recVals} />}
      {recVals.isRecStep3 && <Step3Pairing recVals={recVals} />}
      {recVals.isRecStep4 && <Step4Memo recVals={recVals} />}

      {recVals.recShowFooter && (
        <footer className="mt-8 flex gap-3">
          <Button variant="outline" size="lg" onClick={recVals.recBack} className="flex-1">もどる</Button>
          <Button variant="primary" size="lg" onClick={recVals.recNext} disabled={recVals.recNextDisabled} className="flex-2">{recVals.recNextLabel}</Button>
        </footer>
      )}
    </main>
  );
}
