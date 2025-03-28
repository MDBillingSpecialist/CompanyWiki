/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Change from 'export' to 'standalone' for AWS Amplify compatibility
  output: 'standalone',
  images: { 
    unoptimized: true,
    domains: [] // Add domains here if needed for remote images
  },
  trailingSlash: true,
}

module.exports = nextConfig
