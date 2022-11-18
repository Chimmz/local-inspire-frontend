import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ReactPaginate from 'react-paginate';

import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import Image from 'next/image';

import useRequest from '../../features/hooks/useRequest';
import usePaginate from '../../features/hooks/usePaginate';

import { ParsedUrlQuery } from 'querystring';
import * as uuid from 'uuid';
import API from '../../features/library/api';
import * as stringUtils from '../../features/utils/string-utils';

import cls from 'classnames';
import Layout from '../../features/components/layout';
import Navbar from '../../features/components/layout/Navbar';
import BusinessSearchForm from '../../features/components/shared/businesses-search/BusinessSearchForm';
import Filters from '../../features/components/business-results/Filters';
import AllBusinesses from '../../features/components/business-results/AllBusinesses';
import GoogleMapView from '../../features/components/business-results/GoogleMapBusinessView';
import styles from '../../styles/sass/pages/BusinessResultsPage.module.scss';
import BusinessesGroup from '../../features/components/business-results/BusinessesGroup';
import { BusinessProps } from '../../features/components/business-results/Business';
import CategoriesNav from '../../features/components/business-results/CategoriesNav';
import * as urlUtils from '../../features/utils/url-utils';

interface SearchParams extends ParsedUrlQuery {
  businessSearchParams: string;
}
interface Props {
  businesses?: { [key: string]: any }[];
  results?: number;
  allResults?: number;
  status: 'SUCCESS' | 'ERROR';
  defaultCategorySuggestions: string[];
  sponsored?: BusinessProps[];
  specials: Array<{ title: string; items: Array<BusinessProps> }>;
  searchParams: { category: string; city: string; stateCode: string };
  pageId: string;
}

const PER_PAGE = 20;

