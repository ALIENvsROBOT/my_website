// Utility to get the correct public path for assets
export function getPublicPath(path) {
  // Use the appropriate base path for GitHub Pages
  const basePath = process.env.NODE_ENV === 'production' ? '/my_website' : '';
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}

// For image sources, component props, etc.
export default function publicPath(path) {
  return getPublicPath(path);
} 