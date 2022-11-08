import { useEffect, useState } from 'react';

type PageDataMap = { [page: number]: Array<any> | undefined };

interface Params {
  init?: PageDataMap;
  defaultCurrentPage?: number;
}

const usePaginate = ({ init, defaultCurrentPage = 1 }: Params) => {
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage);
  const [pagesMap, setPagesMap] = useState<PageDataMap>(init || {});

  const setPageData = (page: number, data: Array<any>) => {
    setPagesMap(map => ({ ...map, [page]: data }));
  };
  const getPageData = (page: number) => pagesMap?.[page];
  const pageHasData = (page: number) => !!pagesMap?.[page];

  // useEffect(() => {
  //   setPageData(currentPage, init || ({} as any));
  //   // setPagesMap(init || {});
  // }, []);

  return {
    currentPage,
    currentPageData: currentPage && pagesMap?.[currentPage],
    setCurrentPage,
    getPageData,
    setPageData,
    pageHasData,
  };
};

export default usePaginate;
