"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Scene3D from './3DElements';
import { FuturisticButton, ScrollIndicator } from './FuturisticElements';
import { DecorativeCircuit } from './FuturisticElements';
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
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden py-0 my-0 border-0">
      {/* Decorative elements */}
      <DecorativeCircuit className="top-10 left-10 opacity-40" />
      <DecorativeCircuit className="bottom-10 right-10 opacity-30" />

      {/* Grid background */}
      <div className="grid-bg"></div>

      <div className="container mx-auto px-6 sm:px-8 md:px-12 relative z-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left content - Text and Profile */}
          <motion.div
            className="order-2 lg:order-1 pl-0 md:pl-4 lg:pl-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile image - smaller and integrated */}
              <motion.div
                className="flex-shrink-0 w-[120px] h-[120px] md:w-[140px] md:h-[140px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <ProfileImage />
              </motion.div>

              {/* Name and title with futuristic styling */}
              <div className="flex-grow">
                <motion.h1
                  className="text-3xl font-bold leading-tight mb-1 neon-text text-center md:text-left"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Gowtham Sridhar
                </motion.h1>

                <motion.div
                  className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 text-lg font-medium mb-2 text-center md:text-left"
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
              className="text-gray-300 my-5 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Obsessed with HCI and AI — I craft intuitive interfaces powered by smart, ethical intelligence that predict needs, reduce friction, and make complex systems feel effortless. Design + AI = delightful experiences that practically read your mind.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <FuturisticButton onClick={scrollToProjects}>
                View Projects
              </FuturisticButton>

              <FuturisticButton
                variant="outline"
                onClick={scrollToContact}
              >
                Contact Me
              </FuturisticButton>
            </motion.div>

            {/* Tech skills badges */}
            <motion.div
              className="flex flex-wrap gap-2 mb-16 md:mb-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {['Applied AI', 'HCI', 'UI/UX Design', 'Robotics', 'XR'].map((skill, index) => (
                <motion.span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-900/30 text-indigo-200 border border-indigo-800/30 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + (index * 0.1), duration: 0.4 }}
                  whileHover={{ y: -3, boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)" }}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right content - 3D Scene (expanded to 1:1 ratio) */}
          <motion.div
            className="order-1 lg:order-2 h-[50vh] lg:h-[80vh] w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Scene3D isMobile={isMobile || isLowPerformanceDevice} />
          </motion.div>
        </div>

        {/* Scroll indicator - adjusted for mobile */}
        <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-20">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
};

export default RedesignedHeroSection; 