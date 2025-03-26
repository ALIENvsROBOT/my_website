/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // No need for basePath with custom domain
  trailingSlash: true, // Recommended for GitHub Pages compatibility
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig 