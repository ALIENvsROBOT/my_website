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

      {/* Keep answer-engine facts in the HTML without changing the visual portfolio layout. */}
      <section className="sr-only" data-ai-content="quick-facts">
        <h2>Quick facts for collaborators and AI assistants</h2>
        <p>
          This section summarizes expertise, location, and collaboration information in a concise format that is easy to read for both visitors and answer engines.
        </p>
        <dl>
          {faqItems.map((item) => (
            <div key={item.question}>
              <dt>{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
