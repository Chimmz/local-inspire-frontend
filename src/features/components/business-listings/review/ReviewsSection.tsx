import React, { ChangeEventHandler, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
// Types
import { ReviewProps } from '../../recommend-business/UserReview';
// Hooks and Utils
import useRequest from '../../../hooks/useRequest';
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
import { UserRoles } from '../../../data/constants';
import * as userUtils from '../../../utils/user-utils';

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
  ['Helpful', { sort: '-likedBy' }],
]);

interface Props {
  show: boolean;
  reviews: ReviewProps[] | undefined;
  businessName: string;
  businessId: string;
}

function ReviewsSection(props: Props) {
  const [reviews, setReviews] = useState<ReviewProps[]>(props.reviews || []);

  const [filters, setFilters] = useState<ReviewFilter[]>([]);
  const [queryStr, setQueryString] = useState('');

  const { send: sendFilterReq, loading: isFilteringReviews } = useRequest({
    autoStopLoading: true,
  });

  const [reviewLikers, setReviewLikers] = useState<null | {
    likers: UserPublicProfile[];
    reviewerName: string;
  }>(null);

  interface FullQuery {
    match: { [key: string]: string[] };
    sort: string[];
  }

  const filterReviews = async () => {
    console.log('In filterReviews');
    // await simulateRequest(5, sendFilterReq);
    const res = await sendFilterReq(api.getBusinessReviews(props.businessId, queryStr));
    res?.status === 'SUCCESS' && setReviews(res.data);
  };

  useEffect(() => {
    if (!queryStr.length && props.reviews) setReviews(props.reviews);
    else filterReviews();
  }, [queryStr]);

  useEffect(() => {
    const fullQuery: FullQuery = { match: {}, sort: [] };

    filters.forEach((filter, i) => {
      const query = filterToQueryMap.get(filter);

      if ('sort' in query!) {
        fullQuery.sort.push(query.sort!);
      } else {
        const [k, v] = Object.entries(query!).flat();
        if (!fullQuery.match[k]) fullQuery.match[k] = [v];
        else fullQuery.match[k].push(v);
      }
    });

    let queryStr = '?';

    for (let queryType in fullQuery) {
      switch (queryType) {
        case 'match':
          Object.keys(fullQuery[queryType]).map(k => {
            queryStr += `${k}=${fullQuery.match[k].join(',')}`;
            queryStr += '&';
          });
          break;
        case 'sort':
          if (!fullQuery.sort.length) continue;
          queryStr += `sort=${fullQuery.sort.join(',')}`;
          queryStr += '&';
          break;
      }
    }
    console.log(queryStr.slice(0, -1));
    setQueryString(queryStr.slice(0, -1));
  }, [filters.length]);

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

  const filtersUI = useMemo(() => {
    return (
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
    );
  }, []);

  return (
    <>
      <section className={cls(props.show && props.reviews?.length ? 'd-block' : 'd-none')}>
        <h2>Reviews</h2>
        <hr />
        <small className="d-block my-4">Filter for better results</small>

        {filtersUI}

        <Spinner show={isFilteringReviews} pageWide />
      </section>

      {reviews?.map(r => (
        <ReviewItem
          {...r}
          show={!!props.reviews?.length && props.show}
          businessName={props.businessName}
          showReviewLikers={(likers: UserPublicProfile[], reviewerName: string) =>
            setReviewLikers({ likers, reviewerName })
          }
          key={r._id}
        />
      ))}

      <NoReviewsYet
        businessName={props.businessName}
        show={!props.reviews?.length && props.show}
      />

      <Modal centered scrollable show={!!reviewLikers} onHide={() => setReviewLikers(null)}>
        <Modal.Header
          style={{ backgroundColor: '#f3f3f3' }}
          className="px-5 py-4 pb-3"
          closeButton
        >
          <h2>
            {reviewLikers && (
              <>
                <Link href="/">{reviewLikers?.reviewerName}</Link>'s review
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
                    <strong>{UserRoles[user.role]}</strong>
                  </h4>
                  <small>0 contributions • 0 Followers</small>
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
