"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { motion } from 'framer-motion';
import { Engine, ISourceOptions } from 'tsparticles-engine';

const EnhancedParticleBackground = () => {
  const [isMobile, setIsMobile] = useState(false);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const particleOptions = useMemo<ISourceOptions>(
    () => ({
      fullScreen: {
        enable: false
      },
      fpsLimit: isMobile ? 24 : 30,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      particles: {
        number: {
          value: isMobile ? 12 : 30,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: ["#27272A", "#3F3F46", "#52525B"]
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000"
          },
        },
        opacity: {
          value: 0.28,
          random: true,
          anim: {
            enable: false,
            speed: 0,
            opacity_min: 0.2,
            sync: false
          }
        },
        size: {
          value: 2.05,
          random: true,
          anim: {
            enable: false,
            speed: 0,
            size_min: 0.2,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 140,
          color: "#52525B",
          opacity: isMobile ? 0.12 : 0.16,
          width: 1
        },
        move: {
          enable: true,
          speed: isMobile ? 0.2 : 0.28,
          direction: "none" as const,
          random: true,
          straight: false,
          out_mode: "out" as const,
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: "window" as const,
        events: {
          onhover: {
            enable: !isMobile,
            mode: "grab" as const
          },
          onclick: {
            enable: false,
            mode: "push" as const
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 120,
            line_linked: {
              opacity: 0.24
            }
          },
        }
      },
      retina_detect: false
    }),
    [isMobile]
  );
  
  return (
    <div className="particle-container">
      <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-white/0 via-zinc-100/34 to-zinc-200/40 z-0"></div>
      
      {/* Glowing orbs in the background */}
      <div className="fixed inset-0 overflow-hidden z-0 opacity-23 pointer-events-none mix-blend-multiply">
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full bg-zinc-500/25 blur-[120px]"
          animate={{
            x: ['-10%', '10%', '-10%'],
            y: ['-10%', '10%', '-10%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '15%' }}
        />
        
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-stone-500/18 blur-[105px]"
          animate={{
            x: ['15%', '-15%', '15%'],
            y: ['5%', '-5%', '5%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '40%', right: '10%' }}
        />
      </div>
      
      {/* Grid lines */}
      <div className="fixed inset-0 z-0 opacity-[0.09] pointer-events-none">
        <div className="h-full w-full grid grid-cols-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-full w-[1px] bg-zinc-600/35 justify-self-center"></div>
          ))}
        </div>
        <div className="h-full w-full grid grid-rows-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-full h-[1px] bg-zinc-600/35 self-center"></div>
          ))}
        </div>
      </div>
      
      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particleOptions}
        className="fixed inset-0 z-0 pointer-events-auto"
      />
      
      {/* Subtle noise overlay for texture */}
      <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none bg-[url('/images/noise.png')] bg-repeat"></div>
    </div>
  );
};

export default EnhancedParticleBackground; 
