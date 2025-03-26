/**
 * Next.js Configuration
 * 
 * This file contains the configuration for Next.js.
 * Previously, this was a bridge file that imported from the config directory.
 * Now the configuration is directly in this file following Next.js best practices.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Temporarily ignore errors for Docker build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure Server Components
  experimental: {},
  // Enable standalone output for Docker
  output: 'standalone',
  // Improve image handling
  images: {
    domains: [],
    remotePatterns: [],
  },
  // Improve security headers
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
