import { useState, useEffect, useCallback } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ReactPaginate from 'react-paginate';

import { BusinessProps } from '../../features/components/business-results/Business';

import useRequest from '../../features/hooks/useRequest';
import usePaginate from '../../features/hooks/usePaginate';

import * as uuid from 'uuid';
import * as urlUtils from '../../features/utils/url-utils';
import * as stringUtils from '../../features/utils/string-utils';
import { ParsedUrlQuery } from 'querystring';
import API from '../../features/library/api';

import cls from 'classnames';
import Layout from '../../features/components/layout';
import Navbar from '../../features/components/layout/navbar/Navbar';
import BusinessSearchForm from '../../features/components/shared/businesses-search/BusinessSearchForm';
import Filters from '../../features/components/business-results/Filters';
import AllBusinesses from '../../features/components/business-results/AllBusinesses';
import MapView from '../../features/components/business-results/MapView';
import styles from '../../styles/sass/pages/BusinessResultsPage.module.scss';
import FeaturedBusinesses from '../../features/components/business-results/FeaturedBusinesses';
import CategoriesNav from '../../features/components/business-results/CategoriesNav';
import Spinner from '../../features/components/shared/spinner/Spinner';
import Paginators from '../../features/components/shared/pagination/Paginators';
import { Icon } from '@iconify/react';
import AuthContextProvider from '../../features/contexts/AuthContext';

interface SearchParams extends ParsedUrlQuery {
  businessSearchParams: string;
}
interface Props {
  status: 'SUCCESS' | 'ERROR';
  error?: string;
  businesses?: { [key: string]: any }[];
  results?: number;
  allResults?: number;
  defaultCategorySuggestions: string[];
  sponsored?: BusinessProps[];
  specials: Array<{ title: string; items: Array<BusinessProps> }>;
  pageSearchParams: { category: string; city: string; stateCode: string };
  pageId: string;
  pageLoading: boolean;
}

const PER_PAGE = 20;

