"use client";

import React from 'react';
import { Image, PlaceholderImage } from './common';
import publicPath from '../utils/publicPath';

/**
 * Component to demonstrate different placeholder image examples
 */
const ImageExamples = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8 text-lightText">Image Examples with Fallbacks</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Example 1: Next.js Image with Abstract Fallback */}
        <div className="glass-effect p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-secondary">Next Image Component</h3>
          <p className="mb-4 text-lightText/70 text-sm">Abstract placeholder fallback</p>
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image 
              src="/non-existent-image.png"
              alt="Abstract Fallback Example"
              width={500}
              height={300}
              fallbackType="abstract"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Example 2: Standard HTML Image with Photo Fallback */}
        <div className="glass-effect p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-secondary">HTML Image Tag</h3>
          <p className="mb-4 text-lightText/70 text-sm">Random photo placeholder fallback</p>
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <PlaceholderImage 
              src="/missing-image.png"
              alt="Photo Fallback Example"
              width="100%"
              height="auto"
              fallbackType="photo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Example 3: Standard HTML Image with Basic Fallback */}
        <div className="glass-effect p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-secondary">HTML Image Tag</h3>
          <p className="mb-4 text-lightText/70 text-sm">Basic gray placeholder fallback</p>
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <PlaceholderImage 
              src="/does-not-exist.png"
              alt="Basic Fallback Example"
              width="100%"
              height="auto"
              fallbackType="basic"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-12 p-6 glass-effect-dark rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-secondary">How to Use These Components</h3>
        <div className="bg-darkBg/50 p-4 rounded-lg overflow-x-auto">
          <pre className="text-lightText/90 text-sm">
            {`// Import the components
import { Image, PlaceholderImage } from './components/common';

// Next.js Image with fallback
<Image 
  src="/path/to/image.png"
  alt="Description"
  width={500}
  height={300}
  fallbackType="abstract" // 'abstract', 'photo', or 'basic'
/>

// Regular HTML img with fallback
<PlaceholderImage 
  src="/path/to/image.png"
  alt="Description"
  width="100%" 
  height="auto"
  fallbackType="photo"
/>`}
          </pre>
        </div>
      </div>
    </section>
  );
};

export default ImageExamples; 