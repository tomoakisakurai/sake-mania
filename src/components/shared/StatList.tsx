import clsx from 'clsx';

// ホーム(HeroIntro)・マイページ・メンバー詳細で共用する統計ブロックの行。
// 2つ目以降のブロックに縦の区切り線、数値 30px serif、ラベル 12px muted。
export type StatItem = {
  value: string | number;
  label: string;
  accent?: boolean;
};

type Props = {
  stats: StatItem[];
  /** 上下の枠線 + 縦paddingをつける(マイページ・メンバー詳細の全幅行スタイル) */
  framed?: boolean;
  className?: string;
};

export function StatList({ stats, framed = false, className }: Props) {
  return (
    <ul className={clsx('m-0 flex flex-wrap gap-8 p-0 list-none', framed && 'border-t border-b border-line py-5', className)}>
      {stats.map((stat, i) => (
        <li key={i} className={clsx(i > 0 && 'border-l border-line pl-8')}>
          <p className={clsx('m-0 font-serif text-[30px] font-bold', stat.accent && 'text-accent')}>{stat.value}</p>
          <p className="m-0 text-[12px] text-muted">{stat.label}</p>
        </li>
      ))}
    </ul>
  );
}
