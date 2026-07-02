'use client';
import { useStore } from '@/store';
import { deleteRecord as deleteRecordAction } from '@/app/actions/records';
import type { MyPageVals } from './useMyPageVals';
import { RecordItem } from './RecordItem';
// マイページ: わたしの利き酒帳(自分の記録一覧)
export function RecordList({ my }: { my: MyPageVals }) {
  const store = useStore();
  const handleDelete = async (recordId: string, name: string) => {
    if (!window.confirm(`「${name}」の記録を削除しますか?`)) return;
    const ok = await deleteRecordAction(recordId);
    if (!ok) { store.flash('削除に失敗しました'); return; }
    store.patch({
      myRecords: store.myRecords.filter((r) => r.recordId !== recordId),
      publicRecords: store.publicRecords.filter((r) => r.recordId !== recordId),
    });
    store.flash('記録を削除しました');
  };
  return (
    <section>
      <h2 className="m-0 mb-4 border-b border-line pb-2.5 font-serif text-[18px] font-bold">わたしの利き酒帳</h2>
      <ul className="m-0 flex flex-col gap-3.5 p-0 list-none">
        {my.myList.map((record, i) => (
          <li key={i}>
            <RecordItem record={record} onDelete={handleDelete} />
          </li>
        ))}
      </ul>
    </section>
  );
}
