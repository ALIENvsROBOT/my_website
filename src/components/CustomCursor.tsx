"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { isBrowser } from '@/utils/clientUtils';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (!isBrowser) return;
    
    // Check if device supports fine pointer (mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(mediaQuery.matches);
    
    // Only proceed if this is a pointer device
    if (!mediaQuery.matches) return;

    // Check if the user has disabled custom cursor in localStorage
    try {
      const cursorPreference = localStorage.getItem('custom-cursor-disabled');
      if (cursorPreference === 'true') {
        setIsEnabled(false);
        return;
      }
    } catch (e) {
      // Handle localStorage not being available
      console.error('Error accessing localStorage:', e);
    }

    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Only show cursor after first movement
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      // Check if the element or its parents are interactive
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') !== null || 
        target.closest('a') !== null ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('interactive');
      
      setIsHovering(isInteractive);
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };
    
    // Hide cursor when it leaves the window
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    // Show cursor when it enters the window
    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Add event listeners
    window.addEventListener('mousemove', updateCursorPosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Don't render if custom cursor is disabled, on non-pointer devices, or if still invisible
  if (!isEnabled || !isPointerDevice || !isVisible) {
    return null;
  }

  return (
    <motion.div
      className={`custom-cursor ${isHovering ? 'hovered' : ''}`}
      animate={{
        x: position.x,
        y: position.y,
        opacity: isVisible ? 0.7 : 0,
        scale: isHovering ? 1.2 : 1,
      }}
      transition={{
        type: "spring",
        mass: 0.3,
        stiffness: 800,
        damping: 20,
        opacity: { duration: 0.2 }
      }}
    >
      <div className="custom-cursor-dot" />
      <motion.div 
        className="custom-cursor-ring"
        animate={{
          scale: isHovering ? 1.2 : 1,
          borderColor: isHovering ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.8)'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15
        }}
      />
      
      {/* Add a glow effect when hovering */}
      {isHovering && (
        <motion.div
          className="absolute inset-0 rounded-full bg-indigo-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          style={{ filter: 'blur(8px)' }}
        />
      )}
    </motion.div>
  );
};

export default CustomCursor; 