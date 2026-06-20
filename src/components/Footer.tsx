'use client';
import { useStore } from '@/store';
import type { Screen } from '@/types';

type Link = { label: string; screen: Screen };
type Section = { title: string; links: Link[] };

const SECTIONS: Section[] = [
  {
    title: 'サービス',
    links: [
      { label: 'ホーム', screen: 'home' },
      { label: 'SAKE MEETUP', screen: 'meetups' },
      { label: 'イベント', screen: 'events' },
      { label: 'メンバー', screen: 'members' },
    ],
  },
  {
    title: 'さがす',
    links: [
      { label: '銘柄図鑑', screen: 'zukan' },
      { label: '酒蔵マップ', screen: 'map' },
      { label: 'みんなの利き酒帳', screen: 'feed' },
    ],
  },
  {
    title: 'アカウント',
    links: [
      { label: 'マイページ', screen: 'mypage' },
      { label: '記録する', screen: 'record' },
    ],
  },
];

export function Footer() {
  const store = useStore();
  const isMobile = useStore((s) => s.vw < 768);
  const handleClick = (screen: Screen) => {
    if (screen === 'mypage' || screen === 'record') {
      if (!store.requireLogin()) return;
    }
    store.nav(screen);
  };

  if (isMobile) return null;

  return (
    <div className="bg-surface border-t border-line px-10 pt-9 pb-7 mt-16">
      <div className="max-w-[1140px] mx-auto grid grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-8">
        <div>
          <div className="flex items-baseline gap-2.5 mb-2.5">
            <span className="font-serif text-[19px] font-extrabold tracking-[0.04em]">酒マニア</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-muted">SAKE MANIA</span>
          </div>
          <div className="text-[12px] leading-relaxed text-muted">社内日本酒部の活動を、もっと愉しく。</div>
        </div>
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="font-serif text-[13px] font-bold text-ink mb-3">{section.title}</div>
            <div className="flex flex-col gap-2">
              {section.links.map((link) => (
                <span
                  key={link.screen}
                  onClick={() => handleClick(link.screen)}
                  className="text-[12.5px] text-body cursor-pointer leading-snug hover:text-primary transition-colors"
                >
                  {link.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-[1140px] mx-auto mt-7 pt-[18px] border-t border-line text-[11px] text-faint text-center tracking-[0.05em]">
        © SAKE Mania ・ 社内日本酒部
      </div>
    </div>
  );
}
