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

const BusinessSearchResultsPage: NextPage<Props> = props => {
  const router = useRouter();
  let [category, city, stateCode] = (router.query.slug as string[]) || [];

  category = category && stringUtils.toTitleCase(category?.split('_').join(' '));
  city = city && stringUtils.toTitleCase(city?.split('_').join(' '));

  const [propsData, setPropsData] = useState<Props>(props);
  const error = propsData?.status !== 'SUCCESS';

  const {
    startLoading: startNewSearchLoader,
    stopLoading: stopNewSearchLoader,
    loading: newSearchLoading,
  } = useRequest({ autoStopLoading: false });

  const { setPageData, currentPageData, setCurrentPage, pageHasData } = usePaginate({
    defaultCurrentPage: 1,
    init: { 1: propsData as any },
  });

  useEffect(() => {
    // setCurrentPage(1);
    const paginators = document.querySelector("[class*='paginators']");
    const previousActivePaginator = paginators?.querySelector('li.selected');
    console.log({ previousActivePaginator });
    // // previousActivePaginator?.classList.remove('selected');
    // const previousActiveLink = previousActivePaginator?.firstElementChild;

    // if (previousActiveLink) {
    //   previousActiveLink.className = previousActiveLink.className
    //     .split(' ')
    //     .filter((cls, i) => {
    //       return !cls.includes('activePagelink');
    //     })
    //     .join(' ');
    //   previousActiveLink.setAttribute('aria-label', '');
    // }
    // const firstPageLink = document.querySelector("[aria-label='Page 1']");
    // console.log({ firstPageLink });
    // if (firstPageLink) {
    //   firstPageLink.classList.add(styles.activePagelink);
    //   firstPageLink.parentElement!.classList.add('selected');
    // }

    setPropsData(props);
    setPageData(1, props as any);
  }, [props, setPropsData, props.pageId]);

  const handleSearchBusinesses = (categoryValue: string, cityValue: string) => {
    if (!categoryValue || !cityValue) return;
    const [categParam, cityParam, stateParam] = [
      stringUtils.toLowerSnakeCase(categoryValue),
      stringUtils.toLowerSnakeCase(cityValue),
      'AK',
    ];
    if (
      category === stringUtils.toTitleCase(categoryValue) &&
      city === stringUtils.toTitleCase(city)
    )
      return console.log('Same as current page query');
    console.log(categoryValue, city);
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
  }, [propsData.pageId]);

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
            {!propsData.results || error ? `"${category}"` : category}
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
            allResults={propsData.allResults!}
            styles={styles}
          />
          <div className={styles.pagination}>
            {propsData.allResults ? (
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageChange}
                // pageRangeDisplayed={10}
                pageCount={
                  propsData.allResults ? Math.ceil(propsData.allResults / PER_PAGE) : 0
                }
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

  const pageId = uuid.v4();

  try {
    const props = await API._makeRequest({
      path: `${api}/businesses/find?category=${category}&city=${city}&stateCode=${stateCode}&page=1&limit=20`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const { businesses, ...others } = props;
    console.log(others);
    return { props: { ...props, pageId } };
  } catch (err) {
    console.error('Error: ', err);
    return { props: { error: 'Sorry, something wrong happened', pageId } };
  }
};

export default BusinessSearchResultsPage;
// https://ihsavru.medium.com/react-paginate-implementing-pagination-in-react-f199625a5c8e
