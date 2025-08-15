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
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl opacity-70 z-0"></div>
      <motion.div 
        className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-75 z-0"
        animate={{ 
          opacity: [0.5, 0.8, 0.5],
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
      <div className="relative z-10 p-1 rounded-full overflow-hidden backdrop-blur-sm animated-border">
        <div className="w-full h-full aspect-square relative rounded-full overflow-hidden">
          {error ? (
            <div className="w-full h-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">GS</span>
            </div>
          ) : (
            <Image
              src="/images/profile.jpg"
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
        className="absolute -bottom-2 -right-1 bg-darkBg/80 px-2 py-0.5 rounded-full text-[10px] border border-indigo-500/30 backdrop-blur-md z-20 font-mono"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-indigo-400">HCI</span>
        <span className="text-gray-400">|</span>
        <span className="text-purple-400">AI</span>
      </motion.div>
      
      {/* Glowing dot */}
      <motion.div 
        className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500 z-20"
        animate={{ 
          boxShadow: ['0 0 3px #8B5CF6', '0 0 6px #8B5CF6', '0 0 3px #8B5CF6']
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};


export default ProfileImage; 