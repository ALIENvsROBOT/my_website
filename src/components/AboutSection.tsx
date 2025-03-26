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

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
      <div className="content-container">
        <motion.h2 
          ref={headingRef}
          className={`text-3xl font-bold mb-8 text-center gradient-text ${isVisible ? 'visible' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Who Am I?
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      </div>
    </section>
  );
};

export default AboutSection; 