import React from 'react';

interface EnhancedSEOProps {
  pageTitle: string;
  pageDescription: string;
  pageUrl: string;
  pagePath: string; // e.g. 'projects', 'about', etc.
  imageUrl?: string;
}

export default function EnhancedSEO({
  pageTitle,
  pageDescription,
  pageUrl,
  pagePath,
  imageUrl = 'https://www.gowthamsridhar.com/images/shareLinkprofile.png',
}: EnhancedSEOProps) {

  // Website Schema
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
      }
    },
    creator: {
      '@type': 'Person',
      name: 'Gowtham Sridhar'
    },
    copyrightHolder: {
      '@type': 'Person',
      name: 'Gowtham Sridhar'
    },
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

  // WebPage Schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': pageUrl,
    url: pageUrl,
    name: pageTitle,
    description: pageDescription,
    inLanguage: 'en-US',
    isPartOf: {
      '@id': 'https://www.gowthamsridhar.com/#website'
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      contentUrl: imageUrl,
      url: imageUrl,
      width: 1200,
      height: 630,
      caption: pageTitle
    },
    datePublished: '2023-01-01T00:00:00+00:00',
    dateModified: new Date().toISOString().split('T')[0], // Auto-updates date without milliseconds
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