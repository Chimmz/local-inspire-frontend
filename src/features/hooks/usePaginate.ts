import { useEffect, useState } from 'react';

type PageData<T> = { [page: number]: T | undefined };

interface Params<T> {
  init?: PageData<T>;
  defaultCurrentPage?: number;
}

const usePaginate = <T>({ init, defaultCurrentPage = 1 }: Params<T>) => {
  const [allData, setAllData] = useState<PageData<T>>(init || {});
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage);

  const setPageData = (page: number, data: T) => setAllData(map => ({ ...map, [page]: data }));
  const getPageData = (page: number) => allData[page];
  const pageHasData = (page: number, checkFn: (pgData: T | undefined) => boolean) => {
    return checkFn(getPageData(page));
  };

  return {
    currentPage,
    currentPageData: allData[currentPage],
    setCurrentPage,
    getPageData,
    setPageData,
    pageHasData,
    resetAllPages: setAllData.bind(null, {}),
  };
};

export default usePaginate;
