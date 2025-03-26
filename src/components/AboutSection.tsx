"use client";

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

// Define the skills data
const skills = [
  { name: 'Human-Computer Interaction', level: 90 },
  { name: 'Robotics', level: 85 },
  { name: 'XR Applications', level: 80 },
  { name: 'Physical Prototyping', level: 75 },
  { name: 'Computer Vision', level: 70 },
  { name: 'Python', level: 85 },
  { name: 'Unity', level: 70 },
  { name: 'ROS', level: 80 },
];

// Experience data
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
    description: 'Improved navigation systems, developed collision avoidance for robotic arms, and created voice-controlled robot manipulation solutions.',
  },
  {
    title: 'Intern',
    company: 'E-Yantra (IIT Bombay)',
    period: '2021',
    location: 'Mumbai, India',
    description: 'Worked on robot soccer project using webots and ROS to make robots play soccer game autonomously with advanced algorithms.',
  },
];

// Education data
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

// Text content for paragraphs
const ABOUT_PARAGRAPHS = [
  "Hello! I'm Gowtham Sridhar, a passionate software developer with expertise in building modern web applications. I specialize in React, Next.js, and TypeScript, creating responsive and interactive user experiences.",
  "With a strong foundation in JavaScript and modern frontend frameworks, I enjoy turning complex problems into simple, beautiful, and intuitive interfaces.",
  "I also have experience with backend technologies including Node.js, Express, and database systems like MongoDB and PostgreSQL."
];

// Skills list
const SKILLS = ["React", "TypeScript", "Next.js", "Node.js", "CSS/SCSS", "Tailwind CSS", "UI/UX Design", "Responsive Design"];

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
              <h3 className="text-xl font-bold mb-4 text-purple-300">Education & Certifications</h3>
              <ul className="space-y-2">
                <li>🎓 B.Tech in Computer Science</li>
                <li>📜 Advanced React & Redux - Certification</li>
                <li>📜 Full Stack Web Development - Certification</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 