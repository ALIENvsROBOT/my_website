"use client";

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import {
  biographyParagraphs as ABOUT_PARAGRAPHS,
  coreSkillLevels as skills,
  experienceEntries as experiences,
  educationEntries as education,
  spotlightSkills as SKILLS,
} from '@/data/profile';

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
      // Extract tab parameter from the hash if present
      const hash = window.location.hash;
      if (hash.includes('?tab=')) {
        const tabParam = hash.split('?tab=')[1];
        // Activate the tab based on the parameter
        if (tabParam === 'experience' || tabParam === 'education' || tabParam === 'about') {
          console.log('Setting active tab to:', tabParam);
          setActiveTab(tabParam);
        }
      } else if (hash === '#about') {
        // When the hash is exactly '#about' (Profile link), set to the 'about' tab
        console.log('Setting active tab to: about (Profile)');
        setActiveTab('about');
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

  // Update URL when tabs are clicked directly
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    // Update URL without scrolling
    if (tab === 'about') {
      window.history.pushState(null, '', '#about');
    } else {
      window.history.pushState(null, '', `#about?tab=${tab}`);
    }
  };

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
              onClick={() => handleTabClick('about')}
            >
              About
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm ${activeTab === 'experience' ? 'bg-secondary text-white' : 'text-lightText/70 hover:text-white'}`}
              onClick={() => handleTabClick('experience')}
            >
              Experience
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm ${activeTab === 'education' ? 'bg-secondary text-white' : 'text-lightText/70 hover:text-white'}`}
              onClick={() => handleTabClick('education')}
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
                      <span className="text-indigo-400" aria-hidden="true">{String.fromCharCode(0x25B9)}</span>
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
                        <span className="text-indigo-400 mr-2" aria-hidden="true">{String.fromCodePoint(0x1F393)}</span>
                        <span className="font-semibold">{edu.degree}</span>
                      </div>
                      <div className="ml-6 text-lightText/70">
                        {edu.institution}
                      </div>
                      <div className="ml-6 text-xs text-lightText/50">
                        {edu.period} {String.fromCharCode(0x2022)} {edu.location}
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
                    <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl" aria-hidden="true">{String.fromCodePoint(0x1F393)}</div>
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
