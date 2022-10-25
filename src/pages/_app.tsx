import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/sass/main.scss';
// import Script from 'next/script';

interface PageProps {
  [key: string]: any;
  session?: Session | undefined;
}

function MyApp({ Component, pageProps }: AppProps) {
  const { session, ...restPageProps } = pageProps as Partial<PageProps>;

  return (
    <SessionProvider session={session}>
      {/* <Script src="https://code.iconify.design/iconify-icon/1.0.1/iconify-icon.min.js"></Script> */}
      <Component {...restPageProps} />
    </SessionProvider>
  );
}

export default MyApp;
