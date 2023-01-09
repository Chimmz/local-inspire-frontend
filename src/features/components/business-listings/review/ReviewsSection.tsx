import React, { ChangeEventHandler, useEffect, useMemo, useRef, useState } from 'react';

import { Icon } from '@iconify/react';
import { Form } from 'react-bootstrap';
import LabelledCheckbox from '../../shared/LabelledCheckbox';
import styles from './Reviews.module.scss';
import Image from 'next/image';
import cls from 'classnames';
import Link from 'next/link';
import StarRating from '../../shared/star-rating/StarRating';
import { ReviewProps } from '../../recommend-business/UserReview';
import useSignedInUser from '../../../hooks/useSignedInUser';
import api from '../../../library/api';
import useRequest from '../../../hooks/useRequest';
// import { simulateRequest } from '../../utils/async-utils';
import FeatureRating from '../../shared/feature-rating/FeatureRating';
import ReviewItem from './ReviewItem';
import { simulateRequest } from '../../../utils/async-utils';
import Spinner from '../../shared/spinner/Spinner';

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
  const { accessToken } = useSignedInUser();
  const { send: sendFilterReq, loading: isFilteringReviews } = useRequest({
    autoStopLoading: true,
  });

  const [filters, setFilters] = useState<ReviewFilter[]>([]);
  const [queryStr, setQueryString] = useState('');

  interface FullQuery {
    match: { [key: string]: string[] };
    sort: string[];
  }

  const filterReviews = async () => {
    console.log('In filterReviews');
    // await simulateRequest(5, sendFilterReq);
    const res = await sendFilterReq(
      api.getBusinessReviews(props.businessId, accessToken!, queryStr),
    );
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
      case undefined:
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
      <section className={cls(props.show ? 'd-block' : 'd-none')}>
        <h2>Reviews</h2>
        <hr />
        <small className="d-block my-4">Filter for better results</small>

        {filtersUI}

        <Spinner show={isFilteringReviews} pageWide />
      </section>

      {reviews?.map(r => (
        <ReviewItem
          {...r}
          show={props.show}
          businessName={props.businessName}
          key={r._id}
        />
      ))}
    </>
  );
}

export default React.memo(ReviewsSection);
