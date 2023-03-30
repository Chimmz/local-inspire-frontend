import { useMemo } from 'react';
import { GetStaticProps, NextPage } from 'next';

import AuthContextProvider from '../features/contexts/AuthContext';

import Header from '../features/components/home/header/Header';
import Gallery from '../features/components/home/Gallery';
import BestPlaces from '../features/components/home/BestPlaces';
import Layout from '../features/components/layout/index';

interface Props {
  popularCategorySuggestions: string[];
}

const HomePage: NextPage<Props> = function ({ popularCategorySuggestions }) {
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
};

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

export default HomePage;
