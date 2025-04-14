"use client";

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Projects data from CV with placeholder images
const projects = [
  {
    id: 8,
    title: 'BuildsaVeR: A Virtual Reality Experience for Construction Workers safety training',
    description: 'buildsaVeR is designed to supplement safety training in the future and raise awareness of safe working practices. The biggest advantage: mistakes are completely harmless here - we promise!',
    image: '/Project_images/buildsaver.jpg',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=Robot+Navigation',
    technologies: ['XR', 'Unreal Engine', 'Game Development','Virtual Reality'],
    link: 'https://www.linkedin.com/posts/strabag_strabag-workonprogress-virtualreality-activity-7309816291601612800-nlZw?utm_source=share&utm_medium=member_desktop&rcm=ACoAACXQpi8BHxHGigkfDsMcszwOKDuyojVn8oE',
    featured: true,
  },
  {
    id: 1,
    title: 'Gaze, Gesture and Home Automation',
    description: 'An innovative system that combines eye-tracking, gesture recognition, and home automation to create a seamless smart home experience.',
    image: '/Project_images/Gaze_gesture.png',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=Gaze+and+Gesture',
    technologies: ['Computer Vision', 'IoT', 'XR', 'Machine Learning'],
    link: 'https://bit.ly/3Yk5Ssw',
    featured: true,
  },
  {
    id: 2,
    title: 'TABLE UI - TAngiBLE User Interface',
    description: 'A tangible user interface that transforms ordinary tables into interactive surfaces, enabling new forms of physical-digital interaction.',
    image: '/Project_images/Table_ui.jpg',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=TABLE+UI',
    technologies: ['Tangible UI', 'Computer Vision', 'Interactive Design'],
    link: 'https://www.linkedin.com/posts/gowtham-sridher_salz21-tech-technology-activity-7171597243039268865-Cqpp',
    featured: true,
  },
  {
    id: 3,
    title: 'EnthusiastiCan - Enthusiastic Trash Can',
    description: 'An interactive trash can that uses computer vision and gamification to encourage proper waste disposal and recycling.',
    image: '/Project_images/EnthusiastiCan.png',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=EnthusiastiCan',
    technologies: ['Computer Vision', 'IoT', 'Gamification'],
    link: 'https://www.linkedin.com/posts/gowtham-sridher_technology-computervision-hci-activity-7067467022225334272-4oqj?utm_source=share&utm_medium=member_desktop&rcm=ACoAACXQpi8BHxHGigkfDsMcszwOKDuyojVn8oE',
  },
  {
    id: 4,
    title: 'Voice Controlled Robotic Arm',
    description: 'A robotic arm that can be controlled through natural voice commands, making robot manipulation more intuitive and accessible.',
    image: '/Project_images/voice_contriolled_robot.png',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=Voice+Controlled+Arm',
    technologies: ['Speech Recognition', 'Robotics', 'Natural Language Processing'],
    link: 'https://bit.ly/423kStS',
    featured: true,
  },
  {
    id: 5,
    title: 'Multi-functional Mobile Robot',
    description: 'A versatile mobile robot platform featuring object tracking, leader-follower behavior, and tag-based navigation capabilities.',
    image: '/Project_images/multi_robot.png',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=Mobile+Robot',
    technologies: ['Robotics', 'Computer Vision', 'Machine Learning'],
    link: 'https://www.linkedin.com/posts/gowtham-sridher_tag-or-sign-navigation-robot-inspired-activity-6705461583381979137-AoLT?utm_source=share&utm_medium=member_desktop&rcm=ACoAACXQpi8BHxHGigkfDsMcszwOKDuyojVn8oE',
  },
  {
    id: 6,
    title: 'Vision-based Sorting System',
    description: 'An industrial sorting system using computer vision and a robotic manipulator for automated object recognition and sorting, designed for Industry 4.0 applications.',
    image: '/Project_images/sorting_system.png',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=Sorting+System',
    technologies: ['Robotics', 'Computer Vision', 'Industry 4.0', 'ROS'],
    link: 'https://www.linkedin.com/posts/gowtham-sridher_robotics-robots-robot-activity-6782132472672067584-YAaX',
  },
  {
    id: 7,
    title: 'Navigation & Path Planning for Mobile Robot',
    description: 'Developed advanced navigation, path planning, and motion planning capabilities for mobile robots including ARTI Chasi and Franka Panda.',
    image: '/Project_images/robot_naviagtion.png',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=Robot+Navigation',
    technologies: ['Robotics', 'Path Planning', 'ROS', 'Navigation'],
    link: 'https://bit.ly/3fAGlY5',
    featured: true,
  },

  {
    id: 9,
    title: 'EMG-Based Control of a 5 DOF Robotic Manipulator',
    description: 'Designed a system to control a 5-degree-of-freedom robotic manipulator using electromyography (EMG) signals for intuitive human-robot interaction.',
    image: '/Project_images/EMG_controil.png',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=EMG+Control',
    technologies: ['EMG', 'Robotics', 'Signal Processing', 'Human-Robot Interaction'],
    link: 'https://ieeexplore.ieee.org/document/9198439',
    featured: true,
  },
];

