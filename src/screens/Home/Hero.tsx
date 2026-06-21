import type { Vals } from '@/useVals';
import { HeroIntro } from './HeroIntro';
import { TodayPick } from './TodayPick';

// ホーム上部: コピー+統計 と 今日の一本カード
export function Hero({ vals }: { vals: Vals }) {
  return (
    <section
      className="grid gap-8 mb-9"
      style={{ gridTemplateColumns: vals.heroCols }}
    >
      <HeroIntro vals={vals} />
      <TodayPick vals={vals} />
    </section>
  );
}
