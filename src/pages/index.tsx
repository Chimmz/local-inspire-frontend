import type { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import { getProviders } from 'next-auth/react';

import Header from '../features/components/home/header/Header';
import Gallery from '../features/components/home/Gallery';
import BestPlaces from '../features/components/home/BestPlaces';
import Layout from '../features/components/layout/index';
import Navbar from '../features/components/layout/navbar/Navbar';

interface HomeProps {
  popularCategorySuggestions: string[];
}

function Home({ popularCategorySuggestions }: HomeProps) {
  return (
    <Layout>
      <Navbar bg="transparent" position="absolute" lightLogo />
      <Header defaultCategorySuggestions={popularCategorySuggestions} />
      <Gallery />
      <BestPlaces />
    </Layout>
  );
}

// export const getServerSideProps: GetServerSideProps = async context => {
//   const authProviders = await getProviders();
//   // console.log('authProviders: ', authProviders);
//   return { props: {} };
// };
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

export default Home as NextPage;
