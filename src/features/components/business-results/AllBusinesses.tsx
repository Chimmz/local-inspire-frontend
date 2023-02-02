import cls from 'classnames';
import Spinner from '../shared/spinner/Spinner';
import Business, { BusinessProps } from './Business';
import styles from './AllBusinesses.module.scss';
import { v4 as uuid } from 'uuid';
import useRequest from '../../hooks/useRequest';
import { useEffect, useState } from 'react';
import { ReviewProps } from '../page-reviews/UserReview';
import useSignedInUser from '../../hooks/useSignedInUser';
import api from '../../library/api';

interface Props {
  data: { [key: string]: any };
  page: number;
  allResults?: number;
  type?: string;
}

function AllBusinesses(props: Props) {
  const { data, allResults, page } = props;
  const error = data?.status !== 'SUCCESS';

  // State that maps a business' id to a logged-in user's review on that business
  const [userReviewLookup, setUserReviewLookup] = useState<{
    [businessId: string]: ReviewProps;
  }>({});

  const { send: sendUserReviewsReq, loading: isGettingUserReviews } = useRequest({
    autoStopLoading: false,
  });
  const loggedInUser = useSignedInUser();

  useEffect(() => {
    if (!loggedInUser.isSignedIn) return;
    const normalizedUserReviews: { [businessId: string]: ReviewProps } = {};

    sendUserReviewsReq(api.getReviewsMadeByUser(loggedInUser.accessToken!))
      .then(res => {
        console.log('Reponse: ', res);
        if (!res || res?.status !== 'SUCCESS') return;
        (res.reviews as ReviewProps[]).forEach(r => {
          normalizedUserReviews[r.business] = r;
        });
        setUserReviewLookup(normalizedUserReviews);
      })
      .catch(console.log);
  }, [loggedInUser.isSignedIn]);

  if (!data)
    return (
      <div className={cls(styles.businesses, styles.noResults)}>
        <Spinner colors={['#0084ff', '#e87525']} />
      </div>
    );

  if (error)
    return (
      <div className={cls(styles.businesses, styles.noResults)}>
        Sorry, something wrong happened
      </div>
    );

  if (!data.businesses.length)
    return (
      <div className={cls(styles.businesses, styles.noResults)}>
        No results. Try searching for something else
      </div>
    );

  const getBusinessSerialNumber = (i: number) => (page - 1) * 20 + i + 1;

  return (
    <ul className={cls(styles.businesses, 'no-bullets')} id="all-businesses">
      <small className={styles.totalResults}>{allResults} results</small>
      {(data.businesses as BusinessProps[])?.map((b, i) => {
        const reviewedByUser = b._id in userReviewLookup;

        return (
          <Business
            {...b}
            key={b._id}
            featured={false}
            index={getBusinessSerialNumber(i)}
            reviewedByCurrentUser={reviewedByUser}
            photoUrl={reviewedByUser ? userReviewLookup[b._id].images[0].photoUrl : undefined}
            userRating={reviewedByUser ? userReviewLookup[b._id].businessRating : undefined}
            reviewText={reviewedByUser ? userReviewLookup[b._id].review : undefined}
          />
        );
      })}
    </ul>
  );
}

export default AllBusinesses;
