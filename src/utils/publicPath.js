// Utility to get the correct public path for assets
export function getPublicPath(path) {
  // For custom domain, we don't need a base path
  const basePath = '';
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}

// For image sources, component props, etc.
export default function publicPath(path) {
  return getPublicPath(path);
} 