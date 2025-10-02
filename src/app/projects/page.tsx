import type { Metadata } from 'next';
import Link from 'next/link';
import { projects } from '@/data/projects';

const pageTitle = 'Projects | Gowtham Sridhar';
const pageDescription = 'Explore Gowtham Sridhar\'s XR, robotics, and human-computer interaction projects, from mixed reality training tools to intelligent robotic systems.';

const projectListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: pageTitle,
  description: pageDescription,
  itemListElement: projects.map((project, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      url: project.link,
      keywords: project.technologies.join(', '),
    }
  })),
};

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: 'https://www.gowthamsridhar.com/projects',
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

export default function ProjectsPage() {
  return (
    <main className="bg-darkBg text-lightText">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-lightText/60">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-lightText">Projects</li>
          </ol>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold md:text-4xl">Highlighted Projects</h1>
          <p className="mt-4 max-w-3xl text-base text-lightText/80 md:text-lg">
            {pageDescription}
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.id} className="flex h-full flex-col justify-between rounded-xl border border-lightText/10 bg-primary/5 p-6">
              <div>
                <header>
                  <h2 className="text-2xl font-semibold text-secondary">{project.title}</h2>
                  <p className="mt-3 text-lightText/80 leading-relaxed">
                    {project.description}
                  </p>
                </header>
                <ul className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-secondary/80">
                  {project.technologies.map((tech) => (
                    <li key={`${project.id}-${tech}`} className="rounded-full border border-secondary/40 px-3 py-1">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-secondary hover:underline"
                >
                  View project details
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectListJsonLd) }}
      />
    </main>
  );
}
