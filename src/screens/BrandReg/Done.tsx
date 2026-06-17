type Props = {
  registeredName: string;
  registeredId: string;
  onAnother: () => void;
  onViewBrand: () => void;
};

export function Done({ registeredName, onAnother, onViewBrand }: Props) {
  return (
    <div className="text-center py-10">
      <div className="w-[72px] h-[72px] rounded-full bg-[#32507C] text-[#FDFBF5] inline-flex items-center justify-center mb-6">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div className="font-serif text-[26px] font-bold mb-3">図鑑に登録しました</div>
      <div className="text-[14px] leading-loose text-[#5C5547] max-w-sm mx-auto mb-2">
        「{registeredName}」を図鑑に追加しました。これから記録・検索・SAKE MEETUPでの持ち寄り宣言に使えます。
      </div>
      <div className="text-[12.5px] text-[#8B8273] mb-8">スペックや写真はあとから詳細ページで補えます。</div>
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={onAnother}
          className="border border-[#E3DBCB] rounded-full px-6 py-3 text-[13.5px] font-bold text-[#5C5547] bg-[#FDFBF5] cursor-pointer"
        >
          続けて登録する
        </button>
        <button
          onClick={onViewBrand}
          className="bg-[#32507C] text-[#FDFBF5] rounded-full px-6 py-3 text-[13.5px] font-bold cursor-pointer"
        >
          登録した銘柄を見る
        </button>
      </div>
    </div>
  );
}
