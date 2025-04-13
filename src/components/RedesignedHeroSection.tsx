import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Scene3D from './3DElements';
import { FuturisticButton, ScrollIndicator } from './FuturisticElements';
import { DecorativeCircuit } from './FuturisticElements';
import ProfileImage from './ProfileImage';

const RedesignedHeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  
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
      
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left content - Text and buttons */}
          <motion.div 
            className="lg:col-span-5 text-center lg:text-left order-2 lg:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Name and title with futuristic styling */}
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold leading-tight mb-4 neon-text"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Gowtham Sridhar
            </motion.h1>
            
            <motion.div
              className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 text-xl sm:text-2xl font-medium mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <p>HCI Researcher & XR Expert | Junior Scientist at AIT</p>
            </motion.div>
            
            {/* Animated description text */}
            <motion.p 
              className="text-gray-300 mb-10 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Enthusiastic about advancing expertise at the forefront of 
              Human-Computer Interaction, Robotics, and creating innovative interactions 
              for the physical world with intelligent and streamlined approaches.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
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
              className="mt-12 flex flex-wrap gap-2 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {['Human-Computer Interaction', 'XR Applications', 'UI/UX Design', 'Robotics', 'Computer Vision'].map((skill, index) => (
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

          {/* Middle content - Profile image */}
          <motion.div 
            className="lg:col-span-3 flex justify-center order-1 lg:order-2 mb-8 lg:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ProfileImage />
          </motion.div>
          
          {/* Right content - 3D Scene */}
          <motion.div 
            className="lg:col-span-4 order-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Scene3D isMobile={isMobile} />
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
};

export default RedesignedHeroSection; 