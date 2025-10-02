import type { Metadata } from 'next';
import Link from 'next/link';
import { coreSkillLevels, spotlightSkills } from '@/data/profile';

const pageTitle = 'Skills | Gowtham Sridhar';
const pageDescription = 'Technical and research skills spanning human-computer interaction, XR development, robotics, computer vision, and machine learning.';

const skillSetJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: pageTitle,
  description: pageDescription,
  hasDefinedTerm: coreSkillLevels.map((skill) => ({
    '@type': 'DefinedTerm',
    name: skill.name,
    description: `${skill.level}% proficiency`,
  })),
};

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/skills',
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: 'https://www.gowthamsridhar.com/skills',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SkillsPage() {
  return (
    <main className="bg-darkBg text-lightText">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-lightText/60">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-lightText">Skills</li>
          </ol>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold md:text-4xl">Skills & Tools</h1>
          <p className="mt-4 max-w-3xl text-base text-lightText/80 md:text-lg">
            {pageDescription}
          </p>
        </header>

        <section aria-labelledby="proficiency-heading" className="mb-12">
          <h2 id="proficiency-heading" className="text-2xl font-semibold">Core Proficiencies</h2>
          <div className="mt-6 space-y-5">
            {coreSkillLevels.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between text-sm text-lightText/60">
                  <span className="font-medium text-lightText">{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-primary/30">
                  <div
                    className="h-2 rounded-full bg-secondary"
                    style={{ width: `${skill.level}%` }}
                    role="presentation"
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="spotlight-heading" className="mb-12">
          <h2 id="spotlight-heading" className="text-2xl font-semibold">Research Spotlight</h2>
          <p className="mt-4 text-lightText/80">
            Themes that currently guide my prototyping, research questions, and collaborations.
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {spotlightSkills.map((skill) => (
              <li key={skill} className="rounded-full border border-lightText/15 bg-primary/10 px-4 py-2 text-sm text-lightText/80">
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="learning-heading" className="rounded-xl border border-secondary/30 bg-secondary/5 p-6">
          <h2 id="learning-heading" className="text-2xl font-semibold text-secondary">Always Learning</h2>
          <p className="mt-3 text-lightText/80">
            I actively combine tangible user interfaces with AI-driven systems, experiment with multi-sensory XR interactions, and iterate on robotics workflows for safety-critical environments.
          </p>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(skillSetJsonLd) }}
      />
    </main>
  );
}



