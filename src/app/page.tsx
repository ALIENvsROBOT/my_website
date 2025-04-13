"use client";

import { useState, useEffect } from 'react';
import EnhancedParticleBackground from "@/components/EnhancedParticleBackground";
import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import RedesignedHeroSection from "@/components/RedesignedHeroSection";

// Fix FOUC and ensure content always becomes visible
if (typeof window !== 'undefined') {
  // Only run this on the client side
  const html = document.documentElement;
  html.style.visibility = "hidden";
  
  // Always make content visible after a timeout
  setTimeout(() => {
    html.style.visibility = "visible";
  }, 200);
  
  // Also still listen for DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function() {
    html.style.visibility = "visible";
  });
  
  // Final safety fallback - if still hidden after 1 second, make it visible
  setTimeout(() => {
    if (html.style.visibility === "hidden") {
      html.style.visibility = "visible";
    }
  }, 1000);
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile and set up observers
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Make sure the document is visible
    document.documentElement.style.visibility = "visible";
    
    // Check if we're on a mobile device
    const checkMobile = () => {
      const isMobileDevice = typeof navigator !== 'undefined' 
        ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        : false;
      setIsMobile(isMobileDevice || window.innerWidth < 768);
    };
    
    checkMobile();
    
    // Start with a shorter loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    // Listen for window resize to adjust mobile detection
    window.addEventListener('resize', checkMobile);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Enhanced Background */}
      <EnhancedParticleBackground />
      
      {/* Custom Cursor for Desktop - only show on non-mobile */}
      {!isMobile && <CustomCursor />}
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        <div className="content-container">
          <RedesignedHeroSection />
          <AboutSection />
          <ProjectsSection />
          <ContactSection />
        </div>
        
        <Footer />
      </div>
    </main>
  );
} 