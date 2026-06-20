type Props = {
  recCount: number;
  bringCount: number;
  mvpCount: number;
};

function StatBlock({ value, label, accent = false }: { value: number; label: string; accent?: boolean }) {
  return (
    <div>
      <div className={`font-serif text-[28px] font-bold ${accent ? 'text-accent' : ''}`}>{value}</div>
      <div className="text-[11.5px] text-muted">{label}</div>
    </div>
  );
}

export function Stats({ recCount, bringCount, mvpCount }: Props) {
  return (
    <div className="flex gap-8 mb-8 py-5 border-t border-b border-line flex-wrap">
      <StatBlock value={recCount} label="記録した盃" />
      <StatBlock value={bringCount} label="MEETUPで持参" />
      <StatBlock value={mvpCount} label="MVP獲得" accent />
    </div>
  );
}
