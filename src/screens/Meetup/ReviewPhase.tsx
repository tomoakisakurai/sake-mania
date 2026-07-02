import type { MeetupVals } from './useMeetupVals';
import { AttendedMembers } from './AttendedMembers';
import { LineupCard } from './LineupCard';
// 投票受付中 / 結果確定フェーズ: 投票バナー + MVPカード + 参加メンバー + 得票ランキング
export function ReviewPhase({ meetup }: { meetup: MeetupVals }) {
  return (
    <>
      {meetup.isVoting && (
        <>
          <aside className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-accent-tint-strong bg-accent-tint px-4.5 py-3.5">
            <span className="rounded-full bg-accent px-3 py-0.5 text-[11px] font-bold text-surface">MVP投票受付中</span>
            <span className="text-[12.5px] text-accent-dark">今日の一本に1人1票。締切 {meetup.voteDeadline}。締切後にMVPが確定します。</span>
          </aside>
          {meetup.hostCanClose && (
            <button type="button" onClick={meetup.closeVoting} className="mb-5 inline-flex cursor-pointer items-center rounded-full border-[1.5px] border-body bg-card px-5.5 py-2.25 text-[12.5px] font-bold text-body">幹事メニュー:投票を締め切ってMVPを確定する</button>
          )}
        </>
      )}
      <section className="mb-7 rounded-2xl px-7 py-6 text-surface" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}>
        <p className="m-0 mb-2.5 font-mono text-[10px] tracking-[0.18em] opacity-70">{meetup.mvpLabel}</p>
        <h2 onClick={meetup.mvp.brandClick} className="m-0 cursor-pointer font-serif text-[24px] font-bold">{meetup.mvp.brandName}</h2>
        <p className="m-0 mt-1 text-[12.5px] opacity-85">{meetup.mvp.brandSub} ・ {meetup.mvp.broughtBy}さんが持参 ・ {meetup.mvp.votesLabel}</p>
        <p className="m-0 mt-3 text-[13px] leading-[1.9] opacity-95">「{meetup.mvp.comment}」</p>
      </section>
      <AttendedMembers />
      <header className="mb-4.5 flex items-baseline justify-between border-b border-line pb-2.5">
        <h2 className="m-0 font-serif text-[18px] font-bold">得票ランキング</h2>
        <span className="font-mono text-[11px] text-muted">{meetup.attendees}名参加 ・ 計{meetup.totalVotesLabel}</span>
      </header>
      {meetup.isClosed && (
        <p className="m-0 mb-3.5 text-[11.5px] text-faint">この会の投票は締め切られ、MVPは確定しています。</p>
      )}
      <ul className="m-0 flex flex-col gap-3.5 p-0 list-none">
        {meetup.lineup.map((lineup, i) => (
          <li key={i}>
            <LineupCard lineup={lineup} />
          </li>
        ))}
      </ul>
    </>
  );
}
