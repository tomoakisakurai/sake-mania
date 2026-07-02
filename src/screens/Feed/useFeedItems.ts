'use client';
import { useStore } from '@/store';
import { useReferenceData } from '@/components/Providers';
import { buildFeedItems, type FeedItem } from '@/lib/feedModel';

// みんなの利き酒帳(一覧)のビューモデル。構築ロジックは lib/feedModel に共有
// (Homeの抜粋 useHomeVals も同じ builder を使う)。
export function useFeedItems(): FeedItem[] {
  const store = useStore();
  const { brands } = useReferenceData();
  return buildFeedItems(store, brands, store.user?.name ?? '');
}
