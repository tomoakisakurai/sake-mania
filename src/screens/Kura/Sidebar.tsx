import type { KuraVals } from './useKuraVals';
import { LocationMap } from './LocationMap';
import { TasteTrend } from './TasteTrend';
import { MyCups } from './MyCups';

// 酒蔵詳細の右カラム: 蔵の場所(地図) + 味わい傾向(座標) + わたしの盃
export function Sidebar({ ku }: { ku: KuraVals }) {
  return (
    <aside className="flex flex-col gap-6">
      <LocationMap ku={ku} />
      <TasteTrend ku={ku} />
      {ku.hasCups && <MyCups ku={ku} />}
    </aside>
  );
}
