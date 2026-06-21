import clsx from 'clsx';
import type { Vals } from '@/useVals';

function Stat({ value, label, divider = false }: { value: string | number; label: string; divider?: boolean }) {
  return (
    <li className={clsx(divider && 'border-l border-line pl-8')}>
      <p className="m-0 font-serif text-[30px] font-bold">{value}</p>
      <p className="m-0 text-[12px] text-muted">{label}</p>
    </li>
  );
}

export function HeroIntro({ vals }: { vals: Vals }) {
  return (
    <header>
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted mb-3.5 m-0">MY SAKE JOURNAL</p>
      <h1
        className="font-serif font-bold leading-[1.45] tracking-[0.03em] mb-4 m-0"
        style={{ fontSize: vals.heroTitleSize }}
      >
        一杯ごとに、<br />記憶を醸す。
      </h1>
      <p className="text-[14px] leading-loose text-body max-w-105 m-0">
        飲んだ日本酒を、味わいの座標と言葉で残す。あなただけの利き酒帳が、次の一本を教えてくれる。
      </p>
      <ul className="flex gap-8 mt-6.5 m-0 p-0 list-none">
        <Stat value={vals.statCups} label="記録した盃" />
        <Stat value={vals.statBrands} label="出会った銘柄" divider />
        <Stat value={vals.statKura} label="出会った蔵" divider />
      </ul>
    </header>
  );
}
