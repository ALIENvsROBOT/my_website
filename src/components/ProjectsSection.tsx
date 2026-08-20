"use client";

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

import { projects } from '@/data/projects';
import { trackAnalyticsEvent } from '@/lib/analytics-consent';

// Project card component with hover detail view
interface ProjectCardProps {
  project: typeof projects[0];
  index: number;
  reduceMotion: boolean | null;
  isVisible: boolean;
  isFeatured: boolean;
}

const ProjectCard = ({ project, index, reduceMotion, isVisible, isFeatured }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Toggle visibility on mobile touch
  const toggleHover = () => {
    setIsHovered(!isHovered);
    trackAnalyticsEvent('project_card_toggled', {
      project_id: String(project.id),
      next_state: isHovered ? 'collapsed' : 'expanded',
    });
  };
  
  return (
    <motion.div 
      className={`relative group overflow-hidden rounded-xl sci-fi-border glass-effect-dark aspect-square`}
      initial={reduceMotion ? { opacity: 1 } : { y: 24, opacity: 0 }}
      animate={isVisible ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.35,
        ease: 'easeOut',
        delay: reduceMotion ? 0 : Math.min(index, 5) * 0.04,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTap={toggleHover}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
    >
      <div className="relative h-full overflow-hidden">
        <Image
          src={imageError ? project.fallbackImage : project.image}
          alt={project.title}
          width={600}
          height={600}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          onError={() => setImageError(true)}
          quality={95}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={index < 3}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-90"></div>
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-15 bg-scan-lines pointer-events-none"></div>
        
        {/* Tech tags */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 z-10">
          {project.technologies.slice(0, 3).map((tech, idx) => (
            <span 
              key={idx}
              className="text-xs px-2 py-1 rounded-full glass-effect-dark text-secondary border border-zinc-500/30"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full glass-effect-dark text-secondary border border-zinc-500/30">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/65 p-4 backdrop-blur-sm">
          <h3 className="relative mb-1 truncate text-lg font-bold text-white transition-colors duration-300 group-hover:text-zinc-200">
            {project.title}
            
            {/* Decorative badge for featured projects */}
            {isFeatured && (
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 h-4 w-1 bg-secondary/60"></div>
            )}
          </h3>
          {project.date && (
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-secondary/80">
              {project.date}
            </p>
          )}
          
          <div className="flex justify-between items-center">
            <motion.a 
              href={project.link} 
              data-analytics-id={`project-${project.id}-view`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-zinc-100 transition-colors duration-300 hover:text-white"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              View Project
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.a>
            
            {isFeatured && (
              <span className="rounded-full border border-white/25 bg-white/10 px-2 py-1 text-xs text-white">
                Featured
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Hover overlay - made accessible for touch devices */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center bg-darkBg/90 flex-col p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
      >
        <p className="text-sm text-lightText/80 mb-4 line-clamp-3 text-center">
          {project.description}
        </p>
        
        <a
          href={project.link}
          data-analytics-id={`project-${project.id}-explore`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 rounded-full bg-secondary hover:bg-highlight text-white font-medium transition-colors duration-300 inline-flex items-center gap-2 pointer-events-auto sci-fi-border"
          style={{ boxShadow: '0 10px 24px rgba(39, 39, 42, 0.2)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Explore Project
        </a>
      </motion.div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  // Keep the section visible after its first reveal. Its height changes when
  // projects expand, which can otherwise make the observer hide every card.
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const reduceMotion = useReducedMotion();
  const [showAll, setShowAll] = useState(false);
  
  // Calculate how many projects to show initially
  const initialProjectCount = 6; // 3 columns x 2 rows or 2 columns x 3 rows
  
  // Project IDs are assigned chronologically, so descending order keeps the
  // newest work first even when older entries do not have exact dates.
  const sortedProjects = [...projects].sort((a, b) => b.id - a.id);
  const totalProjects = sortedProjects.length;
  const visibleProjects = showAll ? sortedProjects : sortedProjects.slice(0, initialProjectCount);
  const remainingProjects = Math.max(totalProjects - visibleProjects.length, 0);
  
  // Native button clicks work for both mouse and touch, avoiding double toggles on phones.
  const handleToggleProjects = () => {
    setShowAll((previous) => {
      const next = !previous;
      trackAnalyticsEvent('project_list_toggled', {
        next_state: next ? 'expanded' : 'collapsed',
        total_projects: totalProjects,
      });
      return next;
    });
  };

  return (
    <section id="projects" className="relative scroll-mt-28 py-20" ref={sectionRef}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-secondary"></div>
            <h2 className="text-3xl md:text-4xl font-bold px-4 gradient-text inline-block">Projects</h2>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary"></div>
          </div>
          
          <p className="text-xs uppercase tracking-[0.36em] text-secondary/75 mb-4">Selected Work</p>
          
          <p className="text-lightText/70 mt-6 max-w-2xl mx-auto">
            Explore my innovative projects spanning human-computer interaction, 
            robotics, and interactive experiences. Each project represents my 
            passion for creating meaningful technology.
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
            id="projects-grid"
          >
            <AnimatePresence initial={false}>
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  reduceMotion={reduceMotion}
                  isVisible={isInView}
                  isFeatured={index < 3}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Toggle button - extremely simplified for mobile touch */}
        <div className="text-center mt-12 relative z-10">
          {!showAll && remainingProjects > 0 && (
            <div className="mb-4 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-darkBg/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-secondary/90 shadow-lg shadow-darkBg/60">
                +{remainingProjects} more
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleToggleProjects}
            aria-expanded={showAll}
            aria-controls="projects-grid"
            className="w-full max-w-xs mx-auto min-h-[48px] py-4 px-6 bg-secondary text-white rounded-md text-lg font-medium shadow-lg active:bg-highlight"
            style={{ touchAction: 'manipulation' }}
          >
            {showAll ? 'Show fewer projects' : `Show all ${totalProjects} projects`}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 inline-block ml-2 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <AnimatePresence mode="wait">
            <motion.p
              key={showAll ? 'show-all-projects' : 'partial-projects'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 0.8, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="mt-3 text-sm text-lightText/70"
              aria-live="polite"
            >
              {showAll
                ? `Showing all ${totalProjects} projects.`
                : `Showing ${visibleProjects.length} of ${totalProjects} projects • ${remainingProjects} more available`}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
