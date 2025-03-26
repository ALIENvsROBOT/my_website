/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // No need for basePath with custom domain, but we need to set assetPrefix
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://www.gowthamsridhar.com' : '',
  trailingSlash: true, // Recommended for GitHub Pages compatibility
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Disable optimizeCss to avoid potential issues with asset loading
    optimizeCss: false,
  },
}

module.exports = nextConfig 