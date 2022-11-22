import { useEffect, useState } from 'react';

type PageDataMap<T> = { [page: number]: T | undefined };

interface Params<T> {
  init?: PageDataMap<T>;
  defaultCurrentPage?: number;
}

const usePaginate = <PageData>({ init, defaultCurrentPage = 1 }: Params<PageData>) => {
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage);
  const [pagesMap, setPagesMap] = useState<PageDataMap<PageData>>(init || {});

  const setPageData = (page: number, data: any) => {
    setPagesMap(map => ({ ...map, [page]: data }));
  };

  const getPageData = (page: number) => pagesMap?.[page];

  const pageHasData = (page: number, dataField: string) => {
    // @ts-ignore
    return !!pagesMap[page]?.[dataField]?.length;
  };

  const resetPagesData = () => setPagesMap({});

  return {
    currentPage,
    currentPageData: pagesMap[currentPage],
    setCurrentPage,
    getPageData,
    setPageData,
    pageHasData,
    resetPagesData,
    resetCurrentPage: () => setPageData(currentPage, []),
  };
};

export default usePaginate;
