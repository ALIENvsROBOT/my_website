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
    <main className="bg-darkBg text-lightText">
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

        <section aria-labelledby="connect-heading" className="mb-10 rounded-xl border border-lightText/10 bg-primary/5 p-6">
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
              <li key={item} className="rounded-lg border border-lightText/10 bg-primary/5 px-4 py-3 text-lightText/80">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="availability-heading" className="rounded-xl border border-secondary/30 bg-secondary/5 p-6">
          <h2 id="availability-heading" className="text-2xl font-semibold text-secondary">Let's Collaborate</h2>
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
