'use client';
import { useStore } from '@/store';

export function Members() {
  const store = useStore();
  const isMobile = useStore((s) => s.vw < 768);
  const pagePadding = isMobile ? '20px 18px 130px' : '32px 40px 80px';
  return (
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: pagePadding }}>
      <div onClick={() => store.nav('home')} className="text-[13px] text-[#8B8273] cursor-pointer mb-6 hover:text-[#32507C] transition-colors">← ホームにもどる</div>
      <div className="font-serif text-[28px] font-bold mb-1.5">メンバー出身地マップ</div>
      <div className="text-[13px] text-[#8B8273] mb-7">近日公開</div>
      <div className="border border-dashed border-[#D9D0BC] rounded-xl py-12 text-center bg-[#FDFBF5]">
        <div className="font-serif text-[18px] font-bold mb-2">準備中です</div>
        <div className="text-[13px] text-[#8B8273] leading-relaxed">日本酒会のメンバーの出身地を地図で見られる機能を準備中です。</div>
      </div>
    </div>
  );
}
