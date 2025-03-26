"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#about', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Determine which section is currently in view
      const sections = navLinks.map(link => link.href.substring(1));
      
      // Find the lowest position (closest to the top of the viewport) section that's visible
      let currentSection = 'home';
      let minDistance = Infinity;
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Consider a section in view if its top is within 150px of the top of the viewport
          // or if its bottom is visible and it's closer than the previous candidate
          const distance = Math.abs(rect.top);
          if ((rect.top <= 150 && rect.bottom > 0) && distance < minDistance) {
            minDistance = distance;
            currentSection = section;
          }
        }
      });
      
      setActiveSection(currentSection);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      let targetId = href.substring(1);
      
      // Special case for Experience link
      if (href === '#about' && e.currentTarget.textContent === 'Experience') {
        // Set a custom hash that includes 'experience' to trigger the Experience tab
        window.history.pushState(null, '', '#about?tab=experience');
        targetId = 'about';
      } else {
        // Update URL hash without scrolling
        window.history.pushState(null, '', href);
      }
      
      const element = document.getElementById(targetId);
      if (element) {
        const offsetPosition = element.getBoundingClientRect().top + window.scrollY - 100;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Set active section manually to avoid flicker
        setActiveSection(targetId);
      }
      // Close the mobile menu if it's open
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-darkBg/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto px-4 md:px-6 py-2">
        <div className="flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2" onClick={(e) => handleNavClick(e, '#home')}>
            <motion.div
              className="relative w-10 h-10 rounded-full bg-gradient-to-r from-secondary to-highlight flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <span className="text-lightText font-bold text-xl">GS</span>
              <div className="absolute -inset-1 rounded-full opacity-30 animate-glow"></div>
            </motion.div>
            <span className="font-bold text-xl hidden sm:block gradient-text">Gowtham Sridhar</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-lightText/90 hover:text-lightText text-sm font-medium transition-colors duration-300 group ${
                  activeSection === link.href.substring(1) ? 'text-lightText' : 'text-lightText/70'
                }`}
                onClick={(e) => handleNavClick(e, link.href)}
                aria-current={activeSection === link.href.substring(1) ? 'page' : undefined}
              >
                {link.label}
                <motion.span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300 ${
                    activeSection === link.href.substring(1) ? 'w-full' : 'w-0'
                  }`}
                  animate={{ width: activeSection === link.href.substring(1) ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </a>
            ))}
            <a
              href="/Gowtham_Sridhar_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-secondary hover:bg-highlight text-white text-sm font-medium transition-colors duration-300 flex items-center gap-1"
              aria-label="Download CV"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              CV
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-full hover:bg-primary/20 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-lightText"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden glass-effect m-4 overflow-hidden rounded-2xl"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="flex flex-col space-y-3 p-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-lightText/90 hover:text-lightText text-lg font-medium py-2 transition-colors duration-300 ${
                  activeSection === link.href.substring(1) ? 'text-lightText font-semibold' : 'text-lightText/70'
                }`}
                onClick={(e) => handleNavClick(e, link.href)}
                aria-current={activeSection === link.href.substring(1) ? 'page' : undefined}
              >
                {link.label}
                {activeSection === link.href.substring(1) && (
                  <span className="ml-2 inline-block w-1 h-1 rounded-full bg-secondary"></span>
                )}
              </a>
            ))}
            <a
              href="/Gowtham_Sridhar_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-4 py-2 rounded-full bg-secondary hover:bg-highlight text-white text-sm font-medium transition-colors duration-300 flex items-center gap-1 w-fit"
              aria-label="Download CV"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              CV
            </a>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar; 