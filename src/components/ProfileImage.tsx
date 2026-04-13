'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ProfileImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <motion.div 
      className="relative mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/25 to-yellow-600/20 rounded-full blur-xl opacity-75 z-0"></div>
      <motion.div 
        className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full opacity-80 z-0"
        animate={{ 
          opacity: [0.52, 0.84, 0.52],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      
      {/* Circuit patterns */}
      <div className="absolute inset-0 overflow-hidden rounded-full z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-circuit-pattern bg-repeat"></div>
      </div>
      
      {/* Main image container */}
      <div className="relative z-10 p-1 rounded-full overflow-hidden backdrop-blur-sm border border-amber-400/70 shadow-[0_0_0_1px_rgba(245,158,11,0.32),0_10px_24px_-16px_rgba(161,98,7,0.45)]">
        <div className="w-full h-full aspect-square relative rounded-full overflow-hidden">
          {error ? (
            <div className="w-full h-full bg-gradient-to-br from-zinc-900/50 to-neutral-900/50 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">GS</span>
            </div>
          ) : (
            <Image
              src="/images/gowtham-profile.jpg"
              alt="Gowtham Sridhar"
              width={300}
              height={300}
              className={`object-cover w-full h-full transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsLoaded(true)}
              onError={() => setError(true)}
              priority
            />
          )}
        </div>
      </div>
      
      {/* Tech details - moved to a smaller badge */}
      <motion.div 
        className="absolute -bottom-2 -right-1 bg-darkBg/85 px-2 py-0.5 rounded-full text-[10px] border border-amber-500/40 backdrop-blur-md z-20 font-mono"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-amber-800">HCI</span>
        <span className="text-amber-600 mx-1">|</span>
        <span className="text-amber-800">AI</span>
      </motion.div>
      
      {/* Glowing dot */}
      <motion.div 
        className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 z-20"
        animate={{ 
          boxShadow: ['0 0 4px #F59E0B', '0 0 8px #FBBF24', '0 0 4px #F59E0B']
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};


export default ProfileImage; 
