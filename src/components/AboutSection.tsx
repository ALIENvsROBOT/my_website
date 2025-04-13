"use client";

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

// Define the skills data based on CV
const skills = [
  { name: 'Human-Computer Interaction', level: 90 },
  { name: 'Robotics', level: 85 },
  { name: 'XR Applications', level: 80 },
  { name: 'Physical Prototyping', level: 85 },
  { name: 'Computer Vision', level: 80 },
  { name: 'Python', level: 85 },
  { name: 'Unity', level: 75 },
  { name: 'ROS', level: 80 },
  { name: 'C++', level: 70 },
  { name: 'Embedded Systems', level: 75 },
];

// Experience data from CV
const experiences = [
  {
    title: 'Junior Scientist',
    company: 'AIT - Center for Technology Experience',
    period: '2023 - Present',
    location: 'Vienna, Austria',
    description: 'Working on prototyping XR applications, creating innovative real-world interaction with technology, researching on User Interface for beyond screens, Tangible User Interface and hardware prototyping.',
  },
  {
    title: 'Junior Researcher',
    company: 'Salzburg Research',
    period: '2022 - 2023',
    location: 'Salzburg, Austria',
    description: 'Improved navigation systems, navigating ARTI Chasi robot using overhead camera, developed AruCo marker detection, implemented collision avoidance for panda robotic arm, and created voice-controlled robot manipulation solutions.',
  },
  {
    title: 'Intern',
    company: 'E-Yantra (IIT Bombay)',
    period: '2021',
    location: 'Mumbai, India',
    description: 'Worked on robot soccer project using webots and ROS to make robots play soccer game autonomously with object tracking, image processing, navigation, multi-robot communication, path planning and localization algorithms.',
  },
];

// Education data from CV
const education = [
  {
    degree: 'M.Sc. Human-Computer Interaction (Joint Degree)',
    institution: 'Paris Lodron Universität Salzburg & Fachhochschule Salzburg',
    period: '2022 - 2025',
    location: 'Salzburg, Austria',
  },
  {
    degree: 'B.Tech. Mechatronics Engineering',
    institution: 'Hindustan Institute of Technology and Science',
    period: '2017 - 2021',
    location: 'Chennai, India',
  },
];

// Text content for paragraphs based on CV
const ABOUT_PARAGRAPHS = [
  "Hello! I'm Gowtham Sridhar, a Junior Scientist at AIT - Center for Technology Experience in Vienna, Austria. I'm passionate about advancing my expertise at the forefront of Human-Computer Interaction, Robotics, and creating innovative interactions for the physical world.",
  "I'm committed to embracing challenging projects in robotics and human-computer interaction, employing innovative and efficient coding solutions. Working hands-on with wires and processors, I believe that intricate problems demand intelligent and streamlined approaches.",
  "Currently, I focus on prototyping XR applications, creating innovative real-world interactions with technology, researching interfaces beyond screens, and developing tangible user interfaces with hardware prototyping."
];

// Skills list based on CV
const SKILLS = ["Human-Computer Interaction", "Robotics", "XR Applications", "Physical Prototyping", "Computer Vision", "Python", "C++", "Unity", "ROS", "Embedded Systems", "Tangible User Interface", "Neural Nets"];

// Define Experience type based on the experience data structure
type Experience = {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
};

