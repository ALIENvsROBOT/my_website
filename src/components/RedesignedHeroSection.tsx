"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Scene3D from './3DElements';
import { FuturisticButton, ScrollIndicator } from './FuturisticElements';
import ProfileImage from './ProfileImage';

const RedesignedHeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);

  useEffect(() => {
    const checkDeviceCapabilities = () => {
      // Check screen size for mobile detection
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);

      // Check for low performance devices (conservative approach)
      const isLowPerf = isMobileDevice ||
        // Detect older browsers/devices through user agent or renderer info
        (navigator.userAgent.includes('Android') && !navigator.userAgent.includes('Chrome/')) ||
        // iOS devices with older versions
        (navigator.userAgent.includes('iPad') || navigator.userAgent.includes('iPhone')) &&
        !navigator.userAgent.includes('CriOS');

      setIsLowPerformanceDevice(isLowPerf);
    };

    // Initial check
    checkDeviceCapabilities();

    // Add event listener
    window.addEventListener('resize', checkDeviceCapabilities);

    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceCapabilities);
  }, []);

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-28 pb-10 md:pb-14 my-0 border-0">
      <div className="grid-bg"></div>

      <div className="w-full max-w-[1620px] mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        <motion.div
          className="hero-shell rounded-[2rem] p-5 md:p-8 lg:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <div className="hidden lg:block hero-divider" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 md:gap-9 lg:gap-12 items-stretch">
              {/* Left content - Text and Profile */}
              <motion.div
                className="hero-copy order-1 h-full flex flex-col justify-between px-2 sm:px-3 md:px-4 lg:px-6 py-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Profile image - smaller and integrated */}
                  <motion.div
                    className="flex-shrink-0 w-[142px] h-[142px] md:w-[162px] md:h-[162px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <ProfileImage />
                  </motion.div>

                  {/* Name and title with futuristic styling */}
                  <div className="flex-grow">
                    <motion.h1
                      className="text-[clamp(2rem,3.2vw,3.05rem)] font-bold leading-[1.08] mb-1 neon-text tracking-tight text-center md:text-left"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                    >
                      Gowtham Sridhar
                    </motion.h1>

                    <motion.div
                      className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-700 text-base md:text-lg font-medium mb-2 text-center md:text-left"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                    >
                      <p>Applied AI & HCI Researcher | Junior Scientist at AIT</p>
                    </motion.div>
                  </div>
                </div>

                {/* Animated description text */}
                <motion.p
                  className="hero-futuristic-copy my-6 max-w-[42rem] text-[1.07rem] md:text-[1.18rem]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  Obsessed with HCI and AI, I craft intuitive interfaces powered by smart, ethical intelligence that predict needs, reduce friction, and make complex systems feel effortless. Design + AI = delightful experiences that practically read your mind.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-wrap gap-3 sm:gap-4 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <FuturisticButton onClick={scrollToProjects} className="w-full sm:w-auto min-h-[54px] px-8 text-[1.27rem]">
                    View Projects
                  </FuturisticButton>

                  <FuturisticButton
                    variant="outline"
                    onClick={scrollToContact}
                    className="w-full sm:w-auto min-h-[54px] px-8 text-[1.27rem]"
                  >
                    Contact Me
                  </FuturisticButton>
                </motion.div>

                {/* Tech skills badges */}
                <motion.div
                  className="flex flex-wrap gap-2.5 mb-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  {['Applied AI', 'HCI', 'UI/UX Design', 'Robotics', 'XR'].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[0.95rem] font-medium bg-white/88 text-zinc-700 border border-zinc-300/80 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + (index * 0.1), duration: 0.4 }}
                      whileHover={{ y: -3, boxShadow: "0 10px 20px rgba(39, 39, 42, 0.14)" }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right content - 3D Scene */}
              <motion.div
                className="hero-3d-wrap order-2 h-[48vh] sm:h-[52vh] md:h-[60vh] lg:h-full min-h-[330px] sm:min-h-[380px] md:min-h-[470px] lg:min-h-[560px] w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="hero-panel h-full w-full rounded-3xl p-1.5 md:p-2">
                  <Scene3D isMobile={isMobile || isLowPerformanceDevice} />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-4 md:mt-8 hidden sm:flex justify-center opacity-80"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <ScrollIndicator />
        </motion.div>
      </div>
    </section>
  );
};

export default RedesignedHeroSection; 
