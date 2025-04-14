"use client";

import React from 'react';
import Link from 'next/link';
import { useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Import EnhancedSEO component
const EnhancedSEO = dynamic(
  () => import("@/components/EnhancedSEO"),
  { ssr: false }
);

export default function NotFound() {
  // Track 404s in analytics if you have a service set up
  useEffect(() => {
    // Add tracking code here if you have analytics
    // Example: gtag('event', '404_error', { 'page_path': window.location.pathname });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white px-4">
      <Head>
        <title>Page Not Found | Gowtham Sridhar</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://www.gowthamsridhar.com" />
      </Head>
      
      <EnhancedSEO 
        pageTitle="Page Not Found | Gowtham Sridhar" 
        pageDescription="Sorry, the page you are looking for could not be found. Return to Gowtham Sridhar's portfolio homepage."
        pageUrl="https://www.gowthamsridhar.com/404"
        pagePath="404"
      />
      
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="max-w-md mb-8">Sorry, the page you're looking for doesn't exist or has been moved.</p>
        
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-4">You might be interested in:</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="text-blue-400 hover:text-blue-300 underline">Homepage</Link></li>
            <li><Link href="/projects" className="text-blue-400 hover:text-blue-300 underline">Projects</Link></li>
            <li><Link href="/about" className="text-blue-400 hover:text-blue-300 underline">About Me</Link></li>
            <li><Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact</Link></li>
          </ul>
        </div>
        
        <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
} 