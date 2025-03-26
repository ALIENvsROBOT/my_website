import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  // For custom domain, we don't need a prefix
  const prefix = '';

  return (
    <Html lang="en">
      <Head>
        {/* Custom domain doesn't need special asset prefixes */}
        <meta name="asset-prefix" content={prefix} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 