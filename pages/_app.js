import "../styles/globals.css";
import Head from 'next/head';
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-V4TNY0123V"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V4TNY0123V');`}
        </Script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
