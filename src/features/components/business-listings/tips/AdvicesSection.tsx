import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

import usePaginate from '../../../hooks/usePaginate';

import cls from 'classnames';
import Tip, { TipProps } from './Tip';
import { genRecommendBusinessPageUrl } from '../../../utils/url-utils';

import Paginators from '../../shared/pagination/Paginators';
import NoReviewsYet from '../reviews/NoReviewsYet';
import api from '../../../library/api';
import { BusinessProps } from '../../business-results/Business';
import * as domUtils from '../../../utils/dom-utils';
import useMiddleware from '../../../hooks/useMiddleware';
import ReportQA from '../../ReportQA';
import { reviewReportReasonsConfig } from '../reviews/config';
import styles from './AdvicesSection.module.scss';

interface AdvicesSectionProps {
  show: boolean;
  // tips?: TipProps[] | undefined;
  tipsTotal: number;
  slug: string;
  business: BusinessProps;
  businessName: string | undefined;
  businessId: string | undefined;
  sendRequest: (req: Promise<any>) => any;
  loading: boolean;
}

const TIPS_PER_PAGE = 5;
const MAX_PAGES = 3;
const MAX_ITEMS = MAX_PAGES * TIPS_PER_PAGE; // 15

const AdvicesSection = function (props: AdvicesSectionProps) {
  const [tipsTotal, setTipsTotal] = useState(props.tipsTotal);
  const [adviceIdReport, setAdviceIdReport] = useState<string | null>(null);

  const tipsSectionRef = useRef<HTMLElement | null>(null);
  const { withAuth } = useMiddleware();
  const { currentPage, currentPageData, setCurrentPage, setPageData, getPageData } = usePaginate<
    TipProps[]
  >({ init: { 1: [] } });

  const loadAdvices = async (page: number, onFetchScrollToSection: boolean = false) => {
    try {
      const req = api.getTipsAboutBusiness(props.businessId!, { page, limit: TIPS_PER_PAGE });
      const res = await props.sendRequest(req);
      if (res?.status !== 'SUCCESS') return;
      if (tipsTotal !== res.total) setTipsTotal(res.total);

      setPageData(page, res.data);
      setCurrentPage(page);
      if (onFetchScrollToSection) domUtils.scrollToElement(tipsSectionRef.current!);
    } catch (err) {
      console.log('Error in fetching tips: ', err);
    }
  };

  useEffect(() => {
    const firstPage = 1;
    loadAdvices(firstPage);
  }, []);

  const handlePageChange = async (newPage: number) => {
    // If data for this page has been fetched before
    if (getPageData(newPage)?.length) {
      setCurrentPage(newPage);
      return domUtils.scrollToElement(tipsSectionRef.current!);
    }
    loadAdvices(newPage, true);
  };

  const openAdviceReportModal = function (tId: string) {
    withAuth(_ => setAdviceIdReport(tId));
  };
  const handleReportAdvice = async function (reason: string, explanation: string) {
    console.log(`Reported ${adviceIdReport} because ${reason}. More details: ${explanation}`);
  };

  const totalPages = useMemo(() => {
    const itemsExceedMaxItems = tipsTotal >= MAX_ITEMS;
    return itemsExceedMaxItems ? MAX_PAGES : Math.ceil(tipsTotal / TIPS_PER_PAGE);
  }, [tipsTotal, MAX_ITEMS, MAX_PAGES, TIPS_PER_PAGE]);

  const reviewPageUrl = genRecommendBusinessPageUrl<string>({
    slug: props.slug,
    recommends: null,
  });

  const showWith = useCallback(
    (showClassName: string) => (!props.show ? 'd-none' : showClassName),
    [props.show],
  );

  return (
    <section className={cls(styles.tipsSection, showWith('d-block'))} ref={tipsSectionRef}>
      <div className="d-flex align-items-center justify-content-between flex-wrap py-4 px-4 border-bottom">
        <h2>Tips/Advice</h2>

        <Link href={reviewPageUrl} passHref>
          <a className="btn btn-pry">Write a review</a>
        </Link>
      </div>

      {/* Each tip in current page */}
      {currentPageData?.map(tip => (
        <Tip
          {...tip}
          show={props.show && !!currentPageData?.length}
          key={tip._id}
          slug={props.slug}
          business={props.business}
          openAdviceReportModal={openAdviceReportModal}
        />
      ))}

      {/* Pagination */}
      {currentPageData?.length ? (
        <div className={showWith('d-block')}>
          <Paginators
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pageCount={totalPages}
          />
        </div>
      ) : null}

      {/* If there are no tips (reviews) */}
      <NoReviewsYet
        businessName={props.businessName}
        show={props.show && !currentPageData?.length}
      />

      <ReportQA
        show={!!adviceIdReport}
        reportObjectId={adviceIdReport!}
        reportType="advice"
        possibleReasons={reviewReportReasonsConfig}
        close={setAdviceIdReport.bind(null, null)}
        onReport={handleReportAdvice}
      />
    </section>
  );
};

export default AdvicesSection;
