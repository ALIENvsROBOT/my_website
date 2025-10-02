export type SkillLevel = {
  name: string;
  level: number;
};

export type ExperienceEntry = {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
};

export type EducationEntry = {
  degree: string;
  institution: string;
  period: string;
  location: string;
};

export const biographyParagraphs: string[] = [
  "Hello! I'm Gowtham Sridhar, a Junior Scientist at AIT - Center for Technology Experience in Vienna, Austria. I'm passionate about advancing my expertise at the forefront of Human-Computer Interaction, Robotics, and creating innovative interactions for the physical world.",
  "I'm committed to embracing challenging projects in robotics and human-computer interaction, employing innovative and efficient coding solutions. Working hands-on with wires and processors, I believe that intricate problems demand intelligent and streamlined approaches.",
  "Currently, I focus on prototyping XR applications, creating innovative real-world interactions with technology, researching interfaces beyond screens, and developing tangible user interfaces with hardware prototyping."
];

export const coreSkillLevels: SkillLevel[] = [
  { name: 'Human-Computer Interaction', level: 95 },
  { name: 'AI & Machine Learning', level: 95 },
  { name: 'LLM', level: 90 },
  { name: 'UI/UX Design', level: 85 },
  { name: 'Tangible User Interface', level: 75 },
  { name: 'Neural Nets', level: 70 },
  { name: 'Robotics', level: 85 },
  { name: 'XR Applications', level: 80 },
  { name: 'Physical Prototyping', level: 90 },
  { name: 'Computer Vision', level: 80 },
  { name: 'Python', level: 85 },
  { name: 'Unity', level: 75 },
  { name: 'ROS', level: 80 },
  { name: 'C++', level: 70 },
  { name: 'Embedded Systems', level: 75 }
];

export const experienceEntries: ExperienceEntry[] = [
  {
    title: 'Junior Scientist',
    company: 'AIT - Center for Technology Experience',
    period: '2023 - Present',
    location: 'Vienna, Austria',
    description: 'Prototyping XR applications, creating innovative real-world interactions with technology, researching interfaces beyond screens, and developing tangible user interfaces with hardware prototyping.'
  },
  {
    title: 'Junior Researcher',
    company: 'Salzburg Research',
    period: '2022 - 2023',
    location: 'Salzburg, Austria',
    description: 'Improved navigation systems, delivered AruCo marker detection, implemented collision avoidance for a Panda robotic arm, and created voice-controlled robot manipulation solutions.'
  },
  {
    title: 'Intern',
    company: 'E-Yantra (IIT Bombay)',
    period: '2021',
    location: 'Mumbai, India',
    description: 'Developed robot soccer automation with object tracking, image processing, navigation, multi-robot communication, path planning, and localization algorithms.'
  }
];

export const educationEntries: EducationEntry[] = [
  {
    degree: 'M.Sc. Human-Computer Interaction (Joint Degree)',
    institution: 'Paris Lodron Universitaet Salzburg & Fachhochschule Salzburg',
    period: '2022 - 2025',
    location: 'Salzburg, Austria'
  },
  {
    degree: 'B.Tech. Mechatronics Engineering',
    institution: 'Hindustan Institute of Technology and Science',
    period: '2017 - 2021',
    location: 'Chennai, India'
  }
];

export const spotlightSkills: string[] = [
  'Human-Computer Interaction',
  'Robotics',
  'XR Applications',
  'Physical Prototyping',
  'Computer Vision',
  'Python',
  'C++',
  'Unity',
  'ROS',
  'Embedded Systems',
  'Tangible User Interface',
  'Neural Nets'
];

export const researchFocusAreas: string[] = [
  'Designing multi-modal interfaces for immersive XR experiences',
  'Bridging tangible user interfaces with intelligent systems',
  'Building reliable human-robot interaction pipelines for real environments'
];

export const contactSummary = {
  email: 'gowtham.sridher5@gmail.com',
  location: 'Vienna, Austria',
  currentRole: 'Junior Scientist at AIT - Center for Technology Experience',
  availability: 'Open to research collaborations, XR prototyping engagements, and speaking opportunities'
};
