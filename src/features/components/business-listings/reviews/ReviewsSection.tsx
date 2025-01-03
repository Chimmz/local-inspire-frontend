import React, {
  ChangeEventHandler,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from 'react';
// Types
import { ReviewProps } from '../../page-reviews/UserReview';
// Hooks
import useRequest from '../../../hooks/useRequest';
import usePaginate from '../../../hooks/usePaginate';
// Utils
import { reviewReportReasonsConfig } from './config';
import api from '../../../library/api';
import cls from 'classnames';
// Components
import LabelledCheckbox from '../../shared/LabelledCheckbox';
import ReviewItem from './ReviewItem';
import Spinner from '../../shared/spinner/Spinner';
import NoReviewsYet from './NoReviewsYet';
import { UserPublicProfile } from '../../../types';
import Paginators from '../../shared/pagination/Paginators';
import ReportQA from '../../ReportQA';
import SocialShareModal from '../../shared/social-share/SocialShare';
import ReviewLikersModal from './ReviewLikersModal';
import { BusinessProps } from '../../business-results/Business';
import { genUserReviewPageUrl } from '../../../utils/url-utils';
import * as domUtils from '../../../utils/dom-utils';
import styles from './ReviewsSection.module.scss';

type ReviewFilter =
  | 'Excellent'
  | 'Very Good'
  | 'Average'
  | 'Poor'
  | 'Terrible'
  | 'Recommends'
  | 'Helpful';

const filterToQueryMap = new Map([
  ['Excellent', { rating: 5 }],
  ['Very Good', { rating: 4 }],
  ['Average', { rating: 3 }],
  ['Poor', { rating: 2 }],
  ['Terrible', { rating: 1 }],
  ['Recommends', { recommends: 1 }],
  ['Helpful', { sort: '-likes' }],
]);

interface QueryProperties {
  match: { [key: string]: string[] };
  sort: string[];
}

interface Props {
  show: boolean;
  reviews: ReviewProps[] | undefined;
  totalReviewsCount: number;
  businessName: string;
  businessId: string;
  business: BusinessProps | undefined;
  sendRequest: (req: Promise<any>) => any;
  loading: boolean;
}

const REVIEWS_PER_PAGE = 3;
const MAX_PAGES = 3;
const MAX_ITEMS = MAX_PAGES * REVIEWS_PER_PAGE; // 15

function ReviewsSection(props: Props) {
  const [reviews, setReviews] = useState<ReviewProps[]>(props.reviews || []);
  const [totalReviewsCount, setTotalReviewsCount] = useState(props.totalReviewsCount);

  const [filters, setFilters] = useState<ReviewFilter[]>([]);
  const [queryStr, setQueryString] = useState('');

  const [reviewReportId, setReviewReportId] = useState<string | null>(null);
  const [reviewToShare, setReviewToShare] = useState<ReviewProps | null>(null);

  const [reviewLikers, setReviewLikers] = useState<null | {
    reviewId: string;
  }>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { send: sendFilterReq, loading: isFilteringReviews } = useRequest();

  const { currentPage } = usePaginate({ init: reviews });

  useEffect(() => {
    const queryProperties: QueryProperties = { match: {}, sort: [] };

    filters.forEach((filter, i) => {
      const query = filterToQueryMap.get(filter);

      if ('sort' in query!) {
        queryProperties.sort.push(query.sort!);
      } else {
        const [k, v] = Object.entries(query!).flat();
        if (!queryProperties.match[k]) queryProperties.match[k] = [v];
        else queryProperties.match[k].push(v);
      }
    });

    let queryStr = '?';

    for (let queryType in queryProperties) {
      switch (queryType) {
        case 'match':
          Object.keys(queryProperties[queryType]).map(k => {
            queryStr += `${k}=${queryProperties.match[k].join(',')}`;
            queryStr += '&';
          });
          break;
        case 'sort':
          if (!queryProperties.sort.length) continue;
          queryStr += `sort=${queryProperties.sort.join(',')}`;
          queryStr += '&';
          break;
      }
    }
    console.log(queryStr.slice(0, -1));
    console.log(queryProperties);
    setQueryString(queryStr.slice(0, -1));
  }, [filters.length]);

  const filterReviews = async (opts?: {
    page: number;
    limit: number;
    onFilterScrollToSection?: boolean;
  }) => {
    const req = api.getBusinessReviews(props.businessId, queryStr, opts);
    const res = await props.sendRequest(sendFilterReq(req));

    if (res?.status !== 'SUCCESS') return;
    console.log({ 'res.data': res.data });
    setReviews(res.data);
    setTotalReviewsCount(res.total); // In case there are new reviews in the DB
    if (opts?.onFilterScrollToSection) domUtils.scrollToElement(sectionRef.current!);
  };

  useEffect((): any => {
    if (queryStr.length) filterReviews();
    else if (props.reviews) setReviews(props.reviews);
  }, [queryStr]);

  const handleCheckInput: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const filter = target.value as ReviewFilter;
    switch (target.checked) {
      case true:
        setFilters(filters => [filter, ...filters]);
        break;
      case false:
        setFilters(filters => filters.filter(f => f !== filter));
        break;
    }
  };

  const handlePageChange = async (newPage: number) => {
    filterReviews({ page: newPage, limit: REVIEWS_PER_PAGE, onFilterScrollToSection: true });
  };

  const totalPages = useMemo(() => {
    const itemsExceedMaxItems = totalReviewsCount >= MAX_ITEMS;
    return itemsExceedMaxItems ? MAX_PAGES : Math.ceil(totalReviewsCount / REVIEWS_PER_PAGE);
  }, [totalReviewsCount, MAX_ITEMS, MAX_PAGES, REVIEWS_PER_PAGE]);

  const showWith = useCallback(
    (showClassName: string) => (!props.show ? 'd-none' : showClassName),
    [props.show],
  );

  return (
    <section className={styles.reviewsSection} ref={sectionRef}>
      <div
        className={cls(
          styles.reviewsSectionHeader,
          showWith((reviews?.length && 'd-block') || ''),
        )}
      >
        <h2>Reviews</h2>
        <hr />
        {reviews?.length ? (
          <small className="d-block my-4">Filter for better results</small>
        ) : null}

        {/* Checkbox filters section in header */}
        <section className={cls(styles.filters, reviews?.length ? 'd-flex' : 'd-none')}>
          {Array.from(filterToQueryMap.keys()).map(filterName => (
            <LabelledCheckbox
              key={filterName}
              label={<small>{filterName}</small>}
              onChange={handleCheckInput}
              value={filterName}
            />
          ))}
        </section>
        <Spinner show={isFilteringReviews} pageWide />
      </div>

      {/* All reviews, paginated and filtered */}
      {reviews?.map(r => (
        <ReviewItem
          key={r._id}
          {...r}
          show={!!reviews?.length && props.show}
          businessName={props.businessName}
          businessData={props.business!}
          openReviewLikers={(reviewId: string) => setReviewLikers({ reviewId })}
          openReportModal={(reviewId: string) => setReviewReportId(reviewId)}
          openShareModal={setReviewToShare}
        />
      ))}

      {/* Pagination */}
      {reviews.length ? (
        <div className={cls('align-items-center justify-content-between', showWith('d-flex'))}>
          <Paginators
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pageCount={totalPages}
          />
        </div>
      ) : null}

      {/* Default if no reviews */}
      <NoReviewsYet businessName={props.businessName} show={!reviews?.length && props.show} />

      {/* The Report modal */}
      <ReportQA
        show={!!reviewReportId}
        reportObjectId={reviewReportId as string}
        reportType="review"
        possibleReasons={reviewReportReasonsConfig}
        close={setReviewReportId.bind(null, null)}
      />

      {/* Modal showing likers of a review */}
      <ReviewLikersModal
        show={!!reviewLikers}
        closeModal={setReviewLikers.bind(null, null)}
        reviewId={reviewLikers?.reviewId}
      />

      {/* Share review */}
      <SocialShareModal
        heading="Share Review"
        pageUrl={() => {
          if (props.business && reviewToShare)
            return genUserReviewPageUrl({
              ...props.business!,
              reviewId: reviewToShare?._id!,
              reviewTitle: reviewToShare?.reviewTitle!,
            });
          return '';
        }}
        imgUrl={reviewToShare?.images?.[0]?.photoUrl || props.business?.images?.[0]?.imgUrl}
        show={!!reviewToShare}
        close={setReviewToShare.bind(null, null)}
        title={reviewToShare?.reviewTitle!}
      />
    </section>
  );
}

export default React.memo(ReviewsSection);
