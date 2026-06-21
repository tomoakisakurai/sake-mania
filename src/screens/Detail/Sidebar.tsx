import type { Vals } from '@/useVals';
import { Button } from '@/components/shared/Button';
// 銘柄詳細の左カラム: ボトル写真 + 記録/飲みたい + 「この銘柄を買う」導線
export function Sidebar({ vals }: { vals: Vals }) {
  return (
    <aside className="flex flex-col gap-4">
      {vals.dPhoto ? (
        <img src={vals.dPhoto} alt={vals.d.name} className="w-full rounded-xl border border-line object-cover" style={{ height: vals.bottleH }} />
      ) : (
        <figure className="m-0 flex items-center justify-center rounded-xl border border-line" style={{ height: vals.bottleH, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }}>
          <figcaption className="font-mono text-[11px] text-muted [writing-mode:vertical-rl]">ボトル写真</figcaption>
        </figure>
      )}
      <Button variant="primary" size="lg" onClick={vals.dRecordClick} fullWidth>＋ この銘柄を記録する</Button>
      <button
        type="button"
        onClick={vals.dWantClick}
        className={`cursor-pointer rounded-full border border-primary px-6 py-3.25 text-center text-[14px] font-bold ${vals.dWanted ? 'bg-primary text-surface' : 'bg-surface text-primary'}`}
      >{vals.dWantLabel}</button>
      <section className="rounded-xl border border-line bg-surface px-4.5 py-4">
        <h2 className="m-0 mb-1 font-serif text-[14px] font-bold">この銘柄を買う</h2>
        <p className="m-0 mb-3 text-[11px] text-muted">取扱店・通販で探す</p>
        <ul className="m-0 flex flex-col gap-2 p-0 list-none">
          {vals.dShop.map((shop, i) => (
            <li key={i}>
              <a href={shop.url} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-lg border border-line bg-card px-3 py-2.25 no-underline">
                <span className="inline-flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-[5px] text-[11px] font-extrabold text-card" style={{ background: shop.markColor }}>{shop.mark}</span>
                <span className="text-[12.5px] font-bold text-ink">{shop.label}</span>
                <span className="ml-auto text-[12px] text-faint">↗</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="m-0 mt-2.5 text-[10.5px] leading-[1.6] text-faint">外部サイトの検索結果が開きます。希少銘柄は正規特約店での購入がおすすめです。</p>
      </section>
    </aside>
  );
}
