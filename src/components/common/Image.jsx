"use client";

import React, { useState } from 'react';
import NextImage from 'next/image';
import { handleImageError, getPlaceholder } from '../../utils/imageUtils';
import publicPath from '../../utils/publicPath';

/**
 * Enhanced Image component with built-in fallback for missing images
 */
const Image = ({ 
  src, 
  alt, 
  width = 400, 
  height = 300, 
  fallbackType = 'abstract',
  className,
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isError, setIsError] = useState(false);

  // Handle image loading error
  const onError = () => {
    if (!isError) {
      // Only replace once to avoid infinite loop
      setIsError(true);
      setImgSrc(getPlaceholder(fallbackType, width, height));
    }
  };

  // If src is an external URL (starts with http), use it directly
  // Otherwise, use our publicPath utility
  const resolvedSrc = typeof src === 'string' && !src.startsWith('http') && !src.startsWith('data:') 
    ? publicPath(src) 
    : src;

  return (
    <NextImage
      src={isError ? imgSrc : resolvedSrc}
      alt={alt || 'Image'}
      width={width}
      height={height}
      className={className}
      onError={onError}
      {...props}
    />
  );
};

export default Image; 