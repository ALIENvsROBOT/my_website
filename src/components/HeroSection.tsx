"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

// Tech decoration component to fill empty spaces
function TechDecoration({ className }: { className?: string }) {
  return (
    <div className={`relative tech-decoration ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-highlight/10 opacity-30 rounded-lg"></div>
      <div className="grid grid-cols-8 gap-1 p-2">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className={`h-1 rounded-full ${i % 3 === 0 ? 'bg-secondary/40' : 'bg-gray-700/40'}`}></div>
        ))}
      </div>
      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
    </div>
  );
}

// Data visualization component
function DataVisualization() {
  return (
    <div className="relative mt-4 mb-3 premium-glass rounded-lg p-2 border border-secondary/20 premium-hover">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-xs uppercase tracking-wider text-secondary font-mono">Research Activity</h4>
        <span className="text-xs font-mono text-lightText/50 tech-blink">LIVE DATA</span>
      </div>
      <div className="h-12 flex items-end gap-1">
        {Array.from({ length: 28 }).map((_, i) => {
          const height = 15 + Math.random() * 25;
          return (
            <div 
              key={i} 
              className="data-bar" 
              style={{ height: `${height}px`, width: '6px' }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

// Holographic information display
function HolographicInfo({ title, info, delay }: { title: string; info: string; delay: number }) {
  return (
    <motion.div
      className="relative p-3 mb-3 rounded-lg glass-effect-dark border border-secondary/20 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary animate-pulse-slow"></div>
      <h3 className="text-xs uppercase tracking-widest mb-1 text-secondary font-mono">+ {title}</h3>
      <p className="text-lightText/90 text-sm font-medium">{info}</p>
    </motion.div>
  );
}

// Tech quotes for empty space
const techQuotes = [
  "The interface between humans and machines defines our future.",
  "Innovation thrives at the intersection of technology and human experience.",
  "XR isn't just about seeing differently, it's about thinking differently."
];

// Temporary static Avatar component (no 3D)
function StaticAvatar() {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/20 to-purple-900/20 overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 opacity-10">
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className="bg-white/5 rounded-sm"></div>
        ))}
      </div>
      
      {/* Use conditional rendering based on error state */}
      {imageError ? (
        <div className="relative z-10 w-[300px] h-[300px] rounded-xl bg-gradient-to-br from-secondary/30 to-purple-500/30 flex items-center justify-center">
          <span className="text-lightText font-bold text-2xl">GS</span>
        </div>
      ) : (
        <Image
          src="/gowtham_profile.png"
          alt="Gowtham Sridhar"
          width={400}
          height={400}
          className="rounded-xl shadow-lg relative z-10 object-cover max-w-[300px]"
          priority
          onError={() => setImageError(true)}
        />
      )}
      
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-darkBg/80 to-transparent"></div>
    </div>
  );
}

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHologramVisible, setIsHologramVisible] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Add a delay to ensure content is visible
    const timer = setTimeout(() => {
      const tl = gsap.timeline();
      
      tl.from('.hero-title span', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      })
      .from('.hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.4')
      .from('.hero-button', {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
      }, '-=0.2')
      .call(() => setIsHologramVisible(true));
    }, 100);
    
    // Rotate quotes periodically
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % techQuotes.length);
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(quoteInterval);
    };
  }, []);

  return (
    <section 
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-start pt-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-scan-lines pointer-events-none z-[5]"></div>
      
      {/* Tech background elements to fill empty space */}
      <div className="absolute left-[5%] top-[25%] w-[150px] opacity-80 z-[2]">
        <TechDecoration />
      </div>
      <div className="absolute right-[8%] top-[30%] w-[100px] opacity-60 z-[2] hidden md:block">
        <TechDecoration />
      </div>
      <div className="absolute left-[12%] bottom-[15%] w-[120px] opacity-70 z-[2] hidden md:block">
        <TechDecoration />
      </div>
      
      {/* Tech particles - floating in empty space */}
      {Array.from({ length: 15 }).map((_, i) => {
        const size = 20 + Math.random() * 60;
        const top = Math.random() * 90;
        const left = Math.random() * 90;
        const blur = 10 + Math.random() * 40;
        return (
          <div 
            key={i}
            className="bg-particle"
            style={{ 
              width: `${size}px`, 
              height: `${size}px`, 
              top: `${top}%`, 
              left: `${left}%`,
              backgroundColor: i % 3 === 0 ? 'rgba(99, 102, 241, 0.15)' : i % 3 === 1 ? 'rgba(139, 92, 246, 0.15)' : 'rgba(56, 189, 248, 0.15)',
              filter: `blur(${blur}px)`,
              animationDelay: `${i * 0.7}s`
            }}
          />
        );
      })}
      
      {/* Animated tech lines */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[1]">
        {Array.from({ length: 8 }).map((_, i) => {
          const top = 10 + Math.random() * 80;
          const width = 30 + Math.random() * 40;
          return (
            <div 
              key={i}
              className="absolute h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent"
              style={{ 
                top: `${top}%`, 
                width: `${width}%`, 
                left: i % 2 === 0 ? '0' : 'auto',
                right: i % 2 === 0 ? 'auto' : '0',
                animationDelay: `${i * 0.5}s`,
                animation: `techLineScan ${8 + i * 2}s infinite linear`
              }}
            ></div>
          );
        })}
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 pt-4 md:pt-6 lg:pt-8">
        {/* Tech decorative header - fills empty space at top */}
        <div className="w-full mx-auto mb-4 relative premium-glass py-2 px-4 rounded-lg border border-secondary/20 hidden md:block">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-secondary/50 animate-pulse"></div>
              <span className="text-xs font-mono text-secondary/80">TECH PROFILE</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-1 w-24 bg-gray-700/50 overflow-hidden rounded-full">
                <div className="h-full w-16 bg-secondary/50"></div>
              </div>
              <span className="text-xs font-mono text-secondary/70">SYS:ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left side - Main content */}
          <div className="lg:col-span-7 space-y-4 z-10 pt-4">
            <div>
              <div className="rounded-full bg-secondary/20 w-fit px-4 py-1 mb-3 border border-secondary/20 backdrop-blur-sm">
                <p className="text-xs font-mono text-secondary flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  Junior Scientist at AIT
                </p>
              </div>
              
              <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight text-white">
                <span className="block cyan-glow">Bridging Innovation</span>
                <span className="block gradient-text">and Human Experience</span>
              </h1>
              
              <p className="hero-subtitle text-lightText/70 text-lg max-w-xl mb-4">
                Specializing in <span className="text-secondary">Human-Computer Interaction</span>, 
                <span className="text-purple-400"> XR Applications</span>, and
                <span className="text-teal-400"> UI/UX Design</span> to create seamless technological interfaces.
              </p>
              
              {/* Tech quote - fills empty space */}
              <motion.div 
                className="mb-4 py-2 px-3 border-l-2 border-secondary/50 bg-darkBg/60"
                key={currentQuote}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-lightText/90 text-sm italic">{techQuotes[currentQuote]}</p>
              </motion.div>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <motion.a 
                  href="#projects"
                  className="hero-button premium-button glow-accent"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>View My Projects</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.a>
                
                <motion.a 
                  href="#contact"
                  className="hero-button premium-button bg-transparent border-secondary/30 hover:border-secondary/50 glow-accent"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>Contact Me</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </motion.a>
              </div>
              
              {/* Data visualization element - fills empty space */}
              <DataVisualization />
              
              <div className="mt-3">
                <p className="text-xs uppercase tracking-widest mb-2 text-lightText/50 font-mono">Connect:</p>
                <div className="flex gap-3">
                  <motion.a 
                    href="https://www.linkedin.com/in/gowtham-sridher/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full glass-effect flex items-center justify-center transition-colors duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                    </svg>
                  </motion.a>
                  
                  <motion.a 
                    href="https://github.com/gowtham-sridhar" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full glass-effect flex items-center justify-center transition-colors duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </motion.a>
                  
                  <motion.a 
                    href="https://twitter.com/gowtham_sridhar" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full glass-effect flex items-center justify-center transition-colors duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Holographic Display & Profile */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Main Profile Card */}
            <motion.div
              className="relative h-[320px] lg:h-[380px] rounded-2xl overflow-hidden glass-effect-dark sci-fi-border"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                {/* Static Avatar component */}
                <StaticAvatar />
              </div>
              
              {/* Tech status indicators - around the avatar */}
              <div className="absolute top-4 left-4 tech-status z-20">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                ONLINE
              </div>
              
              {/* ID Badge - keeps basic profile info at bottom */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="premium-glass p-4 rounded-xl border border-secondary/20">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-secondary glow-accent">Gowtham Sridhar</h2>
                      <span className="text-xs font-mono text-lightText/50 bg-secondary/10 px-2 py-1 rounded-full">
                        ID: GS-0427
                      </span>
                    </div>
                    <p className="text-sm text-lightText/80">Junior Scientist at AIT</p>
                  </div>
                </div>
              </div>
              
              {/* Holographic indicator */}
              <div className="absolute top-4 right-4 z-10">
                <div className="w-16 h-16 rounded-full glass-effect-dark border border-secondary/50 flex items-center justify-center animate-glow">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-secondary/30"></div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Holographic Info Panel - Directly beneath the profile */}
            <AnimatePresence>
              {isHologramVisible && (
                <motion.div 
                  className="relative premium-glass rounded-xl border border-secondary/30 p-3 sci-fi-border premium-hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="flex items-center justify-between mb-2 border-b border-secondary/20 pb-1">
                    <h3 className="text-sm uppercase tracking-wider text-secondary font-mono">Holographic Interface</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-secondary animate-pulse"></div>
                      <span className="text-xs font-mono text-secondary/80">SCAN COMPLETE</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 holographic-info-container max-h-[200px] overflow-y-auto pr-1 relative">
                    <HolographicInfo 
                      title="SPECIALTY" 
                      info="Human-Computer Interaction | XR Applications | UI/UX Design"
                      delay={0.1}
                    />
                    <HolographicInfo 
                      title="CURRENT MISSION" 
                      info="Developing innovative interfaces for seamless human-technology integration"
                      delay={0.2}
                    />
                    <HolographicInfo 
                      title="STATUS" 
                      info="Available for collaboration and research opportunities"
                      delay={0.3}
                    />
                    <HolographicInfo 
                      title="SKILLS" 
                      info="VR/AR Development, 3D Modeling, User Research, UI/UX Prototyping"
                      delay={0.4}
                    />
                    <HolographicInfo 
                      title="PUBLICATIONS" 
                      info="5 Journal Articles, 12 Conference Papers on HCI and XR"
                      delay={0.5}
                    />
                    
                    {/* Scroll indicator */}
                    <div className="absolute bottom-0 right-0 w-5 h-10 flex justify-center">
                      <div className="w-1 h-4 rounded-full bg-secondary/40 relative">
                        <div className="absolute w-1 h-2 rounded-full bg-secondary top-0 animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Bottom tech decorations to fill space */}
      <div className="absolute left-0 right-0 bottom-0 h-16 z-[2] overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>
        <div className="absolute bottom-4 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>
        <div className="absolute bottom-8 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-secondary/10 to-transparent"></div>
        <div className="grid grid-cols-12 gap-4 px-4 md:px-12 absolute bottom-2 left-0 right-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-2 bg-secondary/20 rounded-full"></div>
          ))}
        </div>
      </div>
      
      {/* Premium banner under navbar to fill empty space */}
      <div className="absolute top-12 left-0 w-full h-16 z-[1] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>
        <div className="absolute top-4 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>
        <div className="absolute top-8 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/10 to-transparent"></div>
        
        <div className="absolute top-2 left-10 flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-secondary/50 animate-pulse"></div>
          <div className="h-2 w-2 rounded-full bg-highlight/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="h-2 w-2 rounded-full bg-secondary/20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="absolute top-2 right-10 flex items-center gap-4">
          <div className="text-[8px] font-mono text-secondary/70">SYSTEM STATUS: ONLINE</div>
          <div className="h-1 w-10 bg-gray-700/50 overflow-hidden rounded-full">
            <div className="h-full w-7 bg-secondary animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 