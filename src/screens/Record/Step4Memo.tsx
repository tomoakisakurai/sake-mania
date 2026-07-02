import clsx from 'clsx';
import type { RecordVals } from './useRecordVals';
import { Textarea } from '@/components/shared/Textarea';
// 記録ステップ4: メモ + まとめ + 公開トグル
export function Step4Memo({ recVals }: { recVals: RecordVals }) {
  return (
    <>
      <Textarea
        value={recVals.recMemo}
        onChange={recVals.onMemo}
        placeholder="香り、含み、余韻。未来の自分が読み返したくなる一言を。"
        rows={6}
        className="mb-6"
      />
      <section className="rounded-xl border border-line bg-surface px-6 py-5">
        <h2 className="m-0 mb-3 font-mono text-[10px] tracking-[0.16em] text-muted">この一杯のまとめ</h2>
        <dl className="m-0 flex flex-col gap-2 text-[13.5px]">
          <div className="flex gap-3"><dt className="m-0 w-16 text-muted">銘柄</dt><dd className="m-0 font-serif font-bold">{recVals.recBrandName}</dd></div>
          <div className="flex gap-3"><dt className="m-0 w-16 text-muted">評価</dt><dd className="m-0 tracking-[2px] text-accent">{recVals.recStarsStr}</dd></div>
          <div className="flex gap-3"><dt className="m-0 w-16 text-muted">味わい</dt><dd className="m-0">{recVals.recTasteLabel} / {recVals.recSweetLabel}</dd></div>
          <div className="flex gap-3"><dt className="m-0 w-16 text-muted">楽しみ方</dt><dd className="m-0">{recVals.recEnjoyLabel}</dd></div>
        </dl>
      </section>
      <button
        type="button"
        onClick={recVals.toggleRecPublic}
        className={clsx(
          'mt-4 flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4.5 py-3.5',
          recVals.recPublic ? 'border-accent-tint-strong bg-accent-tint' : 'border-line bg-card',
        )}
      >
        <span className={clsx(
          'relative h-6 w-[42px] shrink-0 rounded-full transition-colors duration-200',
          recVals.recPublic ? 'bg-accent' : 'bg-line-strong',
        )}>
          <span className={clsx(
            'absolute top-0.5 h-5 w-5 rounded-full bg-surface transition-[left] duration-200',
            recVals.recPublic ? 'left-5' : 'left-0.5',
          )} />
        </span>
        <hgroup className="min-w-0 text-left">
          <h3 className="m-0 text-[13.5px] font-bold">みんなの利き酒帳に公開する</h3>
          <p className="m-0 mt-0.5 text-[11.5px] text-muted">{recVals.recPublic ? '部員みんなのフィードに表示されます' : '非公開（自分のマイページのみ）'}</p>
        </hgroup>
      </button>
    </>
  );
}
