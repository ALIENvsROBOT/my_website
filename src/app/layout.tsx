import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import SEOStructuredData from '@/components/SEOStructuredData';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gowtham Sridhar | HCI Researcher & XR Expert | Portfolio',
  description: 'Portfolio of Gowtham Sridhar, Junior Scientist at AIT specializing in Human-Computer Interaction, XR Applications, Mixed Reality, and UI/UX Design for innovative technological interfaces.',
  keywords: 'Gowtham Sridhar, HCI Researcher, XR Expert, Human-Computer Interaction, XR Applications, UI/UX Design, Mixed Reality, AIT, Junior Scientist, Portfolio, Interactive Technology, Research Publications, Technology Innovation, Extended Reality, User Experience',
  authors: [{ name: 'Gowtham Sridhar', url: 'https://www.gowthamsridhar.com' }],
  creator: 'Gowtham Sridhar',
  publisher: 'Gowtham Sridhar',
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.gowthamsridhar.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    }
  },
  openGraph: {
    title: 'Gowtham Sridhar | HCI Researcher & XR Expert',
    description: 'Specializing in Human-Computer Interaction, XR Applications, and UI/UX Design to create seamless technological interfaces and innovative mixed reality experiences.',
    url: 'https://www.gowthamsridhar.com',
    siteName: 'Gowtham Sridhar Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.gowthamsridhar.com/images/shareLinkprofile.png',
        width: 1200,
        height: 630,
        alt: 'Gowtham Sridhar - HCI Researcher and XR Expert',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gowtham Sridhar | HCI Researcher & XR Expert',
    description: 'Specializing in Human-Computer Interaction, XR Applications, and UI/UX Design to create seamless technological interfaces and innovative mixed reality experiences.',
    creator: '@gowtham_sridhar',
    images: ['https://www.gowthamsridhar.com/images/shareLinkprofile.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <SEOStructuredData 
          name="Gowtham Sridhar"
          jobTitle="HCI Researcher & XR Expert"
          worksFor="Austrian Institute of Technology (AIT)"
          worksForUrl="https://www.ait.ac.at/"
          educationalCredentials="M.Sc. Human-Computer Interaction (Joint Degree)"
          description="Portfolio of Gowtham Sridhar, Junior Scientist at AIT specializing in Human-Computer Interaction, XR Applications, and UI/UX Design."
          image="https://www.gowthamsridhar.com/images/shareLinkprofile.png"
          sameAs={[
            "https://www.linkedin.com/in/gowtham-sridher/",
            "https://github.com/ALIENvsROBOT",
            "https://scholar.google.com/citations?user=ipXbKeQAAAAJ"
          ]}
          mainEntityOfPage="https://www.gowthamsridhar.com"
          url="https://www.gowthamsridhar.com"
          affiliation="Austrian Institute of Technology"
          hIndex={15} 
          researchInterests={[
            "Human-Computer Interaction", 
            "XR Applications", 
            "UI/UX Design",
            "Mixed Reality"
          ]}
          alumniOf={[
            "Paris Lodron Universitaet Salzburg",
            "Fachhochschule Salzburg",
            "Hindustan Institute of Technology and Science"
          ]}
          address={{
            addressLocality: "Vienna",
            addressCountry: "Austria"
          }}
        />
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              // Ensure content is visible even if stylesheet loading is delayed
              document.documentElement.style.visibility = 'visible';
              
              // Check if pointer is supported for custom cursor
              const hasPointer = window.matchMedia('(pointer: fine)').matches;
              if (hasPointer) {
                document.documentElement.classList.add('custom-cursor-supported');
              }
              
              // Mobile optimization - detect mobile devices and optimize performance
              const isMobile = window.innerWidth < 768 || 
                navigator.userAgent.match(/Android/i) ||
                navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPad/i);
              
              if (isMobile && document.body) {
                document.body.classList.add('mobile-optimized');
                
                // Disable some expensive animations for better performance
                document.addEventListener('DOMContentLoaded', () => {
                  // Remove unnecessary particles on mobile
                  const particles = document.querySelectorAll('.bg-particle');
                  if (particles.length > 5) {
                    for (let i = 5; i < particles.length; i++) {
                      if (particles[i]) particles[i].remove();
                    }
                  }
                  
                  // Simplify glass effects on mobile
                  document.querySelectorAll('.premium-glass, .glass-effect-dark').forEach(el => {
                    el.style.backdropFilter = 'none';
                    el.style.webkitBackdropFilter = 'none';
                    el.style.backgroundColor = 'rgba(5, 7, 22, 0.95)';
                  });
                });
              } else if (isMobile) {
                // If body isn't ready yet, wait for DOMContentLoaded
                document.addEventListener('DOMContentLoaded', () => {
                  if (document.body) {
                    document.body.classList.add('mobile-optimized');
                  }
                });
              }
              
              // Add resize listener to adjust performance settings when screen size changes
              window.addEventListener('resize', () => {
                if (window.innerWidth < 768 && document.body) {
                  document.body.classList.add('mobile-optimized');
                } else if (document.body) {
                  document.body.classList.remove('mobile-optimized');
                }
              });
              
              // Force visibility after 1 second as a fallback
              setTimeout(() => {
                document.documentElement.style.visibility = 'visible';
              }, 1000);
            `
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
