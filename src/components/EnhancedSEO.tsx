/**
 * @file EnhancedSEO.tsx
 * @description Injects JSON-LD Structured Data Schema into the page head.
 * Optimized for React 19 / Next.js 16 to avoid hydration mismatches.
 */

import React from 'react';

interface EnhancedSEOProps {
  pageTitle: string;
  pageDescription: string;
  pageUrl: string;
  pagePath: string; // e.g. 'projects', 'about', etc.
  imageUrl?: string;
}

/**
 * EnhancedSEO Component
 * Generates valid Schema.org markup for better Google Search visibility.
 */
export default function EnhancedSEO({
  pageTitle,
  pageDescription,
  pageUrl,
  pagePath,
  imageUrl = 'https://www.gowthamsridhar.com/images/shareLinkprofile.png',
}: EnhancedSEOProps) {

  // Website Schema Definition
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gowtham Sridhar - HCI Researcher & AI Expert',
    url: 'https://www.gowthamsridhar.com',
    description: 'Portfolio of Gowtham Sridhar, Junior Scientist at AIT specializing in Human-Computer Interaction, XR Applications, and UI/UX Design.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.gowthamsridhar.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    author: {
      '@type': 'Person',
      name: 'Gowtham Sridhar',
      url: 'https://www.gowthamsridhar.com',
      jobTitle: 'HCI Researcher & AI Expert',
      worksFor: {
        '@type': 'Organization',
        name: 'AIT',
        url: 'https://www.ait.ac.at/'
      },
      sameAs: [
        "https://www.linkedin.com/in/gowtham-sridher/",
        "https://github.com/ALIENvsROBOT",
        "https://scholar.google.com/citations?user=ipXbKeQAAAAJ",
        "https://www.researchgate.net/profile/Sridhar-Gowtham",
        "https://publications.ait.ac.at/en/persons/gowtham-sridhar/"
      ]
    },
    creator: {
      '@type': 'Person',
      name: 'Gowtham Sridhar'
    },
    copyrightHolder: {
      '@type': 'Person',
      name: 'Gowtham Sridhar'
    },
    // Auto-updating year. suppressHydrationWarning is used on the script tag to allow this.
    copyrightYear: new Date().getFullYear(),
    inLanguage: 'en-US',
    license: 'https://www.gowthamsridhar.com/terms'
  };

  // Breadcrumb Schema (only for non-home pages)
  const breadcrumbSchema = pagePath ? {
    '@context': 'https://schema.org',
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
        name: pageTitle,
        item: pageUrl
      }
    ]
  } : null;

  // WebPage Schema Definition
  // Use 'ProfilePage' for the homepage to strongly signal this is a personal portfolio
  const isHome = !pagePath;
  const schemaType = isHome ? 'ProfilePage' : 'WebPage';

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': pageUrl,
    url: pageUrl,
    name: pageTitle,
    description: pageDescription,
    inLanguage: 'en-US',
    isPartOf: {
      '@id': 'https://www.gowthamsridhar.com/#website'
    },
    // Explicitly link the page to the Person entity
    mainEntity: {
      '@type': 'Person',
      name: 'Gowtham Sridhar',
      url: 'https://www.gowthamsridhar.com',
      // SameAs links help Google connect the dots for the Knowledge Graph
      sameAs: [
        "https://www.linkedin.com/in/gowtham-sridher/",
        "https://github.com/ALIENvsROBOT",
        "https://scholar.google.com/citations?user=ipXbKeQAAAAJ",
        "https://www.researchgate.net/profile/Sridhar-Gowtham",
        "https://publications.ait.ac.at/en/persons/gowtham-sridhar/"
      ]
    },
    // key topics this page is "about" - helps with semantic search queries
    about: [
      { "@type": "Thing", "name": "Human-Computer Interaction", "sameAs": "https://en.wikipedia.org/wiki/Human%E2%80%93computer_interaction" },
      { "@type": "Thing", "name": "Artificial Intelligence", "sameAs": "https://en.wikipedia.org/wiki/Artificial_intelligence" },
      { "@type": "Thing", "name": "Extended Reality", "sameAs": "https://en.wikipedia.org/wiki/Extended_reality" }
    ],
    primaryImageOfPage: {
      '@type': 'ImageObject',
      contentUrl: imageUrl,
      url: imageUrl,
      width: 1200,
      height: 630,
      caption: pageTitle
    },
    datePublished: '2023-01-01T00:00:00+00:00',
    // dateModified is stabilized to YYYY-MM-DD to avoid millisecond-level hydration mismatches.
    dateModified: new Date().toISOString().split('T')[0],
    author: {
      '@type': 'Person',
      name: 'Gowtham Sridhar',
      url: 'https://www.gowthamsridhar.com'
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['article', 'h1', 'h2', 'h3']
    }
  };

  return (
    <>
      {/* 
          suppressHydrationWarning is CRITICAL here. 
          Static exports bake the date in at build time, but browsers might 
          see a different date if the user visits exactly at midnight.
      */}
      <script
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {breadcrumbSchema && (
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <script
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </>
  );
} 