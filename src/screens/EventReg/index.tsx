'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { createEvent, updateEvent, getEventDetail } from '@/app/actions/events';
import { Input } from '@/components/shared/Input';
import { Textarea } from '@/components/shared/Textarea';
import { Button } from '@/components/shared/Button';
import { paths } from '@/lib/routes';
import { DateTimePicker } from '@/screens/MeetupCreate/DateTimePicker';
import { Done } from './Done';

const EVENT_HOURS = ['11:00', '12:00', '13:00', '14:00', '17:00', '18:00', '19:00'];
const DOW = ['日', '月', '火', '水', '木', '金', '土'];

function buildDateLabel(eventDate: string, hour: string): string {
  const [y, m, d] = eventDate.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return `${m}月${d}日(${DOW[dt.getDay()]}) ${hour}〜`;
}

function parseHourFromLabel(dateLabel: string): string {
  const match = dateLabel.match(/(\d{1,2}):(\d{2})/);
  return match ? `${match[1].padStart(2, '0')}:${match[2]}` : '13:00';
}

export function EventReg({ editingId }: { editingId?: string }) {
  const store = useStore();
  const router = useRouter();
  const isMobile = useStore((s) => s.vw < 768);
  const pagePadding = isMobile ? '20px 18px 130px' : '32px 40px 80px';
  const isEdit = !!editingId;

  const [name, setName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [hour, setHour] = useState('13:00');
  const [place, setPlace] = useState('');
  const [fee, setFee] = useState('');
  const [officialUrl, setOfficialUrl] = useState('');
  const [description, setDescription] = useState('');
  const [registeredName, setRegisteredName] = useState('');
  const [done, setDone] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);

  useEffect(() => {
    if (!editingId) return;
    let active = true;
    getEventDetail(editingId).then((event) => {
      if (!active || !event) return;
      setName(event.name);
      setEventDate(event.eventDate ?? '');
      setHour(parseHourFromLabel(event.dateLabel));
      setPlace(event.place);
      setFee(event.fee);
      setOfficialUrl(event.officialUrl);
      setDescription(event.description);
      setLoaded(true);
    });
    return () => { active = false; };
  }, [editingId]);

  const handleSubmit = async () => {
    if (!name.trim()) { store.flash('イベント名は必須です'); return; }
    if (!eventDate) { store.flash('開催日は必須です'); return; }
    if (!place.trim()) { store.flash('会場は必須です'); return; }
    const dateLabel = buildDateLabel(eventDate, hour);
    const payload = {
      name: name.trim(),
      dateLabel,
      eventDate,
      place: place.trim(),
      fee: fee.trim(),
      officialUrl: officialUrl.trim(),
      description: description.trim(),
    };
    if (isEdit && editingId) {
      const ok = await updateEvent(editingId, payload);
      if (!ok) { store.flash('更新に失敗しました'); return; }
      store.flash('イベントを更新しました');
      router.push(paths.event(editingId));
    } else {
      const id = await createEvent(payload);
      if (!id) { store.flash('登録に失敗しました（ログインが必要です）'); return; }
      setRegisteredName(name.trim());
      setDone(true);
    }
  };

  const handleAnother = () => {
    setName(''); setEventDate(''); setHour('13:00'); setPlace('');
    setFee(''); setOfficialUrl(''); setDescription('');
    setDone(false);
  };

  const handleBackToEvents = () => {
    store.nav('events');
  };

  if (!loaded) {
    return <div style={{ maxWidth: 620, margin: '0 auto', padding: pagePadding }} />;
  }

  if (done) {
    return (
      <div style={{ maxWidth: 620, margin: '0 auto', padding: pagePadding }}>
        <Done registeredName={registeredName} onAnother={handleAnother} onBackToEvents={handleBackToEvents} />
      </div>
    );
  }

  const backHref = isEdit && editingId ? paths.event(editingId) : null;
  const backLabel = isEdit ? '← イベント詳細にもどる' : '← イベント情報にもどる';
  const handleBack = () => {
    if (backHref) router.push(backHref);
    else store.nav('events');
  };

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: pagePadding }}>
      <div onClick={handleBack} className="text-[13px] text-muted cursor-pointer mb-6 hover:text-primary transition-colors">{backLabel}</div>
      <div className="font-mono text-[11px] tracking-[0.18em] text-accent mb-2.5">{isEdit ? 'EDIT EVENT' : 'REGISTER AN EVENT'}</div>
      <div className="font-serif text-[28px] font-bold mb-2">{isEdit ? 'イベントを編集する' : 'イベントを登録する'}</div>
      <div className="text-[13.5px] leading-relaxed text-body mb-7">
        {isEdit
          ? 'イベント情報を更新します。変更内容はすぐにフィードに反映されます。'
          : '行きたい・知ってほしい日本酒イベントを部のみんなに共有しましょう。登録すると、すぐにイベント情報フィードに掲載されます。'}
      </div>

      <div className="text-[12.5px] font-bold mb-1.5">イベント名 <span className="text-accent">必須</span></div>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="例: 全国日本酒フェア 2026"
        className="mb-4"
      />

      <div className="text-[12.5px] font-bold mb-2">開催日 <span className="text-accent">必須</span></div>
      <DateTimePicker
        value={eventDate}
        hour={hour}
        hours={EVENT_HOURS}
        onChange={setEventDate}
        onHourChange={setHour}
      />

      <div className="text-[12.5px] font-bold mb-1.5">会場 <span className="text-accent">必須</span></div>
      <Input
        value={place}
        onChange={(e) => setPlace(e.target.value)}
        placeholder="例: 池袋サンシャインシティ(東京)"
        className="mb-4"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-[12.5px] font-bold mb-1.5">入場料</div>
          <Input
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            placeholder="例: 前売 3,000円"
          />
        </div>
        <div>
          <div className="text-[12.5px] font-bold mb-1.5">オフィシャルサイト</div>
          <Input
            value={officialUrl}
            onChange={(e) => setOfficialUrl(e.target.value)}
            placeholder="https://"
          />
        </div>
      </div>

      <div className="text-[12.5px] font-bold mb-1.5">イベント説明</div>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="イベントの見どころ・参加方法など"
        className="mb-6"
      />

      <Button onClick={handleSubmit} size="lg" fullWidth>{isEdit ? 'この内容で更新する' : 'この内容で登録する'}</Button>
    </div>
  );
}
