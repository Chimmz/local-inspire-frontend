import React, { useState } from 'react';
import {
   fetchWithinTimeout,
   handleFetchLoadingState
} from '../utils/asyncUtils';

function useFetch() {
   const [loading, setLoading] = useState(false);

   const sendRequest = function (req) {
      const makeRequest = () => fetchWithinTimeout(req);

      const loadingConfig = {
         startLoading: () => setLoading(true),
         stopLoading: () => setLoading(false)
      };
      return handleFetchLoadingState(makeRequest, loadingConfig);
   };

   return { sendRequest, loading };
}

export default useFetch;
