import type { Metadata } from 'next';
import Link from 'next/link';
import { experienceEntries, researchFocusAreas } from '@/data/profile';

const pageTitle = 'Experience | Gowtham Sridhar';
const pageDescription = 'Professional experience of Gowtham Sridhar covering XR prototyping, human-robot interaction, and applied human-computer interaction research in Austria and beyond.';

const experienceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: pageTitle,
  description: pageDescription,
  itemListElement: experienceEntries.map((experience, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Role',
      roleName: experience.title,
      startDate: experience.period.split(' - ')[0],
      endDate: experience.period.includes('Present') ? undefined : experience.period.split(' - ')[1],
      employer: {
        '@type': 'Organization',
        name: experience.company,
      },
      location: {
        '@type': 'Place',
        address: experience.location,
      },
      description: experience.description,
    }
  })),
};

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/experience',
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: 'https://www.gowthamsridhar.com/experience',
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

export default function ExperiencePage() {
  return (
    <main className="bg-darkBg text-lightText">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-lightText/60">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-lightText">Experience</li>
          </ol>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold md:text-4xl">Experience</h1>
          <p className="mt-4 max-w-3xl text-base text-lightText/80 md:text-lg">
            {pageDescription}
          </p>
        </header>

        <section aria-labelledby="timeline-heading" className="space-y-6">
          <h2 id="timeline-heading" className="text-2xl font-semibold">Career Timeline</h2>
          <ol className="relative border-l border-lightText/20 pl-6">
            {experienceEntries.map((experience, index) => (
              <li key={`${experience.title}-${experience.company}`} className="mb-8 ml-2">
                <div className="absolute left-[-11px] mt-1 h-5 w-5 rounded-full border-2 border-secondary bg-darkBg" aria-hidden="true" />
                <div className="rounded-lg border border-lightText/10 bg-primary/5 p-5">
                  <header className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                    <h3 className="text-xl font-semibold text-secondary">{experience.title}</h3>
                    <p className="text-sm text-lightText/60">{experience.period}</p>
                  </header>
                  <p className="mt-1 text-lightText font-medium">{experience.company}</p>
                  <p className="text-sm text-lightText/60">{experience.location}</p>
                  <p className="mt-3 text-lightText/80 leading-relaxed">{experience.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="focus-heading" className="mt-12">
          <h2 id="focus-heading" className="text-2xl font-semibold">Research Focus Areas</h2>
          <p className="mt-4 text-lightText/80">
            Beyond hands-on prototyping, I explore how immersive technologies and intelligent systems augment human capabilities.
          </p>
          <ul className="mt-6 space-y-3">
            {researchFocusAreas.map((focus) => (
              <li key={focus} className="rounded-lg border border-lightText/10 bg-primary/5 px-4 py-3 text-lightText/80">
                {focus}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(experienceJsonLd) }}
      />
    </main>
  );
}
