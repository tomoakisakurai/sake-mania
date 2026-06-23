import clsx from 'clsx';

type Props = {
  name: string;
  col: number | string;
  row: number | string;
  count: number;
  selected: boolean;
  isMobile: boolean;
  onClick?: () => void;
};

// 都道府県マップの1タイル分。出身メンバー数を表示し、選択中は朱に染まる。
export function HometownTile({ name, col, row, count, selected, isMobile, onClick }: Props) {
  const hasMembers = count > 0;
  // 3文字以上(神奈川・和歌山・鹿児島など)はタイルからはみ出して改行されるため、
  // 4文字以上と同じ縮小サイズを当てる。
  const nameSize = name.length >= 3 ? (isMobile ? '6.5px' : '8.5px') : (isMobile ? '8.5px' : '11px');
  const countSize = isMobile ? '7px' : '9px';
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
      <span className="whitespace-nowrap font-bold leading-none" style={{ fontSize: nameSize }}>{name}</span>
      {hasMembers && (<span className="opacity-85" style={{ fontSize: countSize }}>{count}人</span>)}
    </li>
  );
}
