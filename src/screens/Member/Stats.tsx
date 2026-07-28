import { StatList } from '@/components/shared/StatList';

type Props = {
  recCount: number;
  bringCount: number;
  mvpCount: number;
};

export function Stats({ recCount, bringCount, mvpCount }: Props) {
  return (
    <StatList
      framed
      className="mb-8"
      stats={[
        { value: recCount, label: '記録した盃' },
        { value: bringCount, label: 'MEETUPで持参' },
        { value: mvpCount, label: 'MVP獲得', accent: true },
      ]}
    />
  );
}
