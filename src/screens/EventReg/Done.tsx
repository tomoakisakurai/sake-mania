import { Button } from '@/components/shared/Button';

type Props = {
  registeredName: string;
  onAnother: () => void;
  onBackToEvents: () => void;
};

export function Done({ registeredName, onAnother, onBackToEvents }: Props) {
  return (
    <div className="text-center py-10">
      <div className="w-[72px] h-[72px] rounded-full bg-[#32507C] text-[#FDFBF5] inline-flex items-center justify-center mb-6">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div className="font-serif text-[26px] font-bold mb-3">イベントを登録しました</div>
      <div className="text-[14px] leading-loose text-[#5C5547] max-w-sm mx-auto mb-2">
        「{registeredName}」をイベント情報フィードに掲載しました。部のメンバーに共有されます。
      </div>
      <div className="flex gap-3 justify-center flex-wrap mt-8">
        <Button variant="outline" onClick={onAnother}>続けて登録する</Button>
        <Button onClick={onBackToEvents}>イベント情報へ</Button>
      </div>
    </div>
  );
}
