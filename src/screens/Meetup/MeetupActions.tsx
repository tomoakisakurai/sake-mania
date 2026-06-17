type Props = {
  gcalUrl: string | null;
  isHost: boolean;
  onDelete: () => void;
};

export function MeetupActions({ gcalUrl, isHost, onDelete }: Props) {
  if (!gcalUrl && !isHost) return null;
  return (
    <div className="flex flex-wrap gap-2.5 mb-6">
      {gcalUrl && (
        <a
          href={gcalUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 border border-[#E3DBCB] hover:border-[#32507C] rounded-full px-4 py-2 text-[12.5px] font-bold text-[#2E2A24] no-underline bg-[#FDFBF5] shrink-0 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Googleカレンダーに追加
        </a>
      )}
      {isHost && (
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 border border-[#E3DBCB] hover:border-[#B0402A] hover:text-[#B0402A] rounded-full px-4 py-2 text-[12.5px] font-bold text-[#A89D8A] bg-[#FDFBF5] shrink-0 cursor-pointer transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          この会を削除
        </button>
      )}
    </div>
  );
}
