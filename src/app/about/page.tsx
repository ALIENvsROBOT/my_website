import type { Metadata } from 'next';
import Link from 'next/link';
import ProfileImage from '@/components/ProfileImage';
import {
  biographyParagraphs,
  experienceEntries,
  educationEntries,
  spotlightSkills,
  contactSummary,
  profileBasics,
  profileHighlights,
  professionalStats,
  profileSocialLinks,
  languagesSpoken,
} from '@/data/profile';

const pageTitle = 'About Gowtham Sridhar | HCI Researcher & Applied AI Specialist';
const pageDescription = 'Learn about Gowtham Sridhar\'s background as a Human-Computer Interaction researcher, Applied AI expert, XR prototyper, and robotics enthusiast based in Vienna, Austria.';
const pageUrl = 'https://www.gowthamsridhar.com/about';

const aboutProfileJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${pageUrl}#profile`,
  name: pageTitle,
  url: pageUrl,
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
        item: pageUrl
      }
    ]
  },
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://www.gowthamsridhar.com/#person',
    name: profileBasics.name,
    alternateName: profileBasics.headline,
    description: pageDescription,
    jobTitle: profileBasics.jobTitle,
    image: profileBasics.image,
    url: profileBasics.website,
    email: `mailto:${profileBasics.email}`,
    sameAs: profileBasics.sameAs,
    nationality: profileBasics.nationality,
    worksFor: {
      '@type': 'Organization',
      name: profileBasics.employer.name,
      url: profileBasics.employer.url
    },
    employer: {
      '@type': 'Organization',
      name: profileBasics.employer.name,
      url: profileBasics.employer.url
    },
    workLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: profileBasics.location.city,
        addressCountry: profileBasics.location.country
      }
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: profileBasics.location.city,
      addressCountry: profileBasics.location.country
    },
    alumniOf: educationEntries.map((education) => ({
      '@type': 'CollegeOrUniversity',
      name: education.institution
    })),
    knowsAbout: spotlightSkills,
    knowsLanguage: languagesSpoken,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Professional',
      email: profileBasics.email,
      areaServed: 'Global'
    },
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: 'Human-Computer Interaction Researcher',
        description: 'Designs multi-modal experiences that combine XR, tangible interfaces, and robotics to support real-world problem solving.'
      }
    ]
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
    url: pageUrl,
    type: 'profile',
    images: [
      {
        url: profileBasics.image,
        width: 1200,
        height: 630,
        alt: 'Gowtham Sridhar portrait'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: [profileBasics.image]
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

        <section className="mb-16 grid gap-12 lg:grid-cols-[minmax(240px,280px)_1fr] lg:items-center">
          <div className="mx-auto max-w-xs lg:mx-0">
            <ProfileImage />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-secondary/80">{profileBasics.jobTitle}</p>
              <h1 className="mt-4 text-3xl font-bold md:text-4xl">{profileBasics.name}</h1>
              <p className="mt-4 text-lightText/80 leading-relaxed">
                {pageDescription}
              </p>
            </div>

            <ul className="grid gap-3">
              {profileHighlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 text-lightText/80">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-secondary/60" aria-hidden="true" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="grid gap-4 sm:grid-cols-3">
              {professionalStats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-lightText/10 bg-primary/5 p-4">
                  <p className="text-2xl font-semibold text-secondary">{stat.value}</p>
                  <p className="mt-1 text-sm font-medium text-lightText">{stat.label}</p>
                  <p className="mt-2 text-xs text-lightText/60">{stat.description}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-lightText/60">Professional Links</h2>
              <ul className="mt-3 flex flex-wrap gap-3">
                {profileSocialLinks.map((social) => (
                  <li key={social.url}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-secondary/30 px-4 py-2 text-sm text-secondary transition-colors hover:border-secondary hover:text-lightText"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

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
                <p className="text-sm text-lightText/60">{education.location} - {education.period}</p>
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

        <section aria-labelledby="languages-heading" className="mb-12">
          <h2 id="languages-heading" className="text-2xl font-semibold">Languages</h2>
          <p className="mt-4 text-lightText/80">
            Communicating research outcomes and project insights across international teams.
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {languagesSpoken.map((language) => (
              <li key={language} className="rounded-full border border-lightText/15 bg-primary/10 px-4 py-2 text-sm text-lightText/80">
                {language}
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
