"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  SiArduino,
  SiCplusplus,
  SiDocker,
  SiGit,
  SiHuggingface,
  SiKubernetes,
  SiLinux,
  SiNvidia,
  SiOpencv,
  SiOpenai,
  SiPython,
  SiReact,
  SiRaspberrypi,
  SiTensorflow,
  SiThreedotjs,
  SiUnity,
  SiUnrealengine,
} from "react-icons/si";

type SkillLogo = {
  label: string;
  icon: IconType;
};

const PRIMARY_ROW: SkillLogo[] = [
  { label: "Applied AI", icon: SiOpenai },
  { label: "LLM Inferencing", icon: SiHuggingface },
  { label: "Python", icon: SiPython },
  { label: "TensorFlow", icon: SiTensorflow },
  { label: "Computer Vision", icon: SiOpencv }
];

const SECONDARY_ROW: SkillLogo[] = [
  { label: "CUDA", icon: SiNvidia },
  { label: "C++", icon: SiCplusplus },
  { label: "Linux", icon: SiLinux },
  { label: "Robotics", icon: SiArduino },
  { label: "HW Interfaces", icon: SiRaspberrypi },
  { label: "Git", icon: SiGit },
];

const TERTIARY_ROW: SkillLogo[] = [
  { label: "XR Prototyping", icon: SiUnity },
  { label: "Unreal Engine", icon: SiUnrealengine },
  { label: "Three.js", icon: SiThreedotjs },
  { label: "React", icon: SiReact },
  { label: "Docker", icon: SiDocker },
  { label: "Kubernetes", icon: SiKubernetes },
];

const Row = ({ skills, reverse = false, duration = 34 }: { skills: SkillLogo[]; reverse?: boolean; duration?: number }) => {
  const repeated = [...skills, ...skills];

  return (
    <div className="skills-loop-row">
      <div
        className={`skills-loop-track ${reverse ? "is-reverse" : ""}`}
        style={{ "--logo-loop-duration": `${duration}s` } as CSSProperties}
      >
        {repeated.map((skill, index) => {
          const Icon = skill.icon;
          return (
            <div key={`${skill.label}-${index}`} className="skills-loop-chip">
              <Icon className="skills-loop-icon" aria-hidden="true" />
              <span>{skill.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SkillsLogoLoop = () => {
  return (
    <motion.div
      className="skills-loop-shell"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="skills-loop-rows">
        <Row skills={PRIMARY_ROW} duration={30} />
        <Row skills={SECONDARY_ROW} reverse duration={33} />
        <Row skills={TERTIARY_ROW} duration={36} />
      </div>
    </motion.div>
  );
};

export default SkillsLogoLoop;
