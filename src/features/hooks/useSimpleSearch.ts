import { useState, useEffect } from 'react';

function useSimpleSearch({ query, items = [], criteria }) {
   // 'criteria' should be a function that will be executed for each item
   const [searchResults, setSearchResults] = useState([]);

   const search = function () {
      if (!query) return setSearchResults(items);

      const foundItems = items.filter(criteria);
      setSearchResults(foundItems);
   };

   useEffect(() => {
      search();
   }, [query]); // When query changes, search!

   return [searchResults];
}

export default useSimpleSearch;
