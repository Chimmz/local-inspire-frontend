import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}> Welcome to Next.js!</h1>
    </div>
  );
}

export default Home as NextPage;
