import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg', 'jsonwebtoken'],
};

export default nextConfig;
