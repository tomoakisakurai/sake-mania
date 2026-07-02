import clsx from 'clsx';

type Props = {
  name: string;
  col: number | string;
  row: number | string;
  count: number;
  selected: boolean;
  onClick?: () => void;
};

// 都道府県マップの1タイル分。出身メンバー数を表示し、選択中は朱に染まる。
export function HometownTile({ name, col, row, count, selected, onClick }: Props) {
  const hasMembers = count > 0;
  return (
    <li
      onClick={hasMembers ? onClick : undefined}
      className={clsx(
        'flex aspect-square flex-col items-center justify-center gap-px rounded-md',
        hasMembers ? (selected ? 'bg-accent' : 'bg-primary') : 'bg-line-soft',
        hasMembers ? 'text-surface' : 'text-faint',
        hasMembers ? 'cursor-pointer' : 'cursor-default',
      )}
      style={{ gridColumn: col, gridRow: row }}
    >
      {/* 3文字以上(神奈川・和歌山など)はタイルからはみ出すため縮小 */}
      <span
        className={clsx(
          'whitespace-nowrap font-bold leading-none',
          name.length >= 3 ? 'text-[6.5px] md:text-[8.5px]' : 'text-[8.5px] md:text-[11px]',
        )}
      >{name}</span>
      {hasMembers && (<span className="text-[7px] opacity-85 md:text-[9px]">{count}人</span>)}
    </li>
  );
}
