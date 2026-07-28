import clsx from 'clsx';

type Props = {
  recCount: number;
  bringCount: number;
  mvpCount: number;
};

// ホーム(HeroIntro)の統計と同じデザイン: 区切り線 + 30px serif 数値 + 12px ラベル
function StatBlock({ value, label, accent = false, divider = false }: { value: number; label: string; accent?: boolean; divider?: boolean }) {
  return (
    <li className={clsx(divider && 'border-l border-line pl-8')}>
      <p className={clsx('m-0 font-serif text-[30px] font-bold', accent && 'text-accent')}>{value}</p>
      <p className="m-0 text-[12px] text-muted">{label}</p>
    </li>
  );
}

export function Stats({ recCount, bringCount, mvpCount }: Props) {
  return (
    <ul className="m-0 mb-8 flex flex-wrap gap-8 border-t border-b border-line px-0 py-5 list-none">
      <StatBlock value={recCount} label="記録した盃" />
      <StatBlock value={bringCount} label="MEETUPで持参" divider />
      <StatBlock value={mvpCount} label="MVP獲得" accent divider />
    </ul>
  );
}
