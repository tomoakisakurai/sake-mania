import type { MetadataRoute } from 'next';

// PWAマニフェスト。ホーム画面に追加すると standalone(単体アプリ表示)で起動する。
// Service Workerによるオフラインキャッシュは意図的に入れていない
// (server actionとの相性が悪くキャッシュ事故のもと。インストール可否には不要)。
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '酒マニア — SAKE MANIA',
    short_name: 'SAKE MANIA',
    description: '社内日本酒部のための利き酒記録アプリ',
    start_url: '/',
    display: 'standalone',
    background_color: '#F6F1E7',
    theme_color: '#F6F1E7',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
