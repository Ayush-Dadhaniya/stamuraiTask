import "@/styles/globals.css";
// import Head from 'next/head';
import Head from 'next/head';
export default function App({ Component, pageProps }) {
  return <>
    <Head>
      <link rel="icon" href="/task_management_logo.svg" />
    </Head>
    <Component {...pageProps} />
  </>;
}
