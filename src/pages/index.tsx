import type { GetServerSideProps, NextPage } from 'next';
import { getProviders } from 'next-auth/react';

import Header from '../features/components/home/header/Header';
import Gallery from '../features/components/home/Gallery';
import BestPlaces from '../features/components/home/BestPlaces';
import Layout from '../features/components/layout/index';
import Navbar from '../features/components/layout/Navbar';

function Home() {
  return (
    <Layout>
      <Navbar bg="transparent" position="absolute" />
      <Header />
      <Gallery />
      <BestPlaces />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const authProviders = await getProviders();
  // console.log('authProviders: ', authProviders);
  return { props: {} };
};

export default Home as NextPage;
