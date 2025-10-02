import EnhancedSEO from '@/components/EnhancedSEO';
import { biographyParagraphs, spotlightSkills, experienceEntries, contactSummary, researchFocusAreas } from '@/data/profile';
import { projects } from '@/data/projects';

const pageTitle = 'Gowtham Sridhar | HCI Researcher & XR Expert';
const pageDescription = 'Portfolio of Gowtham Sridhar, Junior Scientist at AIT specializing in Human-Computer Interaction, XR applications, robotics, and tangible interfaces.';
const pageUrl = 'https://www.gowthamsridhar.com';

export default function HomeSeoContent() {
  const spotlightProjects = projects.slice(0, 3);

  return (
    <section className="bg-darkBg text-lightText border-t border-lightText/10 px-4 py-16 sm:px-6 lg:px-8">
      <EnhancedSEO
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        pageUrl={pageUrl}
        pagePath=""
      />

      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <header>
          <h2 className="text-2xl font-bold md:text-3xl">Accessible Portfolio Overview</h2>
          <p className="mt-3 text-lightText/80">
            {pageDescription}
          </p>
        </header>

        <section aria-labelledby="home-bio" className="space-y-4">
          <h3 id="home-bio" className="text-xl font-semibold">Who I Am</h3>
          {biographyParagraphs.slice(0, 2).map((paragraph, index) => (
            <p key={index} className="text-lightText/75 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </section>

        <section aria-labelledby="home-skills" className="space-y-3">
          <h3 id="home-skills" className="text-xl font-semibold">Key Disciplines</h3>
          <p className="text-lightText/75">
            Core areas that shape my research and prototyping practice:
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {spotlightSkills.map((skill) => (
              <li key={skill} className="rounded-md border border-lightText/10 bg-primary/10 px-3 py-2 text-sm text-lightText/80">
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="home-experience" className="space-y-3">
          <h3 id="home-experience" className="text-xl font-semibold">Recent Roles</h3>
          <dl className="space-y-3">
            {experienceEntries.slice(0, 2).map((experience) => (
              <div key={`${experience.title}-${experience.company}`} className="rounded-md border border-lightText/10 bg-primary/10 p-4">
                <dt className="font-medium text-secondary">{experience.title} · {experience.company}</dt>
                <dd className="text-sm text-lightText/70">
                  {experience.period} · {experience.location}
                </dd>
                <dd className="mt-2 text-lightText/75 leading-relaxed">
                  {experience.description}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="home-projects" className="space-y-3">
          <h3 id="home-projects" className="text-xl font-semibold">Featured Initiatives</h3>
          <p className="text-lightText/75">
            A snapshot of current or recent work that blends immersive technology with human-centred design:
          </p>
          <ul className="space-y-3">
            {spotlightProjects.map((project) => (
              <li key={project.id} className="rounded-md border border-lightText/10 bg-primary/10 p-4">
                <p className="font-medium text-secondary">{project.title}</p>
                <p className="text-sm text-lightText/70">{project.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="home-focus" className="space-y-3">
          <h3 id="home-focus" className="text-xl font-semibold">Current Research Focus</h3>
          <ul className="list-disc space-y-2 pl-5 text-lightText/75">
            {researchFocusAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="home-contact" className="space-y-2">
          <h3 id="home-contact" className="text-xl font-semibold">Connect</h3>
          <p className="text-lightText/75">
            {contactSummary.availability}
          </p>
          <p className="text-lightText/75">
            Email: <a href={`mailto:${contactSummary.email}`} className="text-secondary hover:underline">{contactSummary.email}</a> · Based in {contactSummary.location}.
          </p>
        </section>
      </div>
    </section>
  );
}
