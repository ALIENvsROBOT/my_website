"use client";

import { useState, useEffect } from 'react';
import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

// Fix FOUC and ensure content always becomes visible
if (typeof window !== 'undefined') {
  // Only run this on the client side
  const html = document.documentElement;
  html.style.visibility = "hidden";
  
  // Always make content visible after a timeout, even if DOMContentLoaded doesn't fire
  setTimeout(() => {
    html.style.visibility = "visible";
  }, 300);
  
  // Also still listen for DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function() {
    html.style.visibility = "visible";
  });
  
  // Final safety fallback - if still hidden after 2 seconds, make it visible
  setTimeout(() => {
    if (html.style.visibility === "hidden") {
      html.style.visibility = "visible";
    }
  }, 2000);
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
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    
    // Set up intersection observer for reveal animations
    const observeTextElements = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });
      
      const elements = document.querySelectorAll('.reveal-text');
      elements.forEach(element => {
        observer.observe(element);
      });
      
      return () => {
        elements.forEach(element => {
          observer.unobserve(element);
        });
      };
    };
    
    // Add mousemove event listener for interactive background effects (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle orb movement for better performance
      if (!window.requestAnimationFrame) return;
      
      window.requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        const x = clientX / window.innerWidth;
        const y = clientY / window.innerHeight;
        
        // Update CSS variables for cursor position
        document.documentElement.style.setProperty('--cursor-x', x.toString());
        document.documentElement.style.setProperty('--cursor-y', y.toString());
        
        // Find orbs and add parallax effect - limit to 3 elements only
        const orbs = document.querySelectorAll('.orb');
        const orbCount = Math.min(orbs.length, 3);
        
        for (let i = 0; i < orbCount; i++) {
          const orb = orbs[i] as HTMLElement;
          const speed = 0.1 + (i * 0.05);
          const xOffset = (x - 0.5) * 50 * speed;
          const yOffset = (y - 0.5) * 50 * speed;
          orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        }
      });
    };
    
    // Start with a much shorter loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      // After loading, initialize observers and event listeners
      observeTextElements();
      
      // Only add mouse effects on desktop
      if (!isMobile) {
        window.addEventListener('mousemove', handleMouseMove);
      }
    }, 100);
    
    // Listen for window resize to adjust mobile detection
    window.addEventListener('resize', checkMobile);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);
  
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Background Effects */}
      <ParticleBackground />
      
      {/* Custom Cursor for Desktop - only show on non-mobile */}
      {!isMobile && <CustomCursor />}
      
      {/* Content - Remove loading screen for immediate content display */}
      <div className="relative z-10">
        <Navbar />
        
        <div className="content-container">
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <ContactSection />
        </div>
        
        <Footer />
      </div>
    </main>
  );
} 