import { useState, useEffect, useCallback } from 'react';

interface SimpleSearchParams<Item> {
  query: string;
  items: Item[];
  criteria: (item: Item) => boolean; // Function that will be used to search an item
}

const useSimpleSearch = <Item>(params: SimpleSearchParams<Item>): Item[] => {
  const { query, items = [], criteria } = params;
  const [searchResults, setSearchResults] = useState<Item[]>([]);

  const search = useCallback(
    function () {
      if (!query) return setSearchResults(items);
      const foundItems = items.filter(criteria);
      setSearchResults(foundItems);
    },
    [query, setSearchResults],
  );

  useEffect(() => {
    search();
  }, [search]); // When query changes, search!

  return [...searchResults];
};

export default useSimpleSearch;
