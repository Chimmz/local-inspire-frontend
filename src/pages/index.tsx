import { useMemo } from 'react';
import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import { getProviders, signOut } from 'next-auth/react';

import AuthContextProvider, { useAuthContext } from '../features/contexts/AuthContext';

import Header from '../features/components/home/header/Header';
import Gallery from '../features/components/home/Gallery';
import BestPlaces from '../features/components/home/BestPlaces';
import Layout from '../features/components/layout/index';
import Navbar from '../features/components/layout/navbar/Navbar';
import { useRouter } from 'next/router';

interface HomePageProps {
  popularCategorySuggestions: string[];
}

function HomePage({ popularCategorySuggestions }: HomePageProps) {
  // const router = useRouter();
  // if (!!router.query.authError) signOut({ redirect: false });
  // const {showAuthModal} = useAuthContext()

  return (
    <AuthContextProvider>
      <Layout>
        <Layout.Nav
          bg="transparent"
          position="absolute"
          lightLogo
          // logoClassName="mr-auto"
          justifyIconsRight
          withSearchForm={false}
        />
        <Header defaultCategorySuggestions={useMemo(() => popularCategorySuggestions, [])} />
        <Gallery />
        <BestPlaces />
      </Layout>
    </AuthContextProvider>
  );
}

export const getStaticProps: GetStaticProps = async function () {
  const popularCategorySuggestions = [
    'Hotels',
    'Restaurants',
    'Cabins',
    'Vacation Rentals',
    'Things to do',
    'Cruises',
  ];
  return {
    props: { popularCategorySuggestions },
  };
};

export default HomePage as NextPage;
