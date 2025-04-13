import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ProfileImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <motion.div 
      className="relative mx-auto lg:mx-0 mb-8 lg:mb-0"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-xl opacity-70 z-0"></div>
      <motion.div 
        className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-75 z-0"
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
      <div className="absolute inset-0 overflow-hidden rounded-xl z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-circuit-pattern bg-repeat"></div>
      </div>
      
      {/* Main image container */}
      <div className="relative z-10 p-1 rounded-xl overflow-hidden backdrop-blur-sm animated-border">
        <div className="w-[280px] h-[280px] md:w-[320px] md:h-[320px] relative rounded-lg overflow-hidden">
          {error ? (
            <div className="w-full h-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">GS</span>
            </div>
          ) : (
            <Image
              src="/images/profile.jpg"
              alt="Gowtham Sridhar"
              width={320}
              height={320}
              className={`object-cover w-full h-full transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsLoaded(true)}
              onError={() => setError(true)}
              priority
            />
          )}
        </div>
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-indigo-500 rounded-tl-lg z-20"></div>
      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-purple-500 rounded-tr-lg z-20"></div>
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-indigo-500 rounded-bl-lg z-20"></div>
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-purple-500 rounded-br-lg z-20"></div>
      
      {/* Tech details */}
      <motion.div 
        className="absolute -bottom-3 -right-3 bg-darkBg/80 px-3 py-1 rounded-full text-xs border border-indigo-500/30 backdrop-blur-md z-20 font-mono"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-indigo-400">HCI</span>
        <span className="text-gray-400"> | </span>
        <span className="text-purple-400">XR Expert</span>
      </motion.div>
      
      {/* Glowing dot */}
      <motion.div 
        className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-500 z-20"
        animate={{ 
          boxShadow: ['0 0 5px #8B5CF6', '0 0 10px #8B5CF6', '0 0 5px #8B5CF6']
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default ProfileImage; 