import { useState, useEffect } from 'react';

interface SimpleSearchParams<Item> {
  query: string;
  items: Item[];
  criteria: (item: Item) => boolean; // Function that will be used to search an item
}

const useSimpleSearch = <Item>(params: SimpleSearchParams<Item>): Item[] => {
  const { query, items = [], criteria } = params;
  const [searchResults, setSearchResults] = useState<Item[]>([]);

  const search = function () {
    if (!query) return setSearchResults(items);
    const foundItems = items.filter(criteria);
    setSearchResults(foundItems);
  };

  useEffect(() => {
    search();
  }, [query]); // When query changes, search!

  return [...searchResults];
};

export default useSimpleSearch;
