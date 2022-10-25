import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import Header from '../features/components/home/header/Header';
import Gallery from '../features/components/home/Gallery';
import BestPlaces from '../features/components/home/BestPlaces';
import Footer from '../features/components/layout/Footer';
import styles from '../styles/sass/pages/Home.module.scss';
import Layout from '../features/components/layout/index';
import { getProviders } from 'next-auth/react';

function Home() {
  return (
    <Layout navBg="transparent">
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