// Experience timeline component
const ExperienceTimeline = ({ experiences }: { experiences: Experience[] }) => (
  <div className="space-y-6 mt-4">
    {experiences.map((experience, index) => (
      <motion.div
        key={index}
        className="relative pl-6 border-l-2 border-secondary/30"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="absolute w-4 h-4 rounded-full bg-secondary left-[-9px] top-0"></div>
        <div className="mb-1">
          <h4 className="text-lg font-semibold text-secondary">{experience.title}</h4>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <p className="text-lightText font-medium">{experience.company}</p>
            <div className="flex items-center gap-2 text-xs text-lightText/60">
              <span className="bg-secondary/10 px-2 py-1 rounded">{experience.period}</span>
              <span>|</span>
              <span>{experience.location}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-lightText/70 mt-2">{experience.description}</p>
      </motion.div>
    ))}
  </div>
);

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('about'); // 'about', 'experience', 'education'

  // Effect to check if section is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Check URL hash to set active tab when section loads or hash changes
  useEffect(() => {
    const checkHash = () => {
      // If the hash contains tab=experience, activate the experience tab
      if (window.location.hash.includes('tab=experience')) {
        setActiveTab('experience');
      }
    };
    
    // Check hash when component mounts
    checkHash();
    
    // Add event listener for hash changes
    window.addEventListener('hashchange', checkHash);
    
    return () => {
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section 
      id="about" 
      className="section-container light-up-section py-20"
      ref={sectionRef}
    >
      <div className="content-container mx-auto">
        <motion.h2 
          ref={headingRef}
          className={`text-3xl font-bold mb-8 text-center gradient-text ${isVisible ? 'visible' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          About Me
        </motion.h2>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="glass-effect p-1 rounded-full inline-flex">
            <button 
              className={`px-4 py-2 rounded-full text-sm ${activeTab === 'about' ? 'bg-secondary text-white' : 'text-lightText/70 hover:text-white'}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm ${activeTab === 'experience' ? 'bg-secondary text-white' : 'text-lightText/70 hover:text-white'}`}
              onClick={() => setActiveTab('experience')}
            >
              Experience
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm ${activeTab === 'education' ? 'bg-secondary text-white' : 'text-lightText/70 hover:text-white'}`}
              onClick={() => setActiveTab('education')}
            >
              Education
            </button>
          </div>
        </div>
        
        {/* About Tab Content */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-6">
            <div className="space-y-4">
              {ABOUT_PARAGRAPHS.map((text, index) => (
                <motion.p 
                  key={index}
                  className="text-white/80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  {text}
                </motion.p>
              ))}
            </div>
            
            <div className="space-y-4">
              <motion.div 
                className="glass-effect p-6 rounded-lg sci-fi-border"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-xl font-bold mb-4 text-cyan-300 cyan-glow">Skills & Expertise</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {SKILLS.map((skill, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                    >
                      <span className="text-indigo-400">▹</span>
                      <span>{skill}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                className="glass-effect-dark p-6 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="text-xl font-bold mb-4 text-purple-300">Education</h3>
                <ul className="space-y-3">
                  {education.map((edu, index) => (
                    <li key={index} className="text-sm">
                      <div className="flex items-center">
                        <span className="text-indigo-400 mr-2">🎓</span>
                        <span className="font-semibold">{edu.degree}</span>
                      </div>
                      <div className="ml-6 text-lightText/70">
                        {edu.institution}
                      </div>
                      <div className="ml-6 text-xs text-lightText/50">
                        {edu.period} • {edu.location}
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        )}
        
        {/* Experience Tab Content */}
        {activeTab === 'experience' && (
          <motion.div 
            className="max-w-3xl mx-auto px-4 md:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-effect-dark p-6 rounded-lg sci-fi-border">
              <h3 className="text-xl font-bold mb-6 text-cyan-300 cyan-glow text-center">Work Experience</h3>
              <ExperienceTimeline experiences={experiences} />
            </div>
          </motion.div>
        )}
        
        {/* Education Tab Content */}
        {activeTab === 'education' && (
          <motion.div 
            className="max-w-3xl mx-auto px-4 md:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-effect-dark p-6 rounded-lg sci-fi-border">
              <h3 className="text-xl font-bold mb-6 text-purple-300 text-center">Educational Background</h3>
              
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  className="mb-8 last:mb-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl">
                      🎓
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold gradient-text">{edu.degree}</h4>
                      <p className="text-lightText/80">{edu.institution}</p>
                    </div>
                  </div>
                  
                  <div className="ml-16">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="glass-effect text-xs px-3 py-1 rounded-full">
                        {edu.period}
                      </div>
                      <div className="glass-effect text-xs px-3 py-1 rounded-full">
                        {edu.location}
                      </div>
                    </div>
                    
                    <div className="h-px w-full bg-gradient-to-r from-purple-500/30 to-transparent my-4"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AboutSection; 