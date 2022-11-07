import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ReactPaginate from 'react-paginate';

import API from '../../features/utils/api-utils';
import * as stringUtils from '../../features/utils/string-utils';
import { ParsedUrlQuery } from 'querystring';
import cls from 'classnames';
import Layout from '../../features/components/layout';
import Navbar from '../../features/components/layout/Navbar';
import BusinessSearchForm from '../../features/components/shared/businesses-search/BusinessSearchForm';
import Filters from '../../features/components/business-results/Filters';
import AllBusinesses from '../../features/components/business-results/AllBusinesses';
import styles from '../../styles/sass/pages/BusinessResults.module.scss';
import useRequest from '../../features/hooks/useRequest';

interface SearchParams extends ParsedUrlQuery {
  slug: string[];
}
interface Props {
  businesses?: { [key: string]: any }[];
  all: number;
  error?: string;
}

const SearchBusinessResultsPage: NextPage<Props> = props => {
  const [businesses, setBusinesses] = useState(props.businesses);
  // const [currentPage, setCurrentPage] = useState(1);
  const [itemOffset, setItemOffset] = useState(0);
  const router = useRouter();
  const query = router.query;
  console.log(query);
  const {
    loading: isSearching,
    startLoading: startSearchLoader,
    stopLoading: stopSearchLoader,
  } = useRequest({ autoStopLoading: false });

  if (!businesses) return <div>{props.error}</div>;

  let [category, city, stateCode] = (query.slug as string[]) || [];
  category = category && stringUtils.toTitleCase(category?.split('_').join(' '));
  city = city && stringUtils.toTitleCase(city?.split('_').join(' '));

  const endOffset = itemOffset + 20;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = businesses.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(businesses.length / 20);

  const handlePageChange = (event: { selected: number }): void => {
    const newOffset = (event.selected * 20) % businesses.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`,
    );
    setItemOffset(newOffset);
  };

  const showLoader = () => startSearchLoader();

  useEffect(() => {
    return stopSearchLoader;
  }, []);

  return (
    <>
      {/* style={{ borderBottom: '1px solid #ccc' }} */}
      <Navbar bg="rgba(0,0,0, .7)" position="fixed">
        <BusinessSearchForm
          fontSize="12px"
          isLoading={isSearching}
          showLoader={showLoader}
        />
      </Navbar>
      <Layout>
        <div className={styles.businessesResultsPage}>
          <h2 className={styles.heading}>
            {category} in {city}
          </h2>
          <aside className={styles.mapPreview} style={{ position: 'relative' }}>
            <Image src="/img/map-img.jpg" layout="fill" />
            <button className={cls(styles.btnViewMap, 'btn btn-outline-pry')}>
              View on map
            </button>
          </aside>
          <Filters styles={styles} />
          <AllBusinesses businesses={businesses} styles={styles} />
          {/* <div className={styles.pagination}>
            <ul className={styles.paginators}>
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
            </ul>
            {props.businesses?.length ? (
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageChange}
                pageRangeDisplayed={10}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={() => {}}
              />
            ) : null}
          </div> */}
        </div>
      </Layout>
    </>
  );
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

    if (data.status !== 'SUCCESS') throw Error('An error occurred');
    console.log(data);
    console.log({ results: data.results, all: data.all });

    return { props: data };
  } catch (err) {
    console.error('Error: ', err);
    return { props: { error: 'Sorry, something wrong happened' } };
  }
};

export const getStaticPaths: GetStaticPaths = async function () {
  return {
    paths: [{ params: { slug: ['restaurants', 'anchorage', 'AK'] } }],
    fallback: 'blocking',
  };
};
export default SearchBusinessResultsPage;
