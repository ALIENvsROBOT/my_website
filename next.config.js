/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Set correct paths for GitHub Pages repository
  basePath: process.env.NODE_ENV === 'production' ? '/my_website' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/my_website' : '',
  trailingSlash: true, // Recommended for GitHub Pages compatibility
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Disable optimizeCss to avoid potential issues with asset loading
    optimizeCss: false,
  },
}

module.exports = nextConfig 