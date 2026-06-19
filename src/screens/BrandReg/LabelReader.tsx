'use client';
import { useRef } from 'react';
import type { ChangeEvent } from 'react';

type Props = {
  photo: string;
  reading: boolean;
  readDone: boolean;
  onPick: (dataUrl: string) => void;
  onRead: () => void;
  onRemove: () => void;
};

export function LabelReader({ photo, reading, readDone, onPick, onRead, onRemove }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    const reader = new FileReader();
    reader.onload = () => onPick(reader.result as string);
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const readButtonLabel = reading
    ? 'AIが読み取り中…'
    : readDone
      ? 'もう一度読み取る'
      : '✦ AIでラベルを読み取る';

  return (
    <div className="bg-[#FBF8F1] border border-[#E3DBCB] rounded-2xl p-[18px] mb-7">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-[10px] tracking-[0.14em] text-[#BC6A2D]">AI LABEL READER</span>
        <span className="text-[12.5px] font-bold">ラベル写真から自動入力</span>
      </div>

      {!photo && (
        <div
          onClick={openFilePicker}
          className="border-2 border-dashed border-[#D9D0BC] rounded-xl p-7 text-center bg-[#FDFBF5] cursor-pointer hover:border-[#32507C] transition-colors"
        >
          <div className="text-[13.5px] font-bold text-[#5C5547] mb-1">ラベル・ボトルの写真を追加</div>
          <div className="text-[11.5px] text-[#A89D8A]">写真を選ぶと、AIが銘柄名やスペックを読み取ってフォームに入力します</div>
        </div>
      )}

      {photo && (
        <>
          <div className="flex gap-4 items-center">
            <img
              src={photo}
              alt="ラベルプレビュー"
              className="w-[88px] h-[116px] flex-shrink-0 object-cover rounded-lg border border-[#E3DBCB]"
            />
            <div className="flex-1 min-w-0">
              <button
                onClick={onRead}
                disabled={reading}
                className="inline-flex items-center gap-2.5 bg-[#32507C] hover:bg-[#263d5f] text-[#FDFBF5] rounded-full px-[22px] py-2.5 text-[13.5px] font-bold cursor-pointer transition-colors disabled:cursor-not-allowed"
              >
                {reading && (
                  <span className="w-3.5 h-3.5 border-2 border-[rgba(253,251,245,0.4)] border-t-[#FDFBF5] rounded-full inline-block animate-spin" />
                )}
                {readButtonLabel}
              </button>
              <div className="flex gap-3.5 mt-2.5">
                <span onClick={openFilePicker} className="text-[12px] text-[#32507C] font-bold cursor-pointer">写真を変更</span>
                <span onClick={onRemove} className="text-[12px] text-[#A89D8A] cursor-pointer hover:text-[#B0402A] transition-colors">削除</span>
              </div>
              {readDone && (
                <div className="text-[11.5px] text-[#5A7D64] font-bold mt-2.5">✓ 読み取り完了。内容を確認・修正してください。</div>
              )}
            </div>
          </div>
          <div className="text-[10.5px] text-[#A89D8A] mt-3 leading-relaxed">
            ※ AIによる読み取りは参考です。実際のラベルと照合し、必要に応じて修正してください。
          </div>
        </>
      )}
    </div>
  );
}
