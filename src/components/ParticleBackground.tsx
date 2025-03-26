"use client";

import { useEffect, useState } from 'react';

const ParticleBackground = () => {
  const [mounted, setMounted] = useState(false);
  
  // Initialize
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render during SSR
  if (!mounted) return null;
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
      {/* Base background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(45deg, #0a0b15 0%, #141b33 100%)'
        }}
      />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-40"></div>
      
      {/* Scan lines */}
      <div className="absolute inset-0 bg-scan-lines opacity-20"></div>
      
      {/* Glowing orbs - static */}
      <div className="glowing-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      
      {/* Add a subtle vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default ParticleBackground; 