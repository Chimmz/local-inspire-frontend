import { useCallback, useState } from 'react';
import useRequest from './useRequest';

interface Params {
  makeRequest: () => Promise<any>;
  responseDataField: string;
}

function useAPISearchResults({ makeRequest, responseDataField }: Params) {
  const { send: sendRequest, loading } = useRequest({ autoStopLoading: true });
  const [searchResults, setSearchResults] = useState([]);
  const [resultsShown, setResultsShown] = useState(false);

  const resetResults = useCallback(setSearchResults.bind(null, []), [setSearchResults]);
  const showResults = useCallback(setResultsShown.bind(null, true), [setResultsShown]);
  const hideResults = useCallback(setResultsShown.bind(null, false), [setResultsShown]);

  const search = useCallback(() => {
    const req = sendRequest(makeRequest());

    req.then(res => {
      if (res?.status !== 'SUCCESS') return;
      setSearchResults(res[responseDataField]);
      showResults();
    });
    req.catch(resetResults);
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

export default useAPISearchResults;
