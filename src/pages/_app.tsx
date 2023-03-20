import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/sass/main.scss';
import AuthContextProvider from '../features/contexts/AuthContext';
import { UserLocationProvider } from '../features/contexts/UserLocationContext';
import Head from 'next/head';
import { seoKeywords } from '../features/data/constants';

interface PageProps {
  [key: string]: any;
  session?: Session | undefined;
}

function MyApp({ Component, pageProps }: AppProps) {
  const { session, ...restPageProps } = pageProps as Partial<PageProps>;

  return (
    <SessionProvider session={session}>
      <UserLocationProvider>
        <AuthContextProvider>
          <Head>
            <meta name="keywords" content={seoKeywords} />
          </Head>
          <Component {...restPageProps} />
        </AuthContextProvider>
      </UserLocationProvider>
    </SessionProvider>
  );
}

export default MyApp;
