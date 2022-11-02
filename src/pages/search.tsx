import { useEffect } from 'react';

import Router, { useRouter } from 'next/router';
import Layout from '../features/components/layout';
import styles from '../styles/sass/pages/Search.module.scss';
import API from '../features/utils/api-utils';
import useAPISearchResults from '../features/hooks/useAPISearchResults';

function Search() {
  const router = useRouter();
  const query = router.query;
  console.log(query);

  const makeSearchRequest = () => {
    return API.findBusinesses(
      query.category as string,
      query.city as string,
      query.state as string,
    );
  };

  const {
    search: findBusinesses,
    searchResults: businessResults,
    loading: businessResultsLoading,
    resultsShown: businessResultsShown,
    showResults: showBusinessResults,
    hideResults: hideBusinessResults,
    resetResults: resetBusinessResults,
  } = useAPISearchResults({
    makeRequest: makeSearchRequest,
    responseDataField: 'businesses',
  });

  useEffect(() => {
    if (!query.category || !query.city || !query.state) return resetBusinessResults();
    // findBusinesses();
  }, []);
  return <Layout>Hi Search</Layout>;
}

export default Search;
