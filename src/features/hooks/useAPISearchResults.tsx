import { useState } from 'react';
import useRequest from './useRequest';

interface Params {
  makeRequest: () => Promise<any>;
  responseDataField: string;
}

function useAPISearchResults({ makeRequest, responseDataField }: Params) {
  const { send: sendRequest, loading } = useRequest({ autoStopLoading: true });
  const [searchResults, setSearchResults] = useState([]);
  const [resultsShown, setResultsShown] = useState(false);

  const resetResults = () => setSearchResults([]);

  const search = () => {
    const req = sendRequest(makeRequest());
    req.then(res => {
      if (res?.status !== 'SUCCESS') return;
      setSearchResults(res[responseDataField]);
      setResultsShown(true);
    });
    req.catch(resetResults);
  };

  return {
    search,
    searchResults,
    resultsShown,
    loading,
    showResults: () => setResultsShown(true),
    hideResults: () => setResultsShown(false),
    resetResults,
  };
}

export default useAPISearchResults;
