"use client";

import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Don't show on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }

    // Make cursor visible after a very short delay
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    // Mouse move handler - simpler implementation
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // Hover detection for buttons and links
    const onMouseEnterInteractive = () => setIsHovering(true);
    const onMouseLeaveInteractive = () => setIsHovering(false);

    // Add event listeners
    document.addEventListener('mousemove', onMouseMove);

    // Add hover listeners to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterInteractive);
      el.addEventListener('mouseleave', onMouseLeaveInteractive);
    });

    return () => {
      clearTimeout(visibilityTimer);
      document.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="cursor-container" style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999 }}>
      {/* Main dot */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
          width: '8px',
          height: '8px',
          backgroundColor: 'white',
          borderRadius: '50%',
          transition: 'opacity 0.15s ease',
          opacity: 1,
          zIndex: 9999,
          pointerEvents: 'none',
          mixBlendMode: 'difference'
        }}
      />
      
      {/* Outer ring */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
          width: isHovering ? '50px' : '30px',
          height: isHovering ? '50px' : '30px',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '50%',
          transition: 'width 0.2s ease, height 0.2s ease, background-color 0.2s ease',
          backgroundColor: isHovering ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
          zIndex: 9998,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default CustomCursor; 