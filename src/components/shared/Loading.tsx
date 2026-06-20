type Props = {
  label?: string;
  className?: string;
};

export function Loading({ label = '読み込み中...', className = '' }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 gap-3 ${className}`}>
      <span className="w-8 h-8 border-[3px] border-line border-t-primary rounded-full inline-block animate-spin" />
      <span className="text-[12px] text-muted">{label}</span>
    </div>
  );
}
