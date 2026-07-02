import type { HomeVals } from './useHomeVals';
import { HeroIntro } from './HeroIntro';
import { TodayPick } from './TodayPick';

// ホーム上部: コピー+統計 と 今日の一本カード
export function Hero({ home }: { home: HomeVals }) {
  return (
    <section
      className="grid gap-8 mb-9"
      
    >
      <HeroIntro home={home} />
      <TodayPick home={home} />
    </section>
  );
}
