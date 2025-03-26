import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gowtham Sridhar | HCI Researcher & XR Expert',
  description: 'Portfolio of Gowtham Sridhar, Junior Scientist at AIT specializing in Human-Computer Interaction, XR Applications, and UI/UX Design.',
  keywords: 'Gowtham Sridhar, HCI, XR Applications, UI/UX Design, Human-Computer Interaction, AIT, Junior Scientist',
  authors: [{ name: 'Gowtham Sridhar' }],
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
  openGraph: {
    title: 'Gowtham Sridhar | HCI Researcher & XR Expert',
    description: 'Specializing in Human-Computer Interaction, XR Applications, and UI/UX Design to create seamless technological interfaces.',
    url: 'https://www.gowthamsridhar.com',
    siteName: 'Gowtham Sridhar Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gowtham Sridhar | HCI Researcher & XR Expert',
    description: 'Specializing in Human-Computer Interaction, XR Applications, and UI/UX Design to create seamless technological interfaces.',
    creator: '@gowtham_sridhar',
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