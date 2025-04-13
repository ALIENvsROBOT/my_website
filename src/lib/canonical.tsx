import React from 'react';
import Head from 'next/head';

interface CanonicalProps {
  url?: string;
}

/**
 * Component for adding canonical URL tags to pages
 * @param url - Optional specific URL, defaults to current path
 */
export default function Canonical({ url }: CanonicalProps) {
  const baseUrl = 'https://www.gowthamsridhar.com';
  const canonicalUrl = url ? `${baseUrl}${url}` : baseUrl;
  
  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}

/**
 * Function to get canonical URL for metadata in Next.js App Router
 * @param path - Optional path, defaults to root
 */
export function getCanonicalUrl(path?: string): string {
  const baseUrl = 'https://www.gowthamsridhar.com';
  return path ? `${baseUrl}${path.startsWith('/') ? path : `/${path}`}` : baseUrl;
} 