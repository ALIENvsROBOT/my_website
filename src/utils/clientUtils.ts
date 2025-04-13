/**
 * Safely determine if code is running in a browser environment
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Check if we're in static export build mode
 */
export const isStaticExport = 
  process.env.NEXT_PUBLIC_IS_STATIC_EXPORT === 'true';

/**
 * Safely check if device is mobile based on user agent
 * Only runs on client side
 */
export const isMobileDevice = (): boolean => {
  if (!isBrowser || isStaticExport) return false;
  
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  } catch (e) {
    return false;
  }
};

/**
 * Safely check if viewport width is mobile-sized
 * Only runs on client side
 */
export const isMobileViewport = (): boolean => {
  if (!isBrowser || isStaticExport) return false;
  
  try {
    return window.innerWidth < 768;
  } catch (e) {
    return false;
  }
};

/**
 * Combined check for mobile (either by device or viewport)
 */
export const isMobile = (): boolean => {
  if (!isBrowser || isStaticExport) return false;
  
  try {
    return isMobileDevice() || isMobileViewport();
  } catch (e) {
    return false;
  }
}; 