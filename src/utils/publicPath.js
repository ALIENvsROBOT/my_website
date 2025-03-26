// Utility to get the correct public path for assets
export function getPublicPath(path) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}

// For image sources, component props, etc.
export default function publicPath(path) {
  return getPublicPath(path);
} 