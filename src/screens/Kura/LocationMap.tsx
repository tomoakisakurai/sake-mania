import type { KuraVals } from './useKuraVals';

export function LocationMap({ ku }: { ku: KuraVals }) {
  return (
    <section className="rounded-xl border border-line bg-surface px-5.5 py-5">
      <header className="mb-3 flex items-baseline justify-between">
        <h2 className="m-0 font-serif text-[15px] font-bold">蔵の場所</h2>
        <a href={ku.mapLink} target="_blank" rel="noreferrer" className="text-[11.5px] font-bold text-primary no-underline">Googleマップで開く →</a>
      </header>
      <iframe
        src={ku.mapSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-65 w-full rounded-lg border-0 bg-[#EFE8D8]"
      />
    </section>
  );
}
