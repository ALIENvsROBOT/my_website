import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  // Get the correct asset prefix for GitHub Pages
  const prefix = process.env.NODE_ENV === 'production' 
    ? 'https://www.gowthamsridhar.com' 
    : '';

  return (
    <Html lang="en">
      <Head>
        {/* Force assets to use absolute URLs */}
        <meta name="asset-prefix" content={prefix} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 