const BusinessSearchResultsPage: NextPage<Props> = function (props) {
  const [pageLoading, setPageLoading] = useState(props.pageLoading);
  const [propsData, setPropsData] = useState<Props>(props);
  const [showGoogleMap, setShowGoogleMap] = useState(false);

  const router = useRouter();

  const {
    category: currentCategory,
    city: currentCity,
    stateCode: currentStateCode,
  } = props.pageSearchParams;

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

  const { currentPage, currentPageData, setPageData, setCurrentPage, pageHasData } =
    usePaginate<{ status: string; businesses: BusinessProps[] }>({
      defaultCurrentPage: 1,
      init: { 1: propsData as any },
    });

  useEffect(() => {
    const paginators = document.querySelector("[class*='paginators']");
    const anchors = paginators?.querySelectorAll('a');

    anchors?.forEach(a => {
      a.onclick = () => window.scrollTo(0, 2000);
    });
    // console.log({ anchors });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    const paginators = document.querySelector("[class*='paginators']");

    const previousActivePaginator = paginators?.querySelector('li.selected');
    // console.log({ previousActivePaginator });
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

    let [cityValue, stateValue] = locationValue.split(',');
    [cityValue, stateValue] = [cityValue.trim(), stateValue.trim()];

    console.log({ cityValue: cityValue.trim(), stateValue: stateValue.trim() });
    if (
      currentCategory === categoryValue.toLowerCase() &&
      currentCity === cityValue.trim().toLowerCase() &&
      currentStateCode === stateValue.trim()
    )
      return console.log('Same as current page query');

    startNewSearchLoader();
    setPageLoading(true);

    const url = urlUtils.getBusinessSearchResultsUrl({
      category: categoryValue,
      city: cityValue,
      stateCode: stateValue,
    });
    console.log('To push: ', url);
    router.push(url);
  };

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    if (pageHasData(newPage, 'businesses')) return;

    const res = await API.findBusinesses(
      currentCategory,
      currentCity,
      currentStateCode,
      newPage,
      PER_PAGE,
    );
    if (res) setPageData(newPage, { status: res?.status, businesses: res?.businesses });
    console.log(res);
  };

  useEffect(() => {
    stopNewSearchLoader();
    setPageLoading(false);
  }, [propsData.pageId]);

  return (
    <Layout>
      {pageLoading && <Spinner pageWide />}
      <Head>
        <title>{`${categoryTitle} in ${cityTitle} | Local Inspire`}</title>
        <meta name="description" content={`Find ${categoryTitle} in ${cityTitle}`} />
      </Head>
      <Layout.Nav bg="#003366" lightLogo sticky>
        <CategoriesNav
          searchParams={props.pageSearchParams}
          setPageLoading={setPageLoading}
        />
      </Layout.Nav>
      <Layout.Main className={styles.main}>
        <div className={cls(styles.businessesResultsPage, 'container')}>
          <h1 className={cls(styles.heading, 'text-dark')}>
            {categoryTitle}
            <span style={{ color: '#bbb' }}>{' in '}</span>
            {cityTitle + ', ' + props.pageSearchParams.stateCode.toUpperCase()}
          </h1>
          <aside className={styles.aside}>
            <figure className={styles.mapPreview} style={{ position: 'relative' }}>
              {/* <Image src="/img/map-img.jpg" layout="fill" /> */}
              <MapView
                shown
                closeMap={useCallback(setShowGoogleMap.bind(null, false), [setShowGoogleMap])}
                coords={propsData.businesses?.[0]?.coordinates as string}
                withModal={false}
                scrollZoom={false}
                zoom={7}
              />
              <button
                className={cls(styles.btnViewMap, 'btn btn-outline-pry')}
                onClick={() => setShowGoogleMap(true)}
              >
                View map
              </button>
            </figure>

            <Filters styles={styles} />
          </aside>

          <div className={styles.searchResults}>
            {propsData.specials.map(group => (
              <FeaturedBusinesses
                groupName={group.title}
                businesses={group.items}
                key={group.title}
              />
            ))}
            <AllBusinesses
              data={currentPageData as { [key: string]: any }}
              allResults={propsData.allResults!}
              page={currentPage}
            />
          </div>

          <div className={styles.pagination}>
            {propsData.allResults ? (
              <Paginators
                pageCount={
                  propsData.allResults ? Math.ceil(propsData.allResults / PER_PAGE) : 0
                }
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            ) : null}
          </div>
          <MapView
            shown={showGoogleMap}
            closeMap={useCallback(setShowGoogleMap.bind(null, false), [setShowGoogleMap])}
            coords={currentPageData?.businesses?.[0]?.coordinates as string}
            withModal
            placeName={propsData.businesses?.[0]?.city as string}
          />
        </div>
      </Layout.Main>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async function () {
  return {
    paths: [{ params: { businessSearchParams: 'find=restaurants&location=anchorage-AK' } }],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async function (context) {
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

  try {
    const data = await API.findBusinesses(category, city, stateCode, 1, 20);
    if (!data) throw Error('');

    const { businesses, ...others } = data;
    console.log({ others, businesses: businesses.slice(0, 2) });

    return {
      props: {
        ...data,
        pageId,
        defaultCategorySuggestions,
        specials: [
          { title: 'Sponsored', items: data?.businesses?.slice(0, 10) || [] },
          { title: 'Top 10 businesses', items: data?.businesses?.slice(0, 10) || [] },
        ],
        pageSearchParams: parsedResult,
        pageLoading: true,
      },
    };
  } catch (err) {
    console.log('GSProps Error log: ', err);
    return { props: { error: 'Sorry, something wrong happened', pageId } };
  }
};

export default BusinessSearchResultsPage;
// https://ihsavru.medium.com/react-paginate-implementing-pagination-in-react-f199625a5c8e
