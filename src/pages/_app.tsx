import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import Head from 'next/head';
// Contexts
import AuthContextProvider from '../features/contexts/AuthContext';
import { UserLocationProvider } from '../features/contexts/UserLocationContext';
// Utils
import { seoKeywords } from '../features/data/constants';
// Styles
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/sass/main.scss';

// import '../styles/lightgallery.css';
// import '../styles/lg-zoom.css';
// import '../styles/lg-thumbnail.css';
import '../styles/lightgallery-bundle.min.css';

// import 'lightgallery/css/lightgallery.css';
// import 'lightgallery/css/lg-zoom.css';
// import 'lightgallery/css/lg-thumbnail.css';
// import 'lightgallery/css/lightgallery-bundle.min.css';

interface PageProps {
  [key: string]: any;
  session?: Session | undefined;
}

function MyApp({ Component, pageProps }: AppProps) {
  const { session, ...restProps } = pageProps as Partial<PageProps>;

  return (
    <SessionProvider session={session}>
      <UserLocationProvider>
        <AuthContextProvider>
          <Head>
            <meta name="keywords" content={seoKeywords} />
            {/* <link rel="stylesheet" href="/styles/lightgallery/css/lightgallery-bundle.min.css" /> */}
          </Head>
          <Component {...restProps} />
        </AuthContextProvider>
      </UserLocationProvider>
    </SessionProvider>
  );
}

export default MyApp;
