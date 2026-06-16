import { useState, useMemo } from 'react';

const DOW = ['日', '月', '火', '水', '木', '金', '土'];
const HOURS = ['18:00', '18:30', '19:00', '19:30', '20:00'];

type Props = {
  value: string;
  hour: string;
  onChange: (iso: string) => void;
  onHourChange: (hour: string) => void;
};

export function DateTimePicker({ value, hour, onChange, onHourChange }: Props) {
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  const calTitle = calYear + '年 ' + (calMonth + 1) + '月';

  const prevMonth = () => {
    let m = calMonth - 1, y = calYear;
    if (m < 0) { m = 11; y--; }
    setCalMonth(m); setCalYear(y);
  };
  const nextMonth = () => {
    let m = calMonth + 1, y = calYear;
    if (m > 11) { m = 0; y++; }
    setCalMonth(m); setCalYear(y);
  };

  const calDays = useMemo(() => {
    const y = calYear, m = calMonth;
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const cells: Array<{ label: string; iso: string; past: boolean; selected: boolean; isSun: boolean; isSat: boolean }> = [];
    for (let i = 0; i < first; i++) cells.push({ label: '', iso: '', past: false, selected: false, isSun: false, isSat: false });
    for (let d = 1; d <= days; d++) {
      const dt = new Date(y, m, d);
      const iso = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      cells.push({ label: String(d), iso, past: dt < today, selected: value === iso, isSun: dt.getDay() === 0, isSat: dt.getDay() === 6 });
    }
    return cells;
  }, [calYear, calMonth, value]);

  const selectedDateLabel = (() => {
    if (!value) return '';
    const p = value.split('-');
    const dt = new Date(+p[0], +p[1] - 1, +p[2]);
    return +p[1] + '月' + +p[2] + '日(' + DOW[dt.getDay()] + ') ' + hour + '〜';
  })();

  return (
    <div className="bg-[#FDFBF5] border border-[#E3DBCB] rounded-xl p-[18px_20px] mb-[18px]">
      {/* 月ナビゲーション */}
      <div className="flex items-center justify-between mb-[14px]">
        <button
          type="button"
          onClick={prevMonth}
          className="w-8 h-8 rounded-full bg-white border border-[#E3DBCB] flex items-center justify-center text-base text-[#5C5547] cursor-pointer hover:border-[#32507C]"
        >←</button>
        <div className="font-[Shippori_Mincho,serif] text-[15px] font-bold">{calTitle}</div>
        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 rounded-full bg-white border border-[#E3DBCB] flex items-center justify-center text-base text-[#5C5547] cursor-pointer hover:border-[#32507C]"
        >→</button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 mb-[6px]">
        {DOW.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[10.5px] font-bold py-1 ${i === 0 ? 'text-[#BC6A2D]' : i === 6 ? 'text-[#32507C]' : 'text-[#8B8273]'}`}
          >{d}</div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 gap-1">
        {calDays.map((cd, i) => (
          <div
            key={i}
            onClick={cd.past || !cd.label ? undefined : () => onChange(cd.iso)}
            className={[
              'text-center py-2 rounded-lg text-[13px]',
              !cd.label || cd.past ? 'cursor-default' : 'cursor-pointer hover:bg-[#F0EADC]',
              cd.selected ? 'bg-[#32507C] font-bold' : 'bg-transparent font-medium',
              !cd.label ? 'text-transparent' :
                cd.selected ? 'text-[#FDFBF5]' :
                cd.past ? 'text-[#D0C9BA]' :
                cd.isSun ? 'text-[#BC6A2D]' :
                cd.isSat ? 'text-[#32507C]' : 'text-[#2E2A24]',
            ].join(' ')}
          >{cd.label}</div>
        ))}
      </div>

      {/* 選択済み：日付ラベル＋時間チップ */}
      {value && (
        <div className="mt-[14px] pt-3 border-t border-[#E3DBCB] flex items-center gap-[14px] flex-wrap">
          <div className="text-[13px] text-[#5C5547]">
            選択中: <span className="font-bold text-[#2E2A24]">{selectedDateLabel}</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="text-xs text-[#8B8273]">開始</div>
            {HOURS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => onHourChange(h)}
                className={`min-w-[44px] text-center px-[10px] py-[7px] rounded-lg text-[13px] font-bold cursor-pointer border hover:border-[#32507C] ${
                  hour === h
                    ? 'bg-[#32507C] text-[#FDFBF5] border-[#32507C]'
                    : 'bg-white text-[#2E2A24] border-[#E3DBCB]'
                }`}
              >{h}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
