import { useState } from 'react';

type PageDataMap = { [page: number]: Array<any> | undefined };

interface Params {
  init?: PageDataMap;
  defaultCurrentPage?: number;
}

const usePaginate = ({ init, defaultCurrentPage }: Params) => {
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage || 1);
  const [pagesMap, setPagesMap] = useState<PageDataMap>(init || {});

  const setPageData = (page: number, data: Array<any>) => {
    setPagesMap(map => ({ ...map, [page]: data }));
  };
  const getPageData = (page: number) => pagesMap[page];
  const pageHasData = (page: number) => !!pagesMap[page];

  return {
    currentPageData: currentPage && pagesMap[currentPage],
    setCurrentPage,
    getPageData,
    setPageData,
    pageHasData,
  };
};

export default usePaginate;
