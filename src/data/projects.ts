export type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  fallbackImage: string;
  technologies: string[];
  link: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: 8,
    title: 'BuildsaVeR: A Virtual Reality Experience for Construction Workers safety training',
    description: 'buildsaVeR is designed to supplement safety training in the future and raise awareness of safe working practices. The biggest advantage: mistakes are completely harmless here - we promise!',
    image: '/Project_images/buildsaver.jpg',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=Robot+Navigation',
    technologies: ['XR', 'Unreal Engine', 'Game Development', 'Virtual Reality'],
    link: 'https://www.linkedin.com/posts/strabag_strabag-workonprogress-virtualreality-activity-7309816291601612800-nlZw?utm_source=share&utm_medium=member_desktop&rcm=ACoAACXQpi8BHxHGigkfDsMcszwOKDuyojVn8oE',
    featured: true
  },
  {
    id: 1,
    title: 'Gaze, Gesture and Home Automation',
    description: 'An innovative system that combines eye-tracking, gesture recognition, and home automation to create a seamless smart home experience.',
    image: '/Project_images/Gaze_gesture.png',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=Gaze+and+Gesture',
    technologies: ['Computer Vision', 'IoT', 'XR', 'Machine Learning'],
    link: 'https://bit.ly/3Yk5Ssw',
    featured: true
  },
  {
    id: 2,
    title: 'TABLE UI - TAngiBLE User Interface',
    description: 'A tangible user interface that transforms ordinary tables into interactive surfaces, enabling new forms of physical-digital interaction.',
    image: '/Project_images/Table_ui.jpg',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=TABLE+UI',
    technologies: ['Tangible UI', 'Computer Vision', 'Interactive Design'],
    link: 'https://www.linkedin.com/posts/gowtham-sridher_salz21-tech-technology-activity-7171597243039268865-Cqpp',
    featured: true
  },
  {
    id: 3,
    title: 'EnthusiastiCan - Enthusiastic Trash Can',
    description: 'An interactive trash can that uses computer vision and gamification to encourage proper waste disposal and recycling.',
    image: '/Project_images/EnthusiastiCan.png',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=EnthusiastiCan',
    technologies: ['Computer Vision', 'IoT', 'Gamification'],
    link: 'https://www.linkedin.com/posts/gowtham-sridher_technology-computervision-hci-activity-7067467022225334272-4oqj?utm_source=share&utm_medium=member_desktop&rcm=ACoAACXQpi8BHxHGigkfDsMcszwOKDuyojVn8oE'
  },
  {
    id: 4,
    title: 'Voice Controlled Robotic Arm',
    description: 'A robotic arm that can be controlled through natural voice commands, making robot manipulation more intuitive and accessible.',
    image: '/Project_images/voice_contriolled_robot.png',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=Voice+Controlled+Arm',
    technologies: ['Speech Recognition', 'Robotics', 'Natural Language Processing'],
    link: 'https://bit.ly/423kStS',
    featured: true
  },
  {
    id: 5,
    title: 'Multi-functional Mobile Robot',
    description: 'A versatile mobile robot platform featuring object tracking, leader-follower behavior, and tag-based navigation capabilities.',
    image: '/Project_images/multi_robot.png',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=Mobile+Robot',
    technologies: ['Robotics', 'Computer Vision', 'Machine Learning'],
    link: 'https://www.linkedin.com/posts/gowtham-sridher_tag-or-sign-navigation-robot-inspired-activity-6705461583381979137-AoLT?utm_source=share&utm_medium=member_desktop&rcm=ACoAACXQpi8BHxHGigkfDsMcszwOKDuyojVn8oE'
  },
  {
    id: 6,
    title: 'Vision-based Sorting System',
    description: 'An industrial sorting system using computer vision and a robotic manipulator for automated object recognition and sorting, designed for Industry 4.0 applications.',
    image: '/Project_images/sorting_system.png',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=Sorting+System',
    technologies: ['Robotics', 'Computer Vision', 'Industry 4.0', 'ROS'],
    link: 'https://www.linkedin.com/posts/gowtham-sridher_robotics-robots-robot-activity-6782132472672067584-YAaX'
  },
  {
    id: 7,
    title: 'Navigation & Path Planning for Mobile Robot',
    description: 'Developed advanced navigation, path planning, and motion planning capabilities for mobile robots including ARTI Chasi and Franka Panda.',
    image: '/Project_images/robot_naviagtion.png',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=Robot+Navigation',
    technologies: ['Robotics', 'Path Planning', 'ROS', 'Navigation'],
    link: 'https://bit.ly/3fAGlY5',
    featured: true
  },
  {
    id: 9,
    title: 'EMG-Based Control of a 5 DOF Robotic Manipulator',
    description: 'Designed a system to control a 5-degree-of-freedom robotic manipulator using electromyography (EMG) signals for intuitive human-robot interaction.',
    image: '/Project_images/EMG_controil.png',
    fallbackImage: 'https://placehold.co/600x350/3d4463/ffffff?text=EMG+Control',
    technologies: ['EMG', 'Robotics', 'Signal Processing', 'Human-Robot Interaction'],
    link: 'https://ieeexplore.ieee.org/document/9198439',
    featured: true
  }
];
