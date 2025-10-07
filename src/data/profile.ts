import type { StaticImageData } from 'next/image';

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

export type AwardEntry = {
  title: string;
  issuer: string;
  year: string;
  description: string;
  image: string | StaticImageData;
  fallbackImage?: string | StaticImageData;
  highlight?: string;
  link?: string;
};

export type ProfileBasics = {
  name: string;
  headline: string;
  jobTitle: string;
  employer: {
    name: string;
    url: string;
    department?: string;
  };
  image: string;
  location: {
    city: string;
    country: string;
  };
  nationality: string;
  website: string;
  email: string;
  sameAs: string[];
};

export const profileBasics: ProfileBasics = {
  name: 'Gowtham Sridhar',
  headline: 'Human-Computer Interaction Researcher and Applied AI Specialist',
  jobTitle: 'Junior Scientist, Center for Technology Experience',
  employer: {
    name: 'Austrian Institute of Technology (AIT)',
    url: 'https://www.ait.ac.at/'
  },
  image: 'https://www.gowthamsridhar.com/images/shareLinkprofile.png',
  location: {
    city: 'Vienna',
    country: 'Austria'
  },
  nationality: 'Indian',
  website: 'https://www.gowthamsridhar.com',
  email: 'gowtham.sridher5@gmail.com',
  sameAs: [
    'https://www.linkedin.com/in/gowtham-sridher/',
    'https://github.com/ALIENvsROBOT',
    'https://scholar.google.com/citations?user=ipXbKeQAAAAJ',
    'https://x.com/gowtham_sridhar'
  ]
};

export const biographyParagraphs: string[] = [
  "Hello! I'm Gowtham Sridhar, a Junior Scientist at AIT - Center for Technology Experience in Vienna, Austria. I'm passionate about advancing my expertise at the forefront of Human-Computer Interaction, Robotics, and creating innovative interactions for the physical world.",
  "I'm committed to embracing challenging projects in robotics and human-computer interaction, employing innovative and efficient coding solutions. Working hands-on with wires and processors, I believe that intricate problems demand intelligent and streamlined approaches.",
  "Currently, I focus on prototyping XR applications, creating innovative real-world interactions with technology, researching interfaces beyond screens, and developing tangible user interfaces with hardware prototyping."
];

export const profileHighlights: string[] = [
  'Translates complex research into XR prototypes that can be validated with industry partners.',
  'Bridges tangible interfaces, robotics, and AI to design multi-sensory user journeys.',
  'Active contributor to academic and industry collaborations across Europe and India.'
];

export const professionalStats: { label: string; value: string; description: string }[] = [
  { label: 'Years in HCI and XR research', value: '6+', description: 'Delivering prototypes and studies across Europe and India.' },
  { label: 'Prototypes delivered', value: '25+', description: 'Immersive training tools, tangible interfaces, and robotics workflows.' },
  { label: 'Research publications and talks', value: '18', description: 'Shared through conferences, industry showcases, and invited lectures.' }
];

export const languagesSpoken: string[] = ['English', 'German', 'Tamil'];

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

export const awardsAndRecognitions: AwardEntry[] = [
  {
    title: 'eAward 2025: Best digitalization projects from business and administration awarded',
    issuer: 'report.at',
    year: '2025',
    description: 'The eAward business prize honors digitalization projects and has been awarded since 2005. And the "eAward 2025" also shows the possibilities of information technology when redesigning business processes. These are all nominees.',
    image: 'https://www.report.at/images/2025eAwardcMilenaKrobath_281.jpg',
    highlight: 'Winner',
    link: 'https://www.linkedin.com/posts/austrian-institute-of-technology_ait-buildsavr-eaward-activity-7379184705994297344-vsi-?utm_source=share&utm_medium=member_desktop&rcm=ACoAACXQpi8BHxHGigkfDsMcszwOKDuyojVn8oE'
  },
  {
    title: 'Schmiede 2024 hallein salzburg. Intuitve User Interface project',
    issuer: 'salzburger nachrichten',
    year: '2024',
    description: 'Got featured in the news article for the Intuitve User Interface project',
    image: '/reward_images/news_salzburg_sept_2024.png',
    highlight: 'News article',
    link: 'https://pressreader.com/article/281844354017503'
  },
  {
    title: "Master's graduation",
    issuer: 'Paris Lodron Universitaet Salzburg and Fachhochschule Salzburg',
    year: '2025',
    description: "Master's graduation Human-Computer Interaction (Joint Degree)",
    image: '/reward_images/graduation.jpeg',
    highlight: 'Graduation',
    link: 'https://www.linkedin.com/posts/gowtham-sridher_im-happy-to-share-that-ive-completed-my-activity-7299182381213622272-qPdd?utm_source=share&utm_medium=member_desktop&rcm=ACoAACXQpi8BHxHGigkfDsMcszwOKDuyojVn8oE'
  },

  {
    title: 'Best paper award',
    issuer: 'IVC RAISE 2020 conference',
    year: '2020',
    description: 'Best paper award for the paper for Autonomous Robotic Exploration and Navigation System using Tri-layered Mapping and Geometrical Path Planning Techniques',
    image: '/reward_images/Best_paper_2020.jpg',
    highlight: 'Best paper award',
    link: 'https://www.linkedin.com/posts/gowtham-sridher_best-paper-award-i-would-like-to-thank-activity-6747807508599062528-cjwH?utm_source=share&utm_medium=member_desktop&rcm=ACoAACXQpi8BHxHGigkfDsMcszwOKDuyojVn8oE'
  },
];


export const spotlightSkills: string[] = [
  'Human-Computer Interaction',
  'AI Inferencing',
  'LLM',
  'LangChain',
  'Ollama',
  'vLLM',
  'Fine-tuning',
  'Creating innovative interaction in physical world',
  'AI automation',
  'RAG',
  'Physical Prototyping',
  'Python',
  'C++',
  'Embedded Systems',
  'Computer Vision',
  'Robotics',
  'Neural Nets',
  'Docker',
  'Server',
  'Game engine'
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

export const profileSocialLinks: { label: string; url: string }[] = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/gowtham-sridher/' },
  { label: 'GitHub', url: 'https://github.com/ALIENvsROBOT' },
  { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=ipXbKeQAAAAJ' },
  { label: 'ResearchGate', url: 'https://www.researchgate.net/profile/Gowtham-Sridhar' }
];
