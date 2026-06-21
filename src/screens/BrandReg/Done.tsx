import { Button } from '@/components/shared/Button';

type Props = {
  registeredName: string;
  registeredId: string;
  onAnother: () => void;
  onViewBrand: () => void;
};

export function Done({ registeredName, onAnother, onViewBrand }: Props) {
  return (
    <div className="text-center py-10">
      <div className="w-18 h-18 rounded-full bg-primary text-surface inline-flex items-center justify-center mb-6">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div className="font-serif text-[26px] font-bold mb-3">図鑑に登録しました</div>
      <div className="text-[14px] leading-loose text-body max-w-sm mx-auto mb-2">
        「{registeredName}」を図鑑に追加しました。これから記録・検索・SAKE MEETUPでの持ち寄り宣言に使えます。
      </div>
      <div className="text-[12.5px] text-muted mb-8">スペックや写真はあとから詳細ページで補えます。</div>
      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="outline" onClick={onAnother}>続けて登録する</Button>
        <Button onClick={onViewBrand}>登録した銘柄を見る</Button>
      </div>
    </div>
  );
}
