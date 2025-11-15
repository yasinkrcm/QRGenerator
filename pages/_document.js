import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="tr">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="description" content="Basit ve güzel QR kod generator - Metin, URL veya herhangi bir veri için QR kod oluşturun" />
        <meta name="theme-color" content="#667eea" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

