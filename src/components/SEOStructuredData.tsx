import React from 'react';

interface SEOStructuredDataProps {
  name: string;
  jobTitle: string;
  worksFor: string;
  worksForUrl?: string;
  educationalCredentials?: string;
  description: string;
  image: string;
  sameAs: string[];
  mainEntityOfPage: string;
  url: string;
}

export default function SEOStructuredData({
  name,
  jobTitle,
  worksFor,
  worksForUrl,
  educationalCredentials,
  description,
  image,
  sameAs,
  mainEntityOfPage,
  url,
}: SEOStructuredDataProps) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    worksFor: {
      '@type': 'Organization',
      name: worksFor,
      ...(worksForUrl && { url: worksForUrl }),
    },
    ...(educationalCredentials && {
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        name: educationalCredentials,
      },
    }),
    description,
    image,
    sameAs,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': mainEntityOfPage,
    },
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  );
} 