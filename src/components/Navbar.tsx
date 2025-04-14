"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const navLinks = [
  { href: '#home', label: 'Home' },
  { 
    href: '#about', 
    label: 'About', 
    subLinks: [
      { href: '#about', label: 'Profile' },
      { href: '#about?tab=experience', label: 'Experience' },
      { href: '#about?tab=education', label: 'Education' }
    ]
  },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [customCursorEnabled, setCustomCursorEnabled] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for cursor preference
    const cursorDisabled = localStorage.getItem('custom-cursor-disabled') === 'true';
    setCustomCursorEnabled(!cursorDisabled);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Determine which section is currently in view
      // Extract all section ids (including main sections and tabs)
      const sections = navLinks.flatMap(link => 
        link.subLinks 
          ? [link.href.substring(1), ...link.subLinks.map(sub => sub.href.substring(1))]
          : [link.href.substring(1)]
      );
      
      // Improved algorithm for detecting the active section during scrolling
      let currentSection = 'home';
      
      // First, check if any section is fully in the viewport (with offset for navbar)
      const navbarHeight = 100;
      
      sections.forEach(section => {
        // For sections with query params (like #about?tab=experience), just get the base section
        const baseSection = section.split('?')[0];
        const element = document.getElementById(baseSection);
        
        if (element) {
          const rect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          // Check if the section is in the viewport
          // A section is considered active if:
          // 1. Its top is at or just past the navbar
          // 2. OR it fills most of the viewport
          // 3. OR we're near the bottom of the page and it's the last fully visible section
          
          if (
            // Top of section is just past navbar but still visible
            (rect.top >= navbarHeight && rect.top < viewportHeight * 0.5) ||
            // Section covers most of the viewport 
            (rect.top <= navbarHeight && rect.bottom > viewportHeight * 0.5) ||
            // We're at the bottom of the page
            (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100
          ) {
            currentSection = section;
            // Return early if we found a perfect match
            if (rect.top >= navbarHeight && rect.top < viewportHeight * 0.3) {
              return;
            }
          }
        }
      });
      
      // Check if we need to update the current tab/section
      const urlHash = window.location.hash;
      if (urlHash.includes('?tab=')) {
        // If URL has a tab parameter, use that to set active section
        setActiveSection(urlHash.slice(1)); // Remove the # character
      } else {
        setActiveSection(currentSection);
      }
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
      
      // Handle any tab parameter in the URL
      if (href.includes('?tab=')) {
        // Set the URL hash with the tab parameter to trigger the right tab
        window.history.pushState(null, '', href);
        // Extract the base section ID (part before the ?)
        targetId = href.substring(1).split('?')[0];
        
        // Trigger a hashchange event to ensure components listening for hash changes respond
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      } else {
        // Update URL hash without scrolling
        window.history.pushState(null, '', href);
        
        // Special handling for #about (Profile) to ensure it switches to the about tab
        if (href === '#about') {
          // Trigger a hashchange event to ensure the About component reacts
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        }
      }
      
      const element = document.getElementById(targetId);
      if (element) {
        const offsetPosition = element.getBoundingClientRect().top + window.scrollY - 100;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Set active section to the full href (including any tab parameter)
        setActiveSection(href.substring(1));
      }
      // Close the mobile menu and dropdown if they're open
      setIsMenuOpen(false);
      setOpenDropdown(null);
    }
  };

  const toggleCustomCursor = () => {
    const newState = !customCursorEnabled;
    setCustomCursorEnabled(newState);
    localStorage.setItem('custom-cursor-disabled', (!newState).toString());
    // Force reload to apply changes
    window.location.reload();
  };

  const toggleDropdown = (href: string) => {
    if (openDropdown === href) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(href);
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
          <a href="#home" className="flex items-center gap-2 pl-2 md:pl-4" onClick={(e) => handleNavClick(e, '#home')}>
            <motion.div
              className="relative w-10 h-10 rounded-full bg-gradient-to-r from-secondary to-highlight flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <span className="text-lightText font-bold text-xl">GS</span>
              <div className="absolute -inset-1 rounded-full opacity-30 animate-glow"></div>
            </motion.div>
            <span className="font-bold text-xl hidden sm:block gradient-text ml-2">Gowtham Sridhar</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              return (
                <div key={link.href} className="relative group">
                  {link.subLinks ? (
                    <>
                      {openDropdown === link.href ? (
                        <button
                          className={`relative text-lightText/90 hover:text-lightText text-sm font-medium transition-colors duration-300 flex items-center gap-1 ${
                            activeSection.startsWith(link.href.substring(1)) ? 'text-lightText' : 'text-lightText/70'
                          }`}
                          onClick={() => toggleDropdown(link.href)}
                          aria-expanded="true"
                          aria-haspopup="menu"
                        >
                          {link.label}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <motion.span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300 ${
                              activeSection.startsWith(link.href.substring(1)) ? 'w-full' : 'w-0'
                            }`}
                            animate={{ width: activeSection.startsWith(link.href.substring(1)) ? '100%' : '0%' }}
                            transition={{ duration: 0.3 }}
                          />
                        </button>
                      ) : (
                        <button
                          className={`relative text-lightText/90 hover:text-lightText text-sm font-medium transition-colors duration-300 flex items-center gap-1 ${
                            activeSection.startsWith(link.href.substring(1)) ? 'text-lightText' : 'text-lightText/70'
                          }`}
                          onClick={() => toggleDropdown(link.href)}
                          aria-expanded="false"
                          aria-haspopup="menu"
                        >
                          {link.label}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <motion.span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300 ${
                              activeSection.startsWith(link.href.substring(1)) ? 'w-full' : 'w-0'
                            }`}
                            animate={{ width: activeSection.startsWith(link.href.substring(1)) ? '100%' : '0%' }}
                            transition={{ duration: 0.3 }}
                          />
                        </button>
                      )}
                      
                      {openDropdown === link.href && (
                        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg glass-effect overflow-hidden z-10">
                          <div className="py-1">
                            {link.subLinks.map((subLink) => (
                              <a
                                key={subLink.href}
                                href={subLink.href}
                                className={`block px-4 py-2 text-sm text-lightText/90 hover:bg-secondary/10 ${
                                  activeSection === subLink.href.substring(1) ? 'bg-secondary/10' : ''
                                }`}
                                onClick={(e) => handleNavClick(e, subLink.href)}
                              >
                                {subLink.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                href={link.href}
                      className={`relative text-lightText/90 hover:text-lightText text-sm font-medium transition-colors duration-300 ${
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
                  )}
                </div>
              );
            })}
            <a
              href="https://drive.google.com/file/d/1ztgsTwIDreJ4ABvrDL8VsZEGR5EWF_4c/view?usp=sharing"
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
            
            {/* Cursor Toggle */}
            <button
              type="button"
              onClick={toggleCustomCursor}
              className="p-2 rounded-full hover:bg-primary/20 transition-colors duration-300"
              aria-label={customCursorEnabled ? "Disable custom cursor" : "Enable custom cursor"}
              title={customCursorEnabled ? "Disable custom cursor" : "Enable custom cursor"}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-lightText" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {customCursorEnabled ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 10.75L15.5 12.75L18.5 9.75M15 15l-2 5L9 9l11 4-5 2zm0 0" />
                )}
              </svg>
            </button>
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
            {navLinks.map((link) => {
              return (
                <div key={link.href} className="flex flex-col">
                  {link.subLinks ? (
                    <>
                      {openDropdown === link.href ? (
                        <button
                          className={`text-lightText/90 hover:text-lightText text-lg font-medium py-2 transition-colors duration-300 flex items-center justify-between ${
                            activeSection.startsWith(link.href.substring(1)) ? 'text-lightText font-semibold' : 'text-lightText/70'
                          }`}
                          onClick={() => toggleDropdown(link.href)}
                          aria-expanded="true"
                        >
                          <span>{link.label}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform rotate-180`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          className={`text-lightText/90 hover:text-lightText text-lg font-medium py-2 transition-colors duration-300 flex items-center justify-between ${
                            activeSection.startsWith(link.href.substring(1)) ? 'text-lightText font-semibold' : 'text-lightText/70'
                          }`}
                          onClick={() => toggleDropdown(link.href)}
                          aria-expanded="false"
                        >
                          <span>{link.label}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      
                      {openDropdown === link.href && (
                        <div className="ml-4 mt-1 border-l-2 border-secondary/30 pl-4 flex flex-col space-y-2">
                          {link.subLinks.map((subLink) => (
                            <a
                              key={subLink.href}
                              href={subLink.href}
                              className={`text-lightText/90 hover:text-lightText text-base py-1 transition-colors duration-300 ${
                                activeSection === subLink.href.substring(1) ? 'text-lightText font-medium' : 'text-lightText/70'
                              }`}
                              onClick={(e) => handleNavClick(e, subLink.href)}
                            >
                              {subLink.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a
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
                  )}
                </div>
              );
            })}
            <a
              href="https://drive.google.com/file/d/1ztgsTwIDreJ4ABvrDL8VsZEGR5EWF_4c/view?usp=sharing"
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
            
            {/* Mobile cursor toggle */}
            <button
              type="button"
              onClick={toggleCustomCursor}
              className="mt-2 px-4 py-2 rounded-full bg-primary/20 text-lightText text-sm font-medium transition-colors duration-300 flex items-center gap-2 w-fit"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {customCursorEnabled ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 10.75L15.5 12.75L18.5 9.75M15 15l-2 5L9 9l11 4-5 2zm0 0" />
                )}
              </svg>
              {customCursorEnabled ? "Default Cursor" : "Custom Cursor"}
            </button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar; 