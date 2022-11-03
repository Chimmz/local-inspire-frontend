import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useEffect } from 'react';

import Router, { useRouter } from 'next/router';
import Layout from '../../features/components/layout';
import styles from '../styles/sass/pages/Search.module.scss';
import API from '../../features/utils/api-utils';
import useAPISearchResults from '../../features/hooks/useAPISearchResults';
import Navbar from '../../features/components/layout/Navbar';
import { ParsedUrlQuery } from 'querystring';

interface SearchParams extends ParsedUrlQuery {
  slug: string[];
}

const Search: NextPage = () => {
  const router = useRouter();
  const query = router.query;
  console.log(query);

  const {
    search: findBusinesses,
    searchResults: businessResults,
    loading: businessResultsLoading,
    resultsShown: businessResultsShown,
    showResults: showBusinessResults,
    hideResults: hideBusinessResults,
    resetResults: resetBusinessResults,
  } = useAPISearchResults({
    makeRequest() {
      return API.findBusinesses(
        query.category as string,
        query.city as string,
        query.state as string,
      );
    },
    responseDataField: 'businesses',
  });

  useEffect(() => {
    if (!query.category || !query.city || !query.state) return resetBusinessResults();
    findBusinesses();
  }, []);

  return (
    <>
      <Navbar bg="#2b2b2b" />
      <Layout>
        <div>Search results will be here</div>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async function (context) {
  console.log('getStaticPaths Context: ', context);
  return {
    paths: [{ params: { slug: ['restaurants', 'anchorage', 'AK'] } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async function (context) {
  console.log('getStaticProps Context: ', context);
  const slug = (context.params as SearchParams).slug;
  const [category, city, stateCode] = slug;

  if (!category || !city || !stateCode) return { notFound: true };

  try {
    const { businesses } = await API._makeRequest({
      path: `https://localinspire-backend.vercel.app/api/v1/businesses/find?category=${category}&city=${city}&stateCode=${stateCode}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      fromAPI: false,
    });
    if (!businesses) throw Error();

    console.log(businesses);
    return { props: { businesses: businesses || null } };
  } catch (err) {
    console.error('Error: ', err);
    return { props: { error: 'Sorry, something wrong happened' } };
  }
};

export default Search;
