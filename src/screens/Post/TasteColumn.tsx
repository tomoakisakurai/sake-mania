import type { PostVM } from '@/types';
// 投稿詳細の右カラム: 銘柄名 + 味わい座標 + 甘辛 + 飲み方/肴 + メモ
export function TasteColumn({ post }: { post: PostVM }) {
  return (
    <section>
      <h2 onClick={post.brandClick} className="m-0 cursor-pointer font-serif text-[26px] font-bold leading-snug">{post.brandName}</h2>
      <p className="m-0 mt-1 mb-5 text-[12.5px] text-muted"><a onClick={post.kuraClick} className="cursor-pointer font-bold text-primary">{post.brewery}</a> / {post.brandSubRest}</p>
      <h3 className="m-0 mb-2.5 text-[13px] font-bold">この一杯の座標 <span className="text-[11.5px] font-normal text-muted">{post.tasteLabel}</span></h3>
      <figure className="relative m-0 mb-2 h-57.5 w-full rounded-lg border border-line bg-surface">
        <span className="absolute top-0 bottom-0 left-1/2 w-px bg-line-soft" />
        <span className="absolute top-1/2 right-0 left-0 h-px bg-line-soft" />
        <figcaption className="absolute top-2 left-1/2 -translate-x-1/2 bg-surface px-1.5 text-[10px] font-bold text-muted">香り高い</figcaption>
        <figcaption className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-surface px-1.5 text-[10px] font-bold text-muted">穏やか</figcaption>
        <figcaption className="absolute top-1/2 left-2.5 -translate-y-1/2 text-[10px] font-bold text-muted">淡麗</figcaption>
        <figcaption className="absolute top-1/2 right-2.5 -translate-y-1/2 text-[10px] font-bold text-muted">濃醇</figcaption>
        <span className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-line-strong" style={{ left: `${post.bx}%`, top: `${post.by}%` }} />
        <span className="absolute text-[10px] text-faint" style={{ left: `${post.bx}%`, top: `${post.by}%`, transform: 'translate(9px, -5px)' }}>みんなの平均</span>
        <span className="absolute flex h-7.5 w-7.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary/15" style={{ left: `${post.x}%`, top: `${post.y}%` }}>
          <span className="h-3.5 w-3.5 rounded-full bg-primary" />
        </span>
        <span className="absolute text-[11px] font-bold text-primary" style={{ left: `${post.x}%`, top: `${post.y}%`, transform: 'translate(19px, -8px)' }}>この一杯</span>
      </figure>
      <section className="mt-4.5 mb-5">
        <header className="mb-1.5 flex justify-between text-[11.5px] font-bold">
          <span>甘口</span>
          <span className="text-[11px] font-normal text-muted">{post.sweetLabel}</span>
          <span>辛口</span>
        </header>
        <div className="relative h-[5px] rounded-sm bg-line">
          <div className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-primary bg-surface" style={{ left: `${post.sweet}%` }} />
        </div>
      </section>
      <dl className="m-0 mb-5 grid gap-px overflow-hidden rounded-[10px] border border-line bg-line" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="bg-surface px-4 py-3">
          <dt className="text-[10.5px] text-muted">飲み方</dt>
          <dd className="m-0 mt-0.5 text-[14px] font-bold">{post.temps}</dd>
        </div>
        <div className="bg-surface px-4 py-3">
          <dt className="text-[10.5px] text-muted">合わせた料理(肴)</dt>
          <dd className="m-0 mt-0.5 text-[14px] font-bold">{post.pairing}</dd>
        </div>
      </dl>
      <blockquote className="m-0 rounded-[10px] bg-bg px-6 py-5">
        <p className="m-0 mb-2 font-mono text-[10px] tracking-[0.16em] text-muted">MEMO</p>
        <p className="m-0 font-serif text-[15.5px] leading-[2.2] text-ink">{post.memo}</p>
      </blockquote>
    </section>
  );
}
