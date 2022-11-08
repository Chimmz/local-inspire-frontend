import { useState } from 'react';
import useRequest from './useRequest';

interface Params {
  makeRequest: () => Promise<any>;
  responseDataField: string;
}

const useAPISearchResults = ({ makeRequest, responseDataField }: Params) => {
  const { send: sendRequest, loading } = useRequest({ autoStopLoading: true });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [resultsShown, setResultsShown] = useState(false);

  const resetResults = () => setSearchResults([]);

  const search = () => {
    // console.log(`Searching ${responseDataField}...`);
    sendRequest(makeRequest())
      .then(res => {
        // console.log('Data: ', res[responseDataField]);
        if (res?.status !== 'SUCCESS') return;
        setSearchResults(res[responseDataField]);
        setResultsShown(true);
      })
      .catch(resetResults);
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
};

export default useAPISearchResults;
