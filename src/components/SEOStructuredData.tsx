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
  affiliation?: string;
  hIndex?: number;
  researchInterests?: string[];
  alumniOf?: string | string[];
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    postalCode?: string;
    addressCountry?: string;
  };
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
  affiliation,
  hIndex,
  researchInterests,
  alumniOf,
  address,
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
    ...(affiliation && { affiliation: {
      '@type': 'Organization',
      name: affiliation
    }}),
    ...(hIndex !== undefined && { 
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'h-index',
        value: hIndex.toString()
      }
    }),
    ...(researchInterests && { 
      knowsAbout: researchInterests 
    }),
    ...(alumniOf && {
      alumniOf: Array.isArray(alumniOf) 
        ? alumniOf.map(org => ({ '@type': 'Organization', name: org }))
        : { '@type': 'Organization', name: alumniOf }
    }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        ...address
      }
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  );
} 