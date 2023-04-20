import { useState, useEffect, useCallback, useMemo } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
// Types
import { BusinessProps } from '../../features/components/business-results/Business';
// Hooks
import useRequest from '../../features/hooks/useRequest';
import usePaginate from '../../features/hooks/usePaginate';
// Utils
import * as uuid from 'uuid';
import * as urlUtils from '../../features/utils/url-utils';
import * as stringUtils from '../../features/utils/string-utils';
import { ParsedUrlQuery } from 'querystring';
import api from '../../features/library/api';
import cls from 'classnames';
// Components
import Layout from '../../features/components/layout';
import Filters from '../../features/components/business-results/Filters';
import AllBusinesses from '../../features/components/business-results/AllBusinesses';
import MapView from '../../features/components/business-results/MapView';
import FeaturedBusinesses from '../../features/components/business-results/FeaturedBusinesses';
import Spinner from '../../features/components/shared/spinner/Spinner';
import CategoriesNav from '../../features/components/layout/navbar/CategoriesNav';
import Paginators from '../../features/components/shared/pagination/Paginators';

import styles from '../../styles/sass/pages/BusinessResultsPage.module.scss';
import * as domUtils from '../../features/utils/dom-utils';
import { AdminFilter } from '../../features/types';

interface SearchParams extends ParsedUrlQuery {
  businessSearchParams: string;
}

interface Props {
  status: 'SUCCESS' | 'ERROR';
  error?: string;
  businesses?: BusinessProps[];
  results?: number;
  total?: number;
  sponsored?: BusinessProps[];
  specials: Array<{ title: string; items: Array<BusinessProps> }>;
  pageParams: { category: string; city: string; stateCode: string };
  pageId: string;
}

const RESULTS_PER_PAGE = 20;
const SEARCH_RESULTS_SECTION_ID = 'search-results-section';
const MAIN_RESULTS_SECTION_ID = 'main-results';

