import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// Types for button component
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface FuturisticButtonProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
}

// Futuristic animated button with hover effects
export const FuturisticButton = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  icon = null
}: FuturisticButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const baseClasses = "relative overflow-hidden rounded-lg font-medium tracking-wider flex items-center justify-center py-3 px-6 transition-all duration-300 ease-out";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white",
    secondary: "bg-gradient-to-r from-slate-700 to-slate-900 text-white border border-slate-600",
    outline: "bg-transparent border border-indigo-500 text-indigo-500",
    ghost: "bg-transparent text-indigo-500 hover:bg-indigo-50/10"
  };
  
  return (
    <motion.button
      ref={buttonRef}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {isHovered && (
        <motion.span
          className="absolute inset-0 bg-white opacity-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </span>
      
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] bg-white"
        initial={{ width: 0 }}
        animate={{ width: isHovered ? '100%' : '0%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

interface FuturisticHeadingProps {
  children: React.ReactNode;
  accent?: string;
  className?: string;
}

// Futuristic section heading
export const FuturisticHeading = ({ children, accent = "", className = "" }: FuturisticHeadingProps) => {
  return (
    <h2 className={`relative text-3xl sm:text-4xl font-bold mb-8 inline-block ${className}`}>
      <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
        {children}
      </span>
      {accent && (
        <span className="relative z-0 text-indigo-500 ml-1.5">
          {accent}
        </span>
      )}
      <motion.span
        className="absolute -bottom-1 left-0 h-[3px] bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      />
    </h2>
  );
};

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
}

// Animated card with hover effects
export const GlassCard = ({ 
  children, 
  className = '',
  hoverEffect = true,
  delay = 0
}: GlassCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-50px" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={hoverEffect ? { y: -5 } : {}}
    >
      {hoverEffect && isHovered && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
      
      {hoverEffect && (
        <motion.div 
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
          initial={{ width: '0%' }}
          animate={{ width: isHovered ? '100%' : '0%' }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

interface AnimatedTextProps {
  text: string;
  className?: string;
}

// Animated text reveal for paragraphs
export const AnimatedText = ({ text, className = "" }: AnimatedTextProps) => {
  const controls = useAnimation();
  const textRef = useRef<HTMLParagraphElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start(i => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.03 }
          }));
        }
      },
      { threshold: 0.1 }
    );
    
    if (textRef.current) {
      observer.observe(textRef.current);
    }
    
    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, [controls]);
  
  return (
    <p ref={textRef} className={`${className}`}>
      {text.split(" ").map((word: string, i: number) => (
        <motion.span
          key={i}
          custom={i}
          initial={{ opacity: 0, y: 10 }}
          animate={controls}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
};

interface TechBadgeProps {
  tech: string;
  delay?: number;
}

// Animated tech badge/pill
export const TechBadge = ({ tech, delay = 0 }: TechBadgeProps) => {
  return (
    <motion.span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-900/50 to-violet-900/50 text-indigo-200 border border-indigo-800/30 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -3, boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)" }}
    >
      {tech}
    </motion.span>
  );
};

interface SkillBarProps {
  skill: string;
  percentage: number;
  delay?: number;
}

// Animated progress bar for skills
export const SkillBar = ({ skill, percentage, delay = 0 }: SkillBarProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-indigo-100">{skill}</span>
        <span className="text-sm font-medium text-indigo-200">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </div>
    </div>
  );
};

interface TimelineItemProps {
  year: string | number;
  title: string;
  subtitle: string;
  description: string;
  delay?: number;
}

// Animated timeline item for experience/education
export const TimelineItem = ({ 
  year, 
  title, 
  subtitle, 
  description, 
  delay = 0 
}: TimelineItemProps) => {
  return (
    <motion.div 
      className="relative pl-8 pb-8 border-l border-gray-700"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div
        className="absolute -left-2.5 mt-1.5 h-5 w-5 rounded-full border-2 border-indigo-500 bg-slate-900"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring" }}
        viewport={{ once: true }}
      />
      
      <div className="mb-1 flex items-baseline">
        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-400 mr-2">
          {year}
        </span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      
      <p className="text-sm font-medium text-gray-400 mb-2">{subtitle}</p>
      
      <p className="text-sm text-gray-300">{description}</p>
    </motion.div>
  );
};

interface DecorativeCircuitProps {
  className?: string;
}

// Futuristic decorative element
export const DecorativeCircuit = ({ className = "" }: DecorativeCircuitProps) => {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="59" stroke="url(#circuitGradient)" strokeWidth="0.5" strokeDasharray="2 3" />
        <circle cx="60" cy="60" r="40" stroke="url(#circuitGradient)" strokeWidth="0.5" strokeDasharray="2 3" />
        <path d="M60 1V20M60 100V119M1 60H20M100 60H119M16 16L30 30M104 104L90 90M16 104L30 90M104 16L90 30" stroke="url(#circuitGradient)" strokeWidth="0.5" />
        <circle cx="60" cy="60" r="4" fill="url(#circuitGradient)" />
        <defs>
          <linearGradient id="circuitGradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366F1" />
            <stop offset="1" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// No props needed for ScrollIndicator
export const ScrollIndicator = () => {
  return (
    <div className="flex flex-col items-center mt-6">
      <p className="text-xs text-indigo-400 uppercase tracking-wider mb-2">Scroll Down</p>
      <motion.div
        className="w-5 h-10 rounded-full border border-indigo-500/30 flex justify-center"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <motion.div
          className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2"
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}; 