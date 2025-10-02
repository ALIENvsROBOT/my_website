import type { Metadata } from 'next';
import Link from 'next/link';
import {
  biographyParagraphs,
  experienceEntries,
  educationEntries,
  spotlightSkills,
  contactSummary,
} from '@/data/profile';

const pageTitle = 'About Gowtham Sridhar | HCI Researcher & XR Specialist';
const pageDescription = 'Learn about Gowtham Sridhar\'s background as a Human-Computer Interaction researcher, XR prototyper, and robotics enthusiast based in Vienna, Austria.';

const aboutProfileJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  name: pageTitle,
  url: 'https://www.gowthamsridhar.com/about',
  description: pageDescription,
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.gowthamsridhar.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: 'https://www.gowthamsridhar.com/about'
      }
    ]
  },
  mainEntity: {
    '@type': 'Person',
    name: 'Gowtham Sridhar',
    jobTitle: 'HCI Researcher & XR Specialist',
    worksFor: {
      '@type': 'Organization',
      name: 'Austrian Institute of Technology (AIT)',
      url: 'https://www.ait.ac.at/'
    },
    alumniOf: [
      'Paris Lodron Universitaet Salzburg',
      'Fachhochschule Salzburg',
      'Hindustan Institute of Technology and Science'
    ],
    knowsAbout: spotlightSkills,
    sameAs: [
      'https://www.linkedin.com/in/gowtham-sridher/',
      'https://github.com/ALIENvsROBOT',
      'https://scholar.google.com/citations?user=ipXbKeQAAAAJ'
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: contactSummary.location,
      addressCountry: 'Austria'
    }
  }
};

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: 'https://www.gowthamsridhar.com/about',
    type: 'profile',
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

export default function AboutPage() {
  return (
    <main className="bg-darkBg text-lightText">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-lightText/60">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-lightText">About</li>
          </ol>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold md:text-4xl">About Gowtham Sridhar</h1>
          <p className="mt-4 max-w-3xl text-base text-lightText/80 md:text-lg">
            {pageDescription}
          </p>
        </header>

        <section aria-labelledby="biography-heading" className="mb-12 space-y-6">
          <h2 id="biography-heading" className="text-2xl font-semibold">Biography</h2>
          {biographyParagraphs.map((paragraph, index) => (
            <p key={index} className="text-lightText/80 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </section>

        <section aria-labelledby="experience-heading" className="mb-12">
          <h2 id="experience-heading" className="text-2xl font-semibold">Professional Experience</h2>
          <div className="mt-6 space-y-6">
            {experienceEntries.map((experience) => (
              <article key={`${experience.title}-${experience.company}`} className="rounded-xl border border-lightText/10 bg-primary/5 p-6">
                <header className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                  <h3 className="text-xl font-semibold text-secondary">{experience.title}</h3>
                  <p className="text-sm text-lightText/60">{experience.period}</p>
                </header>
                <p className="mt-1 text-lightText font-medium">{experience.company}</p>
                <p className="text-sm text-lightText/60">{experience.location}</p>
                <p className="mt-3 text-lightText/80 leading-relaxed">{experience.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="education-heading" className="mb-12">
          <h2 id="education-heading" className="text-2xl font-semibold">Education</h2>
          <ul className="mt-6 space-y-4">
            {educationEntries.map((education) => (
              <li key={`${education.degree}-${education.institution}`} className="rounded-lg border border-lightText/10 bg-primary/5 p-5">
                <p className="text-lg font-semibold text-secondary">{education.degree}</p>
                <p className="text-lightText font-medium">{education.institution}</p>
                <p className="text-sm text-lightText/60">{education.location} · {education.period}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="expertise-heading" className="mb-12">
          <h2 id="expertise-heading" className="text-2xl font-semibold">Areas of Expertise</h2>
          <p className="mt-4 text-lightText/80">
            A snapshot of the disciplines and technologies I explore in my day-to-day research practice.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {spotlightSkills.map((skill) => (
              <li key={skill} className="rounded-lg border border-lightText/10 bg-primary/5 px-4 py-3 text-lightText/80">
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="collaboration-heading" className="rounded-xl border border-secondary/30 bg-secondary/5 p-6">
          <h2 id="collaboration-heading" className="text-2xl font-semibold text-secondary">Collaborate with Me</h2>
          <p className="mt-3 text-lightText/80">
            {contactSummary.availability}
          </p>
          <p className="mt-2 text-lightText/80">
            Reach me directly at{' '}
            <a href={`mailto:${contactSummary.email}`} className="text-secondary hover:underline">
              {contactSummary.email}
            </a>
            .
          </p>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutProfileJsonLd) }}
      />
    </main>
  );
}
