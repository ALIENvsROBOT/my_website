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
  imageUrl = 'https://www.gowthamsridhar.com/images/gowtham-profile.jpg',
}: EnhancedSEOProps) {
  const siteUrl = 'https://www.gowthamsridhar.com';
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  const imageObjectId = `${siteUrl}/#primaryimage`;

  // Website Schema Definition
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: 'Gowtham Sridhar - HCI Researcher & AI Expert',
    alternateName: ['Gowtham Sridhar', 'Gowtham Sridhar Portfolio'],
    url: siteUrl,
    description: 'Portfolio of Gowtham Sridhar, Junior Scientist at AIT specializing in Applied AI, HCI, XR Applications, and UI/UX Design.',
    author: {
      '@type': 'Person',
      '@id': personId,
      name: 'Gowtham Sridhar',
      url: siteUrl,
      jobTitle: 'Junior Scientist, Applied AI & HCI Researcher',
      image: imageUrl,
      worksFor: {
        '@type': 'Organization',
        name: 'Austrian Institute of Technology (AIT)',
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
      '@id': personId,
      name: 'Gowtham Sridhar'
    },
    copyrightHolder: {
      '@type': 'Person',
      '@id': personId,
      name: 'Gowtham Sridhar'
    },
    // Auto-updating year. suppressHydrationWarning is used on the script tag to allow this.
    copyrightYear: new Date().getFullYear(),
    inLanguage: 'en-US'
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
      '@id': websiteId
    },
    // Explicitly link the page to the Person entity
    mainEntity: {
      '@type': 'Person',
      '@id': personId,
      name: 'Gowtham Sridhar',
      url: siteUrl,
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
      '@id': imageObjectId,
      contentUrl: imageUrl,
      url: imageUrl,
      width: 1200,
      height: 630,
      caption: pageTitle
    },
    datePublished: '2023-01-01T00:00:00+00:00',
    // Keep this as a stable ISO 8601 datetime so rich-result parsers accept it consistently.
    dateModified: '2026-04-29T00:00:00+00:00',
    author: {
      '@type': 'Person',
      '@id': personId,
      name: 'Gowtham Sridhar',
      url: siteUrl
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
