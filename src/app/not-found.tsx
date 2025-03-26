"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function NotFound() {
  const [count, setCount] = useState(5);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-scan-lines pointer-events-none z-[5]"></div>
      
      {/* Tech decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>
      
      <motion.div 
        className="premium-glass p-8 rounded-xl border border-secondary/30 max-w-xl w-full text-center relative sci-fi-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs font-mono text-red-400">ERROR</span>
          </div>
        </div>
        
        <motion.div 
          className="text-8xl font-bold text-secondary mb-4"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          404
        </motion.div>
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent mb-6"></div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-lightText">Sector Not Found</h1>
        <p className="text-lightText/70 mb-6">The data node you're searching for appears to be corrupted or missing from the mainframe.</p>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link 
            href="/"
            className="premium-button glow-accent"
          >
            <span>Return to Home Base</span>
          </Link>
          
          <div className="premium-glass px-4 py-2 rounded-full border border-secondary/20">
            <p className="text-sm text-secondary">
              Auto-returning in <span className="font-bold">{count}</span> seconds
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-secondary/20">
          <p className="text-xs text-lightText/50 font-mono">
            ERROR CODE: NODE_NOT_FOUND_GS-404
          </p>
        </div>
      </motion.div>
    </div>
  );
} 