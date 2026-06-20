'use client';
import { useStore } from '@/store';

export function Members() {
  const store = useStore();
  const isMobile = useStore((s) => s.vw < 768);
  const pagePadding = isMobile ? '20px 18px 130px' : '32px 40px 80px';
  return (
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: pagePadding }}>
      <div onClick={() => store.nav('home')} className="text-[13px] text-muted cursor-pointer mb-6 hover:text-primary transition-colors">← ホームにもどる</div>
      <div className="font-serif text-[28px] font-bold mb-1.5">メンバー出身地マップ</div>
      <div className="text-[13px] text-muted mb-7">近日公開</div>
      <div className="border border-dashed border-line-strong rounded-xl py-12 text-center bg-surface">
        <div className="font-serif text-[18px] font-bold mb-2">準備中です</div>
        <div className="text-[13px] text-muted leading-relaxed">日本酒会のメンバーの出身地を地図で見られる機能を準備中です。</div>
      </div>
    </div>
  );
}
