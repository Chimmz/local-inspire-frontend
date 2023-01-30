import React, {
  ChangeEventHandler,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import usePaginate from '../../../hooks/usePaginate';

import cls from 'classnames';
import Tip, { TipProps } from './Tip';
import navigateTo, {
  genBusinessPageUrl,
  genRecommendBusinessPageUrl,
} from '../../../utils/url-utils';

import Paginators from '../../shared/pagination/Paginators';
import NoReviewsYet from '../reviews/NoReviewsYet';
import api from '../../../library/api';
import { BusinessProps } from '../../business-results/Business';
import * as domUtils from '../../../utils';
import useMiddleware from '../../../hooks/useMiddleware';
import ReportQA from '../../ReportQA';

interface AdvicesSectionProps {
  show: boolean;
  tips?: TipProps[] | undefined;
  tipsTotal: number;
  slug: string;
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
  const tipsSectionRef = useRef<HTMLElement | null>(null);
  const { withAuth } = useMiddleware();
  const [adviceIdReport, setAdviceIdReport] = useState<string | null>(null);

  const { currentPage, currentPageData, setCurrentPage, setPageData, getPageData } =
    usePaginate<TipProps[]>({ init: { 1: props.tips! } });

  const handlePageChange = async (newPage: number) => {
    // If data for this page has been fetched
    if (getPageData(newPage)?.length) {
      setCurrentPage(newPage);
      return domUtils.scrollToElement(tipsSectionRef.current!);
    }

    const req = api.getTipsAboutBusiness(props.businessId!, {
      page: newPage,
      limit: TIPS_PER_PAGE,
    });
    const res = await props.sendRequest(req);
    if (res?.status !== 'SUCCESS') return;

    setPageData(newPage, res.data);
    setCurrentPage(newPage);
    domUtils.scrollToElement(tipsSectionRef.current!);

    // In case there are new tips in DB, let it reflect as a change in the number of pages
    if (tipsTotal !== res.total) setTipsTotal(res.total);
  };

  const openAdviceReportModal = function (tId: string) {
    withAuth((token?: string) => setAdviceIdReport(tId));
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
    <>
      <section
        className={cls(
          props.show ? 'd-flex' : 'd-none',
          'align-items-center justify-content-between flex-wrap',
        )}
        ref={tipsSectionRef}
      >
        <h2>Tips/Advice</h2>

        <Link href={reviewPageUrl} passHref>
          <a className="btn btn-pry">Write a review</a>
        </Link>
      </section>

      {/* Each tip in current page */}
      {currentPageData?.map(tip => (
        <Tip
          {...tip}
          show={props.show && !!props.tips?.length}
          key={tip._id}
          slug={props.slug}
          openAdviceReportModal={openAdviceReportModal}
        />
      ))}

      {/* Pagination */}
      {props.tips?.length ? (
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
        show={props.show && !props.tips?.length}
      />

      <ReportQA
        show={!!adviceIdReport}
        close={setAdviceIdReport.bind(null, null)}
        onReport={handleReportAdvice}
      />
    </>
  );
};

export default AdvicesSection;
