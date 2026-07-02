import type { HomeVals } from './useHomeVals';

export function TodayPick({ home }: { home: HomeVals }) {
  return (
    <article
      onClick={home.todayClick}
      className="bg-surface border border-line rounded-xl p-6 flex gap-5 cursor-pointer"
    >
      <span className="w-25 h-42.5 flex-shrink-0 rounded-md bg-[repeating-linear-gradient(45deg,_var(--color-line-soft),_var(--color-line-soft)_8px,_var(--color-line-strong)_8px,_var(--color-line-strong)_16px)] flex items-center justify-center">
        <span className="font-mono text-[10px] text-muted [writing-mode:vertical-rl]">ボトル写真</span>
      </span>
      <section className="flex flex-col gap-2">
        <p className="font-mono text-[10px] tracking-[0.16em] text-accent m-0">今日の一本 — 未踏領域へ</p>
        <h2 className="font-serif text-[21px] font-bold leading-[1.5] m-0">{home.today.name}</h2>
        <p className="text-[12px] text-muted m-0">{home.today.sub}</p>
        <p className="text-[13px] leading-relaxed text-body m-0">
          あなたのマップの空白「中庸×やや香り」に位置する一本。酸のキレは新政系と通じます。
        </p>
        <p className="mt-auto text-[13px] font-bold text-primary m-0">図鑑で見る →</p>
      </section>
    </article>
  );
}
