import React, { ChangeEventHandler, useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
// Types
import { ReviewProps } from '../../page-reviews/UserReview';
// Hooks
import useRequest from '../../../hooks/useRequest';
import usePaginate from '../../../hooks/usePaginate';
import useInput from '../../../hooks/useInput';
// Utils
import { reportModalConfig } from './config';
import { UserRoles } from '../../../data/constants';
import * as userUtils from '../../../utils/user-utils';
import { minLength } from '../../../utils/validators/inputValidators';
import { quantitize } from '../../../utils/quantity-utils';
import api from '../../../library/api';
import cls from 'classnames';
// Components
import { Icon } from '@iconify/react';
import { Modal } from 'react-bootstrap';
import LabelledCheckbox from '../../shared/LabelledCheckbox';
import ReviewItem from './ReviewItem';
import Spinner from '../../shared/spinner/Spinner';
import NoReviewsYet from './NoReviewsYet';
import styles from './Reviews.module.scss';
import Link from 'next/link';
import { UserPublicProfile } from '../../../types';
import Paginators from '../../shared/pagination/Paginators';
import PopupInfo from '../../PopupInfo';
import ReportQA from '../../ReportQA';
import TextInput from '../../shared/text-input/TextInput';
import useMiddleware from '../../../hooks/useMiddleware';

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
  const { withAuth } = useMiddleware();

  const [reviewLikers, setReviewLikers] = useState<null | {
    likers: UserPublicProfile[];
    reviewerName: string;
  }>(null);

  const { send: sendFilterReq, loading: isFilteringReviews } = useRequest({
    autoStopLoading: true,
  });

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

  const filterReviews = async (opts?: { page: number; limit: number }) => {
    const req = api.getBusinessReviews(props.businessId, queryStr, opts);
    const res = await props.sendRequest(sendFilterReq(req));

    if (res?.status === 'SUCCESS') {
      setReviews(res.data);
      setTotalReviewsCount(res.total); // In case there are new reviews in the DB
    }
  };

  useEffect(() => {
    if (queryStr.length) {
      filterReviews();
      return;
    } else if (!props.reviews) return;
    setReviews(props.reviews);
    setTotalReviewsCount(props.totalReviewsCount);
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
    filterReviews({ page: newPage, limit: REVIEWS_PER_PAGE });
  };

  const totalPages = useMemo(() => {
    const itemsExceedMaxItems = totalReviewsCount >= MAX_ITEMS;
    return itemsExceedMaxItems ? MAX_PAGES : Math.ceil(totalReviewsCount / REVIEWS_PER_PAGE);
  }, [totalReviewsCount, MAX_ITEMS, MAX_PAGES, REVIEWS_PER_PAGE]);

  const openReportModal = (reviewId: string) => {
    withAuth((_?: string) => setReviewReportId(reviewId));
  };

  const handleReportReview = async (reason: string, explanation: string) => {
    console.log(`Reported ${reviewReportId} because ${reason}. More details: ${explanation}`);
  };

  const showReviewLikers = useCallback(
    function (likers: UserPublicProfile[], reviewerName: string) {
      setReviewLikers({ likers, reviewerName });
    },
    [setReviewLikers],
  );

  const showWith = useCallback(
    (showClassName: string) => (!props.show ? 'd-none' : showClassName),
    [props.show],
  );

  return (
    <>
      <section className={cls(props.show && props.reviews?.length ? 'd-block' : 'd-none')}>
        <h2>Reviews</h2>
        <hr />
        <small className="d-block my-4">Filter for better results</small>

        {/* Checkbox filters section in header */}
        <section className={styles.filters}>
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
      </section>

      {/* All reviews. Paginated and filtered */}
      {reviews?.map(r => (
        <ReviewItem
          {...r}
          show={!!props.reviews?.length && props.show}
          businessName={props.businessName}
          showReviewLikers={showReviewLikers}
          openReportModal={openReportModal}
          key={r._id}
        />
      ))}

      {/* Pagination */}
      {reviews.length ? (
        <div
          className={cls('align-items-center justify-content-between', showWith('d-flex'))}
        >
          <Paginators
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pageCount={totalPages}
          />
        </div>
      ) : null}

      {/* Default if no reviews */}
      <NoReviewsYet
        businessName={props.businessName}
        show={!props.reviews?.length && props.show}
      />

      {/* The Report modal */}
      <ReportQA
        show={!!reviewReportId}
        onReport={handleReportReview}
        close={setReviewReportId.bind(null, null)}
      />

      {/* Modal showing likers of a review */}
      <Modal centered scrollable show={!!reviewLikers} onHide={() => setReviewLikers(null)}>
        <Modal.Header
          style={{ backgroundColor: '#f3f3f3' }}
          className="px-5 py-4 pb-3"
          closeButton
        >
          <h2>
            {reviewLikers && (
              <>
                <Link href="/">{reviewLikers?.reviewerName}</Link>&apos;s review
              </>
            )}
          </h2>
        </Modal.Header>
        <Modal.Body className="px-5">
          <ul className={styles.reviewLikersList}>
            {reviewLikers?.likers?.map(user => (
              <li
                className={cls(styles.liker, 'd-flex align-items-center gap-3 py-4')}
                key={user._id}
              >
                <figure
                  className="position-relative"
                  style={{ width: '50px', height: '50px' }}
                >
                  <Image
                    src={user.imgUrl}
                    layout="fill"
                    objectFit="cover"
                    style={{ borderRadius: '50%' }}
                  />
                </figure>
                <div className="flex-grow-1">
                  <h4>
                    <strong>{userUtils.getFullName(user, { lastNameInitial: true })}</strong>
                  </h4>
                  <small>
                    {quantitize(user.contributions?.length || 0, [
                      'contribution',
                      'contributions',
                    ])}{' '}
                    • 0 Followers
                  </small>
                </div>
                <button className="btn btn-outline-pry btn--sm">
                  <Icon icon="material-symbols:person-add" width={20} /> Follow
                </button>
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default React.memo(ReviewsSection);
