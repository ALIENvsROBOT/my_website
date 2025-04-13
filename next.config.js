/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // In production, don't use basePath for custom domain
  basePath: '',
  // Don't use assetPrefix for custom domain
  assetPrefix: '',
  // Remove trailing slash to fix canonical issues
  trailingSlash: false,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Disable optimizeCss to avoid potential issues with asset loading
    optimizeCss: false,
  },
}

module.exports = nextConfig 