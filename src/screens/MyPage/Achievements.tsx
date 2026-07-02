import type { MyPageVals } from './useMyPageVals';
// マイページ: 利き酒師ランク + 制覇状況 + 実績バッジ
export function Achievements({ my }: { my: MyPageVals }) {
  return (
    <>
      <section className="mb-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_380px]">
        <article className="rounded-2xl border border-line bg-card p-5.5 px-6">
          <header className="mb-3 flex items-baseline justify-between">
            <h2 className="m-0 font-serif text-[16px] font-bold">利き酒師ランク</h2>
            <span className="font-serif text-[20px] font-bold text-primary">{my.rankName}</span>
          </header>
          <div className="relative mb-2 h-2 rounded-sm bg-line-soft">
            <div className="absolute top-0 left-0 h-2 rounded-sm bg-accent" style={{ width: `${my.rankPct}%` }} />
          </div>
          <p className="m-0 text-[12px] text-muted">{my.rankNextLabel}</p>
        </article>
        <article className="rounded-2xl border border-line bg-surface p-5.5 px-6">
          <h2 className="m-0 mb-1 font-serif text-[16px] font-bold">制覇状況</h2>
          <dl className="m-0 mt-2.5 flex gap-6">
            <div>
              <dd className="m-0 font-serif text-[24px] font-bold text-accent">{my.badgePref}<span className="text-[13px] text-muted"> / 47</span></dd>
              <dt className="text-[11px] text-muted">都道府県</dt>
            </div>
            <div className="border-l border-line pl-6">
              <dd className="m-0 font-serif text-[24px] font-bold">{my.badgeKura}</dd>
              <dt className="text-[11px] text-muted">蔵数</dt>
            </div>
            <div className="border-l border-line pl-6">
              <dd className="m-0 font-serif text-[24px] font-bold">{my.achievedCount}<span className="text-[13px] text-muted"> / {my.badgeTotal}</span></dd>
              <dt className="text-[11px] text-muted">バッジ</dt>
            </div>
          </dl>
        </article>
      </section>
      <section>
        <h2 className="m-0 mb-4 border-b border-line pb-2.5 font-serif text-[18px] font-bold">実績バッジ</h2>
        <ul className="m-0 mb-9 flex flex-wrap gap-4 p-0 list-none">
          {my.badges.map((badge, i) => (
            <li key={i} className="w-23 text-center">
              <span className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full font-serif text-[26px] font-bold" style={{ background: badge.bg, color: badge.color }}>{badge.icon}</span>
              <p className="m-0 text-[11px] font-bold leading-snug" style={{ color: badge.labelColor }}>{badge.label}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