// Project card component with hover detail view
interface ProjectCardProps {
  project: typeof projects[0];
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Toggle visibility on mobile touch
  const toggleHover = () => {
    setIsHovered(!isHovered);
  };
  
  return (
    <motion.div 
      className={`relative group overflow-hidden rounded-xl sci-fi-border glass-effect-dark aspect-square`}
      variants={{
        hidden: { y: 50, opacity: 0 },
        visible: { 
          y: 0, 
          opacity: 1, 
          transition: { 
            duration: 0.7,
            ease: 'easeOut',
            delay: index * 0.1 
          } 
        }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTap={toggleHover}
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
        <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
        
        {/* Cyber grid overlay */}
        <div className="absolute inset-0 opacity-30 bg-scan-lines pointer-events-none"></div>
        
        {/* Tech tags */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 z-10">
          {project.technologies.slice(0, 3).map((tech, idx) => (
            <span 
              key={idx}
              className="text-xs px-2 py-1 rounded-full glass-effect-dark text-cyan-300 border border-cyan-500/30"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full glass-effect-dark text-cyan-300 border border-cyan-500/30">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
        
        {/* Project ID and status */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="glass-effect-dark p-1 rounded text-xs tracking-wider border border-secondary/20">
            <div className="flex items-center space-x-1 px-2">
              <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-green-400">PROJ-{String(project.id).padStart(3, '0')}</span>
            </div>
          </div>
        </div>
      
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-darkBg/80 backdrop-blur-sm z-10">
          <h3 className="text-lg font-bold mb-1 text-lightText group-hover:text-secondary transition-colors duration-300 cyan-glow relative truncate">
            {project.title}
            
            {/* Decorative badge for featured projects */}
            {project.featured && (
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 h-4 w-1 bg-cyan-400"></div>
            )}
          </h3>
          
          <div className="flex justify-between items-center">
            <motion.a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-100 text-sm font-medium inline-flex items-center gap-1 transition-colors duration-300"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              View Project
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.a>
            
            {project.featured && (
              <span className="text-xs px-2 py-1 rounded-full bg-highlight/20 text-highlight border border-highlight/30">
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
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 rounded-full bg-secondary hover:bg-highlight text-white font-medium transition-colors duration-300 inline-flex items-center gap-2 pointer-events-auto sci-fi-border"
          style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' }}
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
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [showAll, setShowAll] = useState(false);
  
  // Featured projects (display them first)
  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);
  
  // All projects or just first 6
  const displayedProjects = showAll ? projects : projects.slice(0, 6);

  return (
    <section id="projects" className="py-20 relative" ref={sectionRef}>
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
            <h2 className="text-3xl md:text-4xl font-bold px-4 gradient-text inline-block cyan-glow">Projects</h2>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary"></div>
          </div>
          
          <div className="mb-4 flex items-center justify-center">
            <div className="h-px bg-gradient-to-r from-transparent via-secondary to-transparent w-20"></div>
            <span className="px-4 text-xs tracking-widest text-secondary uppercase cyber-glitch mx-2" data-text="Neural Interface">Neural Interface</span>
            <div className="h-px bg-gradient-to-r from-secondary via-transparent to-transparent w-20"></div>
          </div>
          
          <p className="text-lightText/70 mt-6 max-w-2xl mx-auto">
            Explore my innovative projects spanning human-computer interaction, 
            robotics, and interactive experiences. Each project represents my 
            passion for creating meaningful technology.
          </p>
        </motion.div>

        {/* Main projects grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {displayedProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
        
        {/* Toggle button */}
        <div className="text-center mt-12">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 rounded-full glass-effect-dark hover:bg-secondary/20 text-lightText font-medium transition-all duration-300 inline-flex items-center gap-2 sci-fi-border"
          >
            {showAll ? 'Show Less' : 'Show More Projects'} 
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection; 