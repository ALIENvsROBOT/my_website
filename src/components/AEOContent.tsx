import React from 'react';

const faqItems = [
  {
    question: 'Who is Gowtham Sridhar?',
    answer:
      'Gowtham Sridhar is a Human-Computer Interaction (HCI) researcher and Junior Scientist at the Austrian Institute of Technology (AIT), focused on applied AI, XR, and robotics.'
  },
  {
    question: 'What services or expertise does Gowtham Sridhar offer?',
    answer:
      'He specializes in HCI research, AI prototyping, mixed reality design, computer vision workflows, and translating research ideas into practical interactive systems.'
  },
  {
    question: 'Where is Gowtham Sridhar based?',
    answer:
      'He is based in Vienna, Austria, and collaborates internationally with research and industry teams.'
  },
  {
    question: 'How can I contact Gowtham Sridhar for collaboration?',
    answer:
      'Use the contact page on gowthamsridhar.com or connect via LinkedIn, GitHub, Google Scholar, and ResearchGate.'
  }
];

export default function AEOContent() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section aria-labelledby="quick-facts-heading" className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-lightText/10 bg-primary/5 p-6 md:p-8">
          <h2 id="quick-facts-heading" className="text-2xl font-semibold text-lightText">
            Quick facts for collaborators and AI assistants
          </h2>
          <p className="mt-3 max-w-3xl text-lightText/80">
            This section summarizes expertise, location, and collaboration information in a concise format that is easy to read for both visitors and answer engines.
          </p>
          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-xl border border-lightText/10 bg-darkBg/50 p-4">
                <dt className="font-medium text-secondary">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-lightText/80">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
