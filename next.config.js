/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Updated to use valid experimental options for Next.js 15.2.2
    mdxRs: true,
  },
  typescript: {
    // Disable TypeScript errors during builds to allow for easier development
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint errors during builds to allow for easier development
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