const BusinessSearchResultsPage: NextPage<Props> = function (props) {
  const [propsData, setPropsData] = useState<Props>(props);
  const [totalResults, setTotalResults] = useState(props.total);
  const [selectedTags, setSelectedTags] = useState<string[]>();
  const [showMap, setShowMap] = useState(false);

  const {
    send: sendSearchReq,
    loading: isSearching,
    startLoading: showSearchLoader,
    stopLoading: hideSearchLoader,
  } = useRequest();
  const { send: sendFilterReq, loading: isFiltering } = useRequest();

  const { category, city, stateCode } = useMemo(() => props.pageParams, [props]);

  const {
    currentPage,
    currentPageData,
    setPageData,
    setCurrentPage,
    pageHasData,
    resetAllPages,
  } = usePaginate<{ status: string; businesses: BusinessProps[] }>({
    defaultCurrentPage: 1,
    init: { 1: propsData as any },
  });

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    if (pageHasData(page, data => !!data?.businesses.length)) return;

    const isFilterMode = selectedTags?.length;
    const req = isFilterMode
      ? api.filterBusinesses(selectedTags, propsData.pageParams, {
          page,
          limit: RESULTS_PER_PAGE,
        })
      : api.findBusinesses(category, { city, stateCode }, { page, limit: RESULTS_PER_PAGE });

    sendSearchReq(req)
      .then(res => {
        if (res.status !== 'SUCCESS') return;
        setPageData(page, res);
        domUtils.scrollToElement('#' + SEARCH_RESULTS_SECTION_ID); // Scroll to search results section
      })
      .catch(console.error);
  };

  const filterBusinesses = (tags: string[]) => {
    console.log('In filterBusinesses: ', tags);
    setSelectedTags(tags);
    const noCheckedTags = !tags.length;
    const firstPage = 1;
    setCurrentPage(firstPage); // Set current page to first page
    resetAllPages(); // Clear all pages and use props data

    if (noCheckedTags) {
      setTotalResults(propsData.total);
      setPageData(firstPage, { ...propsData, businesses: propsData.businesses! }); // Register data for first page
      return domUtils.scrollToElement('#' + SEARCH_RESULTS_SECTION_ID); // Scroll to search results section
    }
    const req = api.filterBusinesses(tags, propsData.pageParams, {
      page: firstPage,
      limit: RESULTS_PER_PAGE,
    });
    sendFilterReq(req)
      .then(res => {
        if (res.status !== 'SUCCESS') return;
        setTotalResults(res.total);
        setPageData(firstPage, res); // Register data for first page
        domUtils.scrollToElement('#' + SEARCH_RESULTS_SECTION_ID); // Scroll to search results section
      })
      .catch(console.error);
  };

  useEffect(() => {
    setPropsData(props); // Set new props data
    const firstPage = 1;
    setCurrentPage(firstPage); // Always set to first page when page changes
    setPageData(firstPage, props as any); // Set new page data
    setTotalResults(props.total);
    // const paginators = document.querySelector("[class*='paginators']");
    // const previousActivePaginator = paginators?.querySelector('li.selected');
  }, [props, setPropsData, props.pageId]); // Never include setCurrentPage, setPageData in this list. It causes a limitless rerendering

  useEffect(() => {
    hideSearchLoader(); // Hide the search loader. The loader may have been triggered by the <CategoriesNav />
  }, [propsData.pageId]); // On transition to a new results page

  const pageCount = useMemo(
    () => (totalResults ? Math.ceil(totalResults / RESULTS_PER_PAGE) : 0),
    [propsData, totalResults],
  );

  const [categoryTitle, cityTitle] = useMemo(
    () => [
      stringUtils.toTitleCase(props.pageParams.category),
      stringUtils.toTitleCase(props.pageParams.city),
    ],
    [props.pageParams],
  );

  return (
    <Layout>
      {/* Page white overlay for pending requests */}
      <Spinner show={isSearching || isFiltering} pageWide />

      <Head>
        <title>{`Top ${categoryTitle} in ${cityTitle}, ${props.pageParams?.stateCode} – Updated regularly | Local Inspire`}</title>
        <meta name="description" content={`Find ${categoryTitle} in ${cityTitle}`} />
      </Head>

      <Layout.Nav bg="#003366" lightLogo position="sticky">
        <CategoriesNav showLoader={showSearchLoader} />
      </Layout.Nav>

      <Layout.Main className={styles.main}>
        <div className={cls(styles.businessesResultsPage, 'container')}>
          <h1 className={cls(styles.heading, 'text-dark')}>
            {categoryTitle}
            <span style={{ color: '#bbb' }}>{' in '}</span>
            {cityTitle + ', ' + props.pageParams.stateCode.toUpperCase()}
          </h1>

          {/* Business results */}
          <div className={styles.searchResults} id={SEARCH_RESULTS_SECTION_ID}>
            {propsData.specials.map(group => (
              <FeaturedBusinesses
                title={group.title}
                businesses={group.items}
                key={group.title}
              />
            ))}

            <AllBusinesses
              data={currentPageData}
              total={totalResults}
              page={currentPage}
              sectionId={MAIN_RESULTS_SECTION_ID}
              style={{ scrollPadding: '30px' }}
            />
          </div>

          {/* Map + Filters side-bar */}
          <aside className={styles.aside}>
            <figure className={styles.mapPreview} style={{ position: 'relative' }}>
              <MapView
                show
                closeMap={useCallback(() => setShowMap(false), [setShowMap])}
                coords={propsData.businesses?.[0]?.coordinates as string}
                withModal={false}
                scrollZoom={false}
                zoom={7}
              />
              <button
                className={cls(styles.btnViewMap, 'btn btn-outline-pry')}
                onClick={setShowMap.bind(null, true)}
              >
                View map
              </button>
            </figure>

            <Filters onFilter={filterBusinesses} pageParams={props.pageParams} styles={styles} />
          </aside>

          {/* Pagination */}
          <section className={styles.pagination}>
            {propsData.total ? (
              <Paginators
                onPageChange={handlePageChange}
                currentPage={currentPage}
                pageCount={pageCount}
              />
            ) : null}
          </section>

          {/* Modal showing map*/}
          <MapView
            show={showMap}
            withModal
            closeMap={useCallback(() => setShowMap(false), [setShowMap])}
            coords={currentPageData?.businesses?.[0]?.coordinates as string}
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
    // paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async function (context) {
  const parsedParams = urlUtils.parseBusinessSearchUrlParams(
    (context.params as SearchParams).businessSearchParams,
  );
  if (parsedParams instanceof Error) return { notFound: true }; // In case of invalid params

  const { category, city, stateCode } = parsedParams;
  if (!category || !city || !stateCode) return { notFound: true };

  const pageId = uuid.v4();
  try {
    const res = await api.findBusinesses(category, { city, stateCode }, { page: 1, limit: 20 });
    if (res.status !== 'SUCCESS') throw Error('');

    return {
      props: {
        ...res,
        specials: [
          { title: 'Sponsored', items: res?.businesses?.slice(0, 10) || [] },
          { title: 'Top 10 businesses', items: res?.businesses?.slice(0, 10) || [] },
        ],
        pageParams: parsedParams,
        pageId,
      },
    };
  } catch (err) {
    console.log('GSProps Error log: ', err);
    return { props: { error: 'Sorry, something wrong happened', pageId } };
  }
};

export default BusinessSearchResultsPage;
// https://ihsavru.medium.com/react-paginate-implementing-pagination-in-react-f199625a5c8e
