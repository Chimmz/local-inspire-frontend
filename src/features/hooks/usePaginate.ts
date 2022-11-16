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

  const pageHasData = (page: number, dataField: string) => {
    // @ts-ignore
    return !!pagesMap[page]?.[dataField]?.length;
  };

  const resetPagesData = () => {
    setPagesMap({});
    setCurrentPage(1);
  };

  return {
    currentPage,
    currentPageData: currentPage && pagesMap?.[currentPage],
    setCurrentPage,
    getPageData,
    setPageData,
    pageHasData,
    resetPagesData,
    resetCurrentPage: () => {
      setPageData(currentPage, []);
    },
  };
};

export default usePaginate;