const BusinessSearchResultsPage: NextPage<Props> = function (props) {
  const [propsData, setPropsData] = useState<Props>(props);
  const [showGoogleMap, setShowGoogleMap] = useState(false);

  const router = useRouter();
  console.log('PATHNAME: ', router.route);

  const {
    category: currentCategory,
    city: currentCity,
    stateCode: currentStateCode,
  } = props.searchParams;

  const [categoryTitle, cityTitle] = [
    stringUtils.toTitleCase(currentCategory),
    stringUtils.toTitleCase(currentCity),
  ];

  const error = propsData?.status !== 'SUCCESS';

  const {
    startLoading: startNewSearchLoader,
    stopLoading: stopNewSearchLoader,
    loading: newSearchLoading,
  } = useRequest({ autoStopLoading: false });

  const {
    currentPage,
    currentPageData,
    setPageData,
    setCurrentPage,
    pageHasData,
    resetPagesData,
    resetCurrentPage,
  } = usePaginate({
    defaultCurrentPage: 1,
    init: { 1: propsData as any },
  });

  useEffect(() => {
    const paginators = document.querySelector("[class*='paginators']");
    const anchors = paginators?.querySelectorAll('a');

    anchors?.forEach(a => {
      a.onclick = () => window.scrollTo(0, 1700);
    });
    console.log({ anchors });
  }, [currentPage]);

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

  const onSearchHandler = (categoryValue: string, locationValue: string) => {
    if (!categoryValue || !locationValue) return;

    const [cityValue, stateValue] = locationValue.split(', ');
    console.log({ cityValue, stateValue });
    if (
      currentCategory === categoryValue.toLowerCase() &&
      currentCity === cityValue.toLowerCase() &&
      currentStateCode === stateValue
    )
      return console.log('Same as current page query');

    startNewSearchLoader();
    const url = urlUtils.getBusinessSearchResultsUrl({
      category: categoryValue,
      city: cityValue,
      stateCode: stateValue,
    });
    console.log('To push: ', url);
    router.push(url);
  };

  const handlePageChange: (arg: { selected: number }) => void = async param => {
    const { selected: pageIndex } = param;
    const currentPage = pageIndex + 1;
    console.log({ currentPage });

    setCurrentPage(currentPage);
    if (pageHasData(currentPage, 'businesses')) return;

    const res = await API.findBusinesses(
      currentCategory,
      currentCity,
      currentStateCode,
      currentPage,
      PER_PAGE,
    );
    if (res) setPageData(currentPage, res);
    console.log(res);
  };

  useEffect(() => {
    stopNewSearchLoader();
  }, [propsData.pageId]);

  return (
    <>
      <Head>
        <title>{`${categoryTitle} in ${cityTitle} | Local Inspire`}</title>
        <meta
          name="description"
          content={`Find Top Ranking ${categoryTitle} in ${cityTitle}`}
        ></meta>
      </Head>
      <Navbar bg="#003366" position="sticky" styleName={styles.navbar} lightLogo>
        <BusinessSearchForm
          promptUserInput={false}
          fontSize="13px"
          defaultCategorySuggestions={props.defaultCategorySuggestions}
          onSearch={onSearchHandler}
          loading={newSearchLoading}
          // maxWidth="40vw"
        />
      </Navbar>
      <CategoriesNav
        popularCategories={props.defaultCategorySuggestions}
        searchParams={props.searchParams}
      />
      <Layout>
        <div className={styles.businessesResultsPage}>
          <h2 className={styles.heading}>
            {!propsData.results || error ? `"${categoryTitle}"` : categoryTitle}
            {' in '}
            {propsData.results ? cityTitle : `"${cityTitle}"`}
          </h2>
          <aside className={styles.aside}>
            <div className={styles.mapPreview} style={{ position: 'relative' }}>
              <Image src="/img/map-img.jpg" layout="fill" />
              <button
                className={cls(styles.btnViewMap, 'btn btn-outline-pry')}
                onClick={() => setShowGoogleMap(true)}
              >
                View map
              </button>
            </div>

            <Filters styles={styles} />
          </aside>

          <div className={styles.searchResults}>
            {propsData.specials.map(group => (
              <BusinessesGroup
                groupName={group.title}
                businesses={group.items}
                key={group.title}
              />
            ))}
            <AllBusinesses
              data={currentPageData as { [key: string]: any }}
              allResults={propsData.allResults!}
            />
          </div>

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
          <GoogleMapView shown={showGoogleMap} closeMap={() => setShowGoogleMap(false)} />
        </div>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async function () {
  return {
    paths: [{ params: { businessSearchParams: 'restaurants,anchorage,AK' } }],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async function (context) {
  console.log('getStaticProps Context: ', context);

  const parsedResult = urlUtils.parseBusinessSearchUrlParams(
    (context.params as SearchParams).businessSearchParams,
  );
  console.log({ parsedResult });
  if (parsedResult instanceof Error) return { notFound: true };

  const { category, city, stateCode } = parsedResult;

  if (!category || !city || !stateCode) return { notFound: true };

  const defaultCategorySuggestions = [
    'Hotels and motels',
    'Restaurants',
    'Cabins Rentals',
    'Vacation Rentals',
    'Things to do',
    'Cruises',
  ];

  const pageId = uuid.v4();

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
    if (!data) throw Error('');

    const { businesses, ...others } = data;
    console.log(others);

    return {
      props: {
        ...data,
        pageId,
        defaultCategorySuggestions,
        specials: [
          { title: 'Sponsored', items: data?.businesses?.slice(0, 10) || [] },
          { title: 'Top 10 businesses', items: data?.businesses?.slice(0, 10) || [] },
        ],
        searchParams: parsedResult,
      },
    };
  } catch (err) {
    console.error('Error: ', err);
    return { props: { error: 'Sorry, something wrong happened', pageId } };
  }
};

export default BusinessSearchResultsPage;
// https://ihsavru.medium.com/react-paginate-implementing-pagination-in-react-f199625a5c8e
