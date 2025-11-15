import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qr.yasinkaracam.codes'
  const siteName = 'QR Kod Oluşturucu'
  const description = 'Basit ve güzel QR kod generator - Metin, URL veya herhangi bir veri için QR kod oluşturun'
  const ogImage = `${siteUrl}/og-image.png`

  return (
    <Html lang="tr">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        
        {/* Basic Meta Tags */}
        <meta name="description" content={description} />
        <meta name="theme-color" content="#667eea" />
        
        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={siteName} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="tr_TR" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteName} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="QR Generator" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

