import type { Metadata } from 'next';
import Link from 'next/link';
import { contactSummary, researchFocusAreas } from '@/data/profile';

const pageTitle = 'Contact | Gowtham Sridhar';
const pageDescription = 'Reach Gowtham Sridhar for collaborations in human-computer interaction, XR prototyping, robotics research, and speaking engagements.';

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: pageTitle,
  description: pageDescription,
  url: 'https://www.gowthamsridhar.com/contact',
  mainEntity: {
    '@type': 'Person',
    name: 'Gowtham Sridhar',
    email: `mailto:${contactSummary.email}`,
    jobTitle: contactSummary.currentRole,
    address: {
      '@type': 'PostalAddress',
      addressLocality: contactSummary.location,
      addressCountry: 'Austria'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Business',
      email: contactSummary.email,
      areaServed: 'Global'
    },
    sameAs: [
      'https://www.linkedin.com/in/gowtham-sridher/',
      'https://github.com/ALIENvsROBOT'
    ]
  }
};

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: 'https://www.gowthamsridhar.com/contact',
    type: 'website',
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

export default function ContactPage() {
  return (
    <main className="bg-transparent text-zinc-900">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-lightText/60">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-lightText">Contact</li>
          </ol>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold md:text-4xl">Contact</h1>
          <p className="mt-4 max-w-3xl text-base text-lightText/80 md:text-lg">
            {pageDescription}
          </p>
        </header>

        <section aria-labelledby="connect-heading" className="mb-10 page-card p-6">
          <h2 id="connect-heading" className="text-2xl font-semibold">Connect Directly</h2>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-sm uppercase tracking-wide text-lightText/60">Email</dt>
              <dd>
                <a href={`mailto:${contactSummary.email}`} className="text-secondary hover:underline">
                  {contactSummary.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-wide text-lightText/60">Current Role</dt>
              <dd className="text-lightText/80">{contactSummary.currentRole}</dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-wide text-lightText/60">Location</dt>
              <dd className="text-lightText/80">{contactSummary.location}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="interests-heading" className="mb-10">
          <h2 id="interests-heading" className="text-2xl font-semibold">Collaboration Interests</h2>
          <p className="mt-3 text-lightText/80">I am especially excited about:</p>
          <ul className="mt-4 space-y-3">
            {researchFocusAreas.map((item) => (
              <li key={item} className="page-card-soft px-4 py-3 text-lightText/80">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="social-heading" className="mb-10 page-card p-6">
          <h2 id="social-heading" className="text-2xl font-semibold">Connect With Me</h2>
          <p className="mt-3 text-lightText/80">Let&apos;s connect on social platforms or check out my projects:</p>
          <div className="mt-4 flex flex-col sm:grid sm:grid-cols-2 gap-4">
            <a
              href="https://www.linkedin.com/in/gowtham-sridher/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative isolate overflow-hidden flex items-center gap-3 p-4 rounded-xl border border-zinc-300/80 bg-white/78 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-500/45 hover:shadow-[0_16px_28px_-22px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/45"
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-zinc-200/45 via-transparent to-zinc-300/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="pointer-events-none absolute -left-12 top-0 h-full w-10 -skew-x-12 bg-white/60 opacity-0 blur-sm transition-all duration-500 group-hover:left-[110%] group-hover:opacity-100" />
              <div className="relative p-2.5 bg-zinc-200/75 border border-zinc-300/70 rounded-full flex-shrink-0 transition-colors duration-300 group-hover:bg-zinc-300/80">
                <svg className="w-6 h-6 text-zinc-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </div>
              <div className="relative">
                <p className="text-sm font-semibold text-zinc-800">LinkedIn</p>
                <p className="text-xs text-lightText/70">Professional Network</p>
              </div>
              <span className="relative ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-400/70 bg-zinc-200/85 text-zinc-700 opacity-0 translate-x-1 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 14.707a1 1 0 010-1.414L12.586 11H7a1 1 0 110-2h5.586l-2.293-2.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </a>

            <a
              href="https://github.com/ALIENvsROBOT"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative isolate overflow-hidden flex items-center gap-3 p-4 rounded-xl border border-zinc-300/80 bg-white/78 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-500/45 hover:shadow-[0_16px_28px_-22px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/45"
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-zinc-200/45 via-transparent to-zinc-300/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="pointer-events-none absolute -left-12 top-0 h-full w-10 -skew-x-12 bg-white/60 opacity-0 blur-sm transition-all duration-500 group-hover:left-[110%] group-hover:opacity-100" />
              <div className="relative p-2.5 bg-zinc-200/75 border border-zinc-300/70 rounded-full flex-shrink-0 transition-colors duration-300 group-hover:bg-zinc-300/80">
                <svg className="w-6 h-6 text-zinc-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <div className="relative">
                <p className="text-sm font-semibold text-zinc-800">GitHub</p>
                <p className="text-xs text-lightText/70">Code &amp; Projects</p>
              </div>
              <span className="relative ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-400/70 bg-zinc-200/85 text-zinc-700 opacity-0 translate-x-1 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 14.707a1 1 0 010-1.414L12.586 11H7a1 1 0 110-2h5.586l-2.293-2.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </a>
          </div>
        </section>

        <section aria-labelledby="availability-heading" className="page-card-emphasis p-6">
          <h2 id="availability-heading" className="text-2xl font-semibold text-secondary">Let&apos;s Collaborate</h2>
          <p className="mt-3 text-lightText/80">
            {contactSummary.availability}
          </p>
          <p className="mt-2 text-lightText/80">
            Prefer async updates? Drop a note on LinkedIn or GitHub and I will follow up within two working days.
          </p>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
    </main>
  );
}
