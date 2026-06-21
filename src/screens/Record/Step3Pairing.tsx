import type { Vals } from '@/useVals';
import { useRef } from 'react';
import { Input } from '@/components/shared/Input';

// 記録ステップ3: 飲み方 + 合わせた料理 + 写真
export function Step3Pairing({ vals }: { vals: Vals }) {
  const photoRef = useRef<HTMLInputElement>(null);
  const onPhotoClick = () => photoRef.current?.click();
  return (
    <>
      <section className="mb-6">
        <h2 className="m-0 mb-2.5 text-[13.5px] font-bold">飲み方 <span className="text-[12px] font-normal text-muted">複数OK</span></h2>
        <ul className="m-0 flex gap-2 p-0 list-none">
          {vals.tempChips.map((chip, i) => (
            <li key={i} onClick={chip.click} className="cursor-pointer rounded-full px-5.5 py-2.25 text-[13px]" style={{ background: chip.bg, color: chip.color, border: chip.border }}>{chip.label}</li>
          ))}
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="m-0 mb-2.5 text-[13.5px] font-bold">合わせた料理(肴)</h2>
        <Input
          value={vals.recPairing}
          onChange={vals.onPairing}
          placeholder="例: 白子ポン酢、鯖の塩焼き"
        />
      </section>
      <section>
        <h2 className="m-0 mb-2.5 text-[13.5px] font-bold">写真</h2>
        <input type="file" accept="image/*" ref={photoRef} onChange={vals.onPhoto} className="hidden" />
        {vals.recHasPhoto && (
          <figure className="relative m-0 overflow-hidden rounded-xl border border-line">
            <img src={vals.recPhoto} alt="" className="block h-65 w-full object-cover" />
            <figcaption className="absolute right-3 bottom-3 flex gap-2">
              <button type="button" onClick={onPhotoClick} className="cursor-pointer rounded-full bg-ink/80 px-4 py-2 text-[12px] font-bold text-bg">差し替え</button>
              <button type="button" onClick={vals.onPhotoRemove} className="cursor-pointer rounded-full bg-ink/80 px-4 py-2 text-[12px] font-bold text-bg">削除</button>
            </figcaption>
          </figure>
        )}
        {vals.recNoPhoto && (
          <button type="button" onClick={onPhotoClick} className="w-full cursor-pointer rounded-xl border-2 border-dashed border-line-strong bg-surface p-9 text-center">
            <p className="m-0 mb-1 text-[13.5px] font-bold text-body">ラベル・ボトルの写真を追加</p>
            <p className="m-0 text-[11.5px] text-faint">タップして撮影 / 画像をアップロード</p>
          </button>
        )}
      </section>
    </>
  );
}
