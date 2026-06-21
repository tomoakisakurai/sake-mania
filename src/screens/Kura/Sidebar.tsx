import type { Vals } from '@/useVals';
import { LocationMap } from './LocationMap';
import { TasteTrend } from './TasteTrend';
import { MyCups } from './MyCups';

// 酒蔵詳細の右カラム: 蔵の場所(地図) + 味わい傾向(座標) + わたしの盃
export function Sidebar({ vals }: { vals: Vals }) {
  return (
    <aside className="flex flex-col gap-6">
      <LocationMap vals={vals} />
      <TasteTrend vals={vals} />
      {vals.ku.hasCups && <MyCups vals={vals} />}
    </aside>
  );
}
