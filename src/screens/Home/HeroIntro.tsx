import type { HomeVals } from './useHomeVals';
import { StatList } from '@/components/shared/StatList';

export function HeroIntro({ home }: { home: HomeVals }) {
  return (
    <header>
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted mb-3.5 m-0">MY SAKE JOURNAL</p>
      <h1 className="font-serif font-bold leading-[1.45] tracking-[0.03em] mb-4 m-0 text-[30px] md:text-[38px]">
        一杯ごとに、<br />記憶を醸す。
      </h1>
      <p className="text-[14px] leading-loose text-body max-w-105 m-0">
        飲んだ日本酒を、味わいの座標と言葉で残す。あなただけの利き酒帳が、次の一本を教えてくれる。
      </p>
      <StatList
        className="mt-6.5"
        stats={[
          { value: home.statCups, label: '記録した盃' },
          { value: home.statBrands, label: '出会った銘柄' },
          { value: home.statKura, label: '出会った蔵' },
        ]}
      />
    </header>
  );
}
