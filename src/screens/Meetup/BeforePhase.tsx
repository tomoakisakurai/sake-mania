import type { Vals } from '@/useVals';
import { Button } from '@/components/shared/Button';
import { GoingButton } from './GoingButton';
import { BringCard } from './BringCard';
// 開催前フェーズ: 出欠トグル + 持ち寄りラインナップ + あなたの一本 + 幹事メニュー
export function BeforePhase({ vals }: { vals: Vals }) {
  const meetup = vals.meetup;
  return (
    <>
      <section className="mb-7 flex flex-wrap items-center gap-4">
        <GoingButton meetupId={meetup.id} iGoing={meetup.iGo} goingCount={meetup.goCount} />
        <ul className="m-0 flex p-0 list-none">
          {meetup.goingAvatars.map((avatar, i) => (
            <li key={i} className="-ml-2 flex h-7.5 w-7.5 items-center justify-center rounded-full border-2 border-line text-[11px] font-bold first:ml-0" style={{ background: avatar.bg }}>{avatar.avatar}</li>
          ))}
        </ul>
      </section>

      <div className="grid items-start gap-7" style={{ gridTemplateColumns: vals.meetCols }}>
        <section>
          <header className="mb-4 flex items-baseline justify-between border-b border-line pb-2.5">
            <h2 className="m-0 font-serif text-[18px] font-bold">持ち寄りラインナップ</h2>
            <span className="font-mono text-[11px] text-muted">{meetup.bringCount}本 宣言済み</span>
          </header>
          {meetup.hasDup && (
            <aside className="mb-4 flex items-center gap-2 rounded-[10px] border border-accent-tint-strong bg-accent-tint px-4 py-3 text-[12.5px] text-accent-dark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg>
              銘柄がかぶっています。誰かが変えると、当日の種類が増えてもっと楽しめます。
            </aside>
          )}
          <ul className="m-0 flex flex-col gap-3 p-0 list-none">
            {meetup.bringList.map((bring, i) => (
              <li key={i}>
                <BringCard bring={bring} />
              </li>
            ))}
          </ul>
        </section>
        <aside className="flex flex-col gap-4">
          <section className="rounded-xl border border-line bg-surface px-5.5 py-5">
            <h2 className="m-0 mb-1.5 font-serif text-[15px] font-bold">あなたの一本</h2>
            {meetup.myDeclared && (
              <>
                <p className="m-0 mb-3 text-[12.5px] leading-[1.8] text-body">持ち寄りを宣言済みです。当日をお楽しみに。</p>
                <Button variant="primary" size="md" onClick={meetup.declareClick} fullWidth className="mb-2">{meetup.declareLabel}</Button>
                <a onClick={meetup.cancelDeclare} className="block cursor-pointer text-center text-[12px] text-faint">宣言を取り消す</a>
              </>
            )}
            {meetup.notMyDeclared && (
              <>
                <p className="m-0 mb-3 text-[12.5px] leading-[1.8] text-body">何を持っていくか宣言しましょう。先に宣言された銘柄は「かぶり」で分かるので、自然と種類が散らばります。</p>
                <Button variant="accent" size="md" onClick={meetup.declareClick} fullWidth>{meetup.declareLabel}</Button>
              </>
            )}
          </section>
        </aside>
      </div>
      {meetup.hostCanStart && (
        <Button variant="accent-outline" size="md" onClick={meetup.startVoting} className="mt-5.5">幹事メニュー:会を終えてMVP投票を開始する</Button>
      )}
    </>
  );
}
