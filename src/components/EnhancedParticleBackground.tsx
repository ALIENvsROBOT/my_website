import React, { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { motion } from 'framer-motion';
import { Engine, ISourceOptions } from 'tsparticles-engine';
import { isBrowser, isMobileViewport } from '@/utils/clientUtils';

const EnhancedParticleBackground = () => {
  const [isMobile, setIsMobile] = useState(false);
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    if (!isBrowser) return;
    
    const checkMobile = () => {
      setIsMobile(isMobileViewport());
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Dynamic options based on device capabilities
  const getParticleOptions = (): ISourceOptions => {
    // Base configuration
    const baseConfig: ISourceOptions = {
      particles: {
        number: {
          value: isMobile ? 15 : 50,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: ["#6366F1", "#8B5CF6", "#7C3AED", "#4F46E5"]
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000"
          },
        },
        opacity: {
          value: 0.3,
          random: true,
          anim: {
            enable: true,
            speed: 0.2,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.3,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#6366F1",
          opacity: 0.1,
          width: 1
        },
        move: {
          enable: true,
          speed: isMobile ? 0.5 : 1,
          direction: "none" as const,
          random: true,
          straight: false,
          out_mode: "out" as const,
          bounce: false,
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: "canvas" as const,
        events: {
          onhover: {
            enable: !isMobile,
            mode: "grab" as const
          },
          onclick: {
            enable: !isMobile,
            mode: "push" as const
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 0.5
            }
          },
          push: {
            particles_nb: 3
          }
        }
      },
      retina_detect: false
    };
    
    return baseConfig;
  };
  
  return (
    <div className="particle-container">
      <div className="absolute inset-0 bg-gradient-radial from-slate-900/0 to-slate-950 z-0"></div>
      
      {/* Glowing orbs in the background */}
      <div className="fixed inset-0 overflow-hidden z-0 opacity-20 pointer-events-none">
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px]"
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
          className="absolute w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[100px]"
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
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="h-full w-full grid grid-cols-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-full w-[1px] bg-indigo-500 justify-self-center"></div>
          ))}
        </div>
        <div className="h-full w-full grid grid-rows-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-full h-[1px] bg-indigo-500 self-center"></div>
          ))}
        </div>
      </div>
      
      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={getParticleOptions()}
        className="fixed inset-0 z-0"
      />
      
      {/* Subtle noise overlay for texture */}
      <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none bg-[url('/images/noise.png')] bg-repeat"></div>
    </div>
  );
};

export default EnhancedParticleBackground; 