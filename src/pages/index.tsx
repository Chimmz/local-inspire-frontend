import { useMemo } from 'react';
import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import { getProviders } from 'next-auth/react';

import Header from '../features/components/home/header/Header';
import Gallery from '../features/components/home/Gallery';
import BestPlaces from '../features/components/home/BestPlaces';
import Layout from '../features/components/layout/index';
import Navbar from '../features/components/layout/navbar/Navbar';

interface HomePageProps {
  popularCategorySuggestions: string[];
}

function HomePage({ popularCategorySuggestions }: HomePageProps) {
  return (
    <Layout>
      <Navbar bg="transparent" position="absolute" lightLogo />
      <Header
        defaultCategorySuggestions={useMemo(() => popularCategorySuggestions, [])}
      />
      <Gallery />
      <BestPlaces />
    </Layout>
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
