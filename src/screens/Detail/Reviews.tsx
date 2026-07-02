import type { DetailVals } from './useDetailVals';
// この銘柄の利き酒帳(レビュー一覧)
export function Reviews({ reviews }: { reviews: DetailVals['reviews'] }) {
  return (
    <section className="max-w-140">
      <h2 className="m-0 mb-1 border-b border-line pb-2.5 font-serif text-[18px] font-bold">この銘柄の利き酒帳</h2>
      <ul className="m-0 p-0 list-none">
        {reviews.map((review, i) => (
          <li key={i} className="border-b border-line-soft px-1 py-4 last:border-b-0">
            <header className="mb-2 flex items-center gap-2.5">
              <span className="text-[13px] font-bold">{review.user}</span>
              <span className="text-[11px] text-faint">{review.date}</span>
              <span className="ml-auto text-[13px] tracking-[2px] text-accent">{review.stars}</span>
            </header>
            <p className="m-0 text-[13px] leading-[1.9] text-body">{review.memo}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
