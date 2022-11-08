import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ReactPaginate from 'react-paginate';

import { ParsedUrlQuery } from 'querystring';
import * as uuid from 'uuid';
import API from '../../features/utils/api-utils';
import * as stringUtils from '../../features/utils/string-utils';

import cls from 'classnames';
import Layout from '../../features/components/layout';
import Navbar from '../../features/components/layout/Navbar';
import BusinessSearchForm from '../../features/components/shared/businesses-search/BusinessSearchForm';
import Filters from '../../features/components/business-results/Filters';
import AllBusinesses from '../../features/components/business-results/AllBusinesses';
import styles from '../../styles/sass/pages/BusinessResults.module.scss';
import useRequest from '../../features/hooks/useRequest';
import usePaginate from '../../features/hooks/usePaginate';

interface SearchParams extends ParsedUrlQuery {
  slug: string[];
}
interface Props {
  businesses?: { [key: string]: any }[];
  results?: number;
  allResults?: number;
  status: 'SUCCESS' | 'ERROR';
  pageId: string;
}

const PER_PAGE = 20;

const SearchBusinessResultsPage: NextPage<Props> = props => {
  const error = props.status !== 'SUCCESS';
  const [propsData, setPropsData] = useState<Props>(props);
  const {
    startLoading: startNewSearchLoader,
    stopLoading: stopNewSearchLoader,
    loading: newSearchLoading,
  } = useRequest({ autoStopLoading: false });

  const router = useRouter();

  const {
    setPageData,
    // getPageData,
    currentPageData,
    setCurrentPage,
    pageHasData,
  } = usePaginate({
    defaultCurrentPage: 1,
    init: { 1: propsData as any },
  });

  let [category, city, stateCode] = (router.query.slug as string[]) || [];
  category = category && stringUtils.toTitleCase(category?.split('_').join(' '));
  city = city && stringUtils.toTitleCase(city?.split('_').join(' '));

  useEffect(() => {
    setCurrentPage(1);
    setPropsData(props);
  }, [setPropsData, props]);

  const handleSearchBusinesses = (categoryValue: string, cityValue: string) => {
    if (!categoryValue || !cityValue) return;
    const [categParam, cityParam, stateParam] = [
      stringUtils.toLowerSnakeCase(categoryValue),
      stringUtils.toLowerSnakeCase(cityValue),
      'AK',
    ];
    startNewSearchLoader();
    console.log('New page params: ', { categParam, cityParam, stateParam });
    router.push(`/search/${categParam}/${cityParam}/${stateParam}`);
  };

  const handlePageChange: (arg: { selected: number }) => void = async param => {
    const { selected: pageIndex } = param;
    const currentPage = pageIndex + 1;
    console.log({ currentPage });

    setCurrentPage(currentPage);
    if (pageHasData(currentPage)) return;

    const res = await API.findBusinesses(
      category,
      city,
      stateCode,
      currentPage,
      PER_PAGE,
    );
    if (res) {
      setPageData(currentPage, res);
    }
    console.log(res);
  };

  useEffect(() => {
    stopNewSearchLoader();
  }, [props.pageId]);

  return (
    <>
      {/* style={{ borderBottom: '1px solid #ccc' }} */}
      <Navbar bg="rgba(0,0,0, .7)" position="fixed">
        <BusinessSearchForm
          fontSize="12px"
          onSearch={handleSearchBusinesses}
          loading={newSearchLoading}
        />
      </Navbar>
      <Layout>
        <div className={styles.businessesResultsPage}>
          <h2 className={styles.heading}>
            {!props.results || error ? `"${category}"` : category}
            {' in '}
            {city}
          </h2>
          <aside className={styles.mapPreview} style={{ position: 'relative' }}>
            <Image src="/img/map-img.jpg" layout="fill" />
            <button className={cls(styles.btnViewMap, 'btn btn-outline-pry')}>
              View on map
            </button>
          </aside>
          <Filters styles={styles} />
          <AllBusinesses
            data={currentPageData as { [key: string]: any }}
            allResults={props.allResults!}
            styles={styles}
          />
          <div className={styles.pagination}>
            {/* <ul className={styles.paginators}>
              <li>
                <a href="">{'<'}</a>
              </li>
              <li>
                <a href="">1</a>
              </li>
              <li>
                <a href="" className={styles.active}>
                  2
                </a>
              </li>
              <li>
                <a href="">3</a>
              </li>
              <li>
                <a href="">{'>'}</a>
              </li>
            </ul> */}
            {props.allResults ? (
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageChange}
                // pageRangeDisplayed={10}
                pageCount={props.allResults ? Math.ceil(props.allResults / PER_PAGE) : 0}
                previousLabel="<"
                renderOnZeroPageCount={() => {}}
                className={styles.paginators}
                pageLinkClassName={styles.pageLink}
                activeLinkClassName={styles.activePagelink}
                nextLinkClassName={styles.pageLink}
                previousLinkClassName={styles.pageLink}
              />
            ) : null}
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async function () {
  return {
    paths: [{ params: { slug: ['restaurants', 'anchorage', 'AK'] } }],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async function (context) {
  console.log('getStaticProps Context: ', context);
  const slug = (context.params as SearchParams).slug;

  let [category, city, stateCode] = slug;
  [category, city] = [category, city].map(param => param.split('_').join(' '));

  if (!category || !city || !stateCode) return { notFound: true };
  const api =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_API_BASE_URL_REMOTE
      : process.env.NEXT_PUBLIC_API_BASE_URL_VERCEL;

  try {
    const data = await API._makeRequest({
      path: `${api}/businesses/find?category=${category}&city=${city}&stateCode=${stateCode}&page=1&limit=20`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const { businesses, ...others } = data;
    console.log(others);
    return { props: { ...data, pageId: uuid.v4() } };
  } catch (err) {
    console.error('Error: ', err);
    return { props: { error: 'Sorry, something wrong happened', pageId: uuid.v4() } };
  }
};

export default SearchBusinessResultsPage;
// https://ihsavru.medium.com/react-paginate-implementing-pagination-in-react-f199625a5c8e
