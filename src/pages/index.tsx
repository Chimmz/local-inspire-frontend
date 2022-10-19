import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import Header from '../features/components/home/header/Header';
import Gallery from '../features/components/home/Gallery';
import BestPlaces from '../features/components/home/BestPlaces';
import Footer from '../features/components/layout/Footer';
import styles from '../styles/sass/pages/Home.module.scss';
import Layout from '../features/components/layout/index';

function Home() {
  return (
    <Layout navBg="transparent">
      <Header />
      <Gallery />
      <BestPlaces />
    </Layout>
  );
}

export default Home as NextPage;
