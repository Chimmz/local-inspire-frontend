import { useCallback, useState } from 'react';
import useRequest from './useRequest';

interface Params {
  makeRequest: () => Promise<any>;
  responseDataField: string;
}

function useAPISearch<T>({ makeRequest, responseDataField }: Params) {
  const { send: sendRequest, loading } = useRequest({ autoStopLoading: true });
  const [searchResults, setSearchResults] = useState<T[]>([]);
  const [resultsShown, setResultsShown] = useState(false);

  const showResults = useCallback(() => setResultsShown(true), [setResultsShown]);
  const hideResults = useCallback(() => setResultsShown(false), [setResultsShown]);
  const resetResults = useCallback(() => setSearchResults([]), [setSearchResults]);

  const search = useCallback(() => {
    const req = sendRequest(makeRequest());
    req
      .then(res => {
        if (!(responseDataField in res) && !Array.isArray(res.responseDataField)) return;
        setSearchResults(res[responseDataField]);
        showResults();
      })
      .catch(resetResults);
  }, [sendRequest, makeRequest, setSearchResults, showResults]);

  return {
    search,
    searchResults,
    resultsShown,
    loading,
    showResults,
    hideResults,
    resetResults,
  };
}

export default useAPISearch;
