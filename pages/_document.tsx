import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="font-sans">
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        
        {/* OGAds Content Locker Script */}
        <noscript><meta httpEquiv="refresh" content="0;url=https://redirectapps.online/noscript" /></noscript>
        <script type="text/javascript" id="ogjs" src="https://redirectapps.online/cl/js/veo64m" async></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
