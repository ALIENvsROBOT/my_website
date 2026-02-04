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
  knowsAbout?: string[];
  skills?: string[];
  awards?: string[];
  memberOf?: Array<{ name: string; url?: string }>;
  gender?: string;
  nationality?: string;
  birthPlace?: string;
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
  knowsAbout,
  skills,
  awards,
  memberOf,
  gender,
  nationality,
  birthPlace,
}: SEOStructuredDataProps) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    gender,
    nationality: nationality ? { '@type': 'Country', name: nationality } : undefined,
    birthPlace: birthPlace ? { '@type': 'Place', name: birthPlace } : undefined,
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
    ...(knowsAbout && !researchInterests && {
      knowsAbout: knowsAbout
    }),
    ...(skills && {
      hasOccupation: {
        '@type': 'Occupation',
        name: jobTitle,
        skills: skills.join(', ')
      }
    }),
    ...(awards && {
      award: awards
    }),
    ...(memberOf && {
      memberOf: memberOf.map(org => ({
        '@type': 'Organization',
        name: org.name,
        ...(org.url && { url: org.url })
      }))
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

  // Add Website schema to help with Sitelinks and Site Name
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': name,
    'alternateName': [`${name} Portfolio`, 'Gowtham Sridhar HCI'],
    'url': url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
 