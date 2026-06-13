import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Drizzle + postgres are server-only; keep them out of the client bundle.
  serverExternalPackages: ['postgres'],
  // Lint is run separately via `npm run lint`; don't block production builds on it.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
