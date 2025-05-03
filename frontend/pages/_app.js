import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return <>
    <Head>
      <link rel="icon" href="/task_management_logo.svg" />
    </Head>
    <Component {...pageProps} />
  </>;
}
