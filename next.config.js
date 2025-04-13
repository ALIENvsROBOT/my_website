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
  // Disable server components for static export
  compiler: {
    styledComponents: true,
  },
  // Add environment variable to indicate we're building for static output
  env: {
    NEXT_PUBLIC_IS_STATIC_EXPORT: 'true',
  },
}

module.exports = nextConfig 