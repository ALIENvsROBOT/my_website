"use client";

import React, { useState } from 'react';
import { handleImageError } from '../../utils/imageUtils';
import publicPath from '../../utils/publicPath';

/**
 * Regular img tag with fallback for missing images
 * Use this for cases where Next/Image is not ideal
 */
const PlaceholderImage = ({ 
  src, 
  alt, 
  width = "auto", 
  height = "auto", 
  className = "", 
  fallbackType = 'abstract',
  ...props 
}) => {
  // Resolve the source path
  const resolvedSrc = typeof src === 'string' && !src.startsWith('http') && !src.startsWith('data:') 
    ? publicPath(src) 
    : src;

  return (
    <img
      src={resolvedSrc}
      alt={alt || 'Image'}
      width={width}
      height={height}
      className={className}
      onError={(e) => handleImageError(e, { type: fallbackType, width, height })}
      {...props}
    />
  );
};

export default PlaceholderImage; 