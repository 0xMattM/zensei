/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15 optimizations
  experimental: {
    // These features are now stable in v15, no need to enable
    optimizePackageImports: ['lucide-react'],
  },

  // Image domains for potential future use
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig 