// Utility for handling image fallbacks
import publicPath from './publicPath';

// Default placeholder service URLs
const PLACEHOLDER_SERVICES = {
  // PlaceHolder.com - easy to customize dimensions and colors
  basic: (width, height) => `https://via.placeholder.com/${width}x${height}`,
  
  // Picsum Photos - beautiful random images
  photo: (width, height) => `https://picsum.photos/${width}/${height}`,
  
  // Abstract placeholder
  abstract: (width, height) => `https://source.unsplash.com/random/${width}x${height}/?abstract,tech,digital`
};

/**
 * Get a placeholder image URL with specific dimensions
 * @param {string} type - Type of placeholder: 'basic', 'photo', or 'abstract'
 * @param {number} width - Width of the placeholder
 * @param {number} height - Height of the placeholder
 * @returns {string} Placeholder URL
 */
export function getPlaceholder(type = 'basic', width = 400, height = 300) {
  const generator = PLACEHOLDER_SERVICES[type] || PLACEHOLDER_SERVICES.basic;
  return generator(width, height);
}

/**
 * Get a fallback URL for a broken image
 * @param {string} originalSrc - Original image source
 * @param {object} options - Options for fallback
 * @returns {string} Fallback image URL
 */
export function getFallbackImageUrl(originalSrc, options = {}) {
  const { 
    type = 'abstract', 
    width = 400, 
    height = 300 
  } = options;
  
  // Return a placeholder with dimensions
  return getPlaceholder(type, width, height);
}

/**
 * Handle image error by replacing src with a placeholder
 * @param {Event} event - Image error event
 */
export function handleImageError(event, options = {}) {
  if (event.target) {
    // Get original dimensions from the image element
    const width = event.target.width || options.width || 400;
    const height = event.target.height || options.height || 300;
    
    // Replace with placeholder
    event.target.src = getFallbackImageUrl(event.target.src, {
      ...options,
      width,
      height
    });
    
    // Prevent infinite error loop
    event.target.onerror = null;
  }
}

export default {
  getPlaceholder,
  getFallbackImageUrl,
  handleImageError
}; 