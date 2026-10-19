import { describe, it, expect } from 'vitest';
import { pageMeta } from './meta';

const IMAGE = { url: '/api/invite-qr?token=abc', width: 480, height: 480, alt: '招待リンクの QR コード' };

describe('pageMeta', () => {
  it('画像なしなら title / description / OGP だけで、画像と twitter.card を持たない', () => {
    expect(pageMeta('ログイン', '説明')).toEqual({
      title: 'ログイン',
      description: '説明',
      openGraph: { title: 'ログイン — 酒マニア', description: '説明' },
      twitter: { title: 'ログイン — 酒マニア', description: '説明' },
    });
  });

  it('画像ありなら og:image と twitter の画像を付け、大きい画像のカードにする', () => {
    const meta = pageMeta('新規登録の招待', '説明', { image: IMAGE });
    expect(meta.title).toBe('新規登録の招待');
    expect(meta.openGraph).toEqual({ title: '新規登録の招待 — 酒マニア', description: '説明', images: [IMAGE] });
    expect(meta.twitter).toEqual({
      card: 'summary_large_image',
      title: '新規登録の招待 — 酒マニア',
      description: '説明',
      images: [IMAGE],
    });
  });
});
