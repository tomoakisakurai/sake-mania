import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Drizzle + postgres are server-only; keep them out of the client bundle.
  serverExternalPackages: ['postgres'],
  // 写真はデータURLで server action に送るため、デフォルト1MBでは足りない。
  // クライアント側で縮小(src/lib/resizeImage.ts)した上での保険として引き上げる。
  experimental: { serverActions: { bodySizeLimit: '4mb' } },
  // Lint is run separately via `npm run lint`; don't block production builds on it.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
