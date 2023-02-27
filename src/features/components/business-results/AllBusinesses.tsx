import cls from 'classnames';
import Spinner from '../shared/spinner/Spinner';
import Business, { BusinessProps } from './Business';
import styles from './AllBusinesses.module.scss';
import { v4 as uuid } from 'uuid';
import useRequest from '../../hooks/useRequest';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReviewProps } from '../page-reviews/UserReview';
import useSignedInUser from '../../hooks/useSignedInUser';
import api from '../../library/api';

interface Props {
  data?: { status: string; businesses: BusinessProps[] };
  page: number;
  allResults?: number;
  type?: string;
}

function AllBusinesses(props: Props) {
  const { allResults, page } = props;

  // State that maps business ids to logged-in user's reviews
  const [userReviewLookup, setUserReviewLookup] = useState<{
    [businessId: string]: ReviewProps;
  }>({});
  const [peoplesOpinionsAboutBusinesses, setPeoplesOpinionsAboutBusinesses] = useState<{
    [businessId: string]: Array<string[]>;
  }>({});

  const loggedInUser = useSignedInUser();
  const { send: sendUserReviewsReq, loading: isGettingUserReviews } = useRequest({
    autoStopLoading: true,
  });
  const { send: sendOpinionsRequest, loading: isGettingOpinions } = useRequest({
    autoStopLoading: true,
  });

  useEffect(() => {
    if (!loggedInUser.isSignedIn) return;
    const normalizedUserReviews: { [businessId: string]: ReviewProps } = {};

    sendUserReviewsReq(api.getReviewsMadeByUser(loggedInUser.accessToken!))
      .then(res => {
        if (res?.status !== 'SUCCESS') return;
        for (const r of res.reviews as ReviewProps[]) normalizedUserReviews[r.business] = r;
        setUserReviewLookup(normalizedUserReviews);
      })
      .catch(console.log);
  }, [loggedInUser.isSignedIn]);

  useEffect(() => {
    if (Object.keys(peoplesOpinionsAboutBusinesses).length) return; // If opinions have been fetched
    if (!props.data?.businesses) return;

    const businessIds = props.data?.businesses.map(b => b._id);
    console.log({ businessIds });
    if (!businessIds?.length) return;

    sendOpinionsRequest(api.getWhatPeopleSayAboutBusinesses(businessIds))
      .then((res: { _id: string; whatPeopleSay: string[][] }[] | undefined) => {
        if (!Array.isArray(res)) return;

        const normalizedOpinions: { [businessId: string]: Array<string[]> } = {};
        for (const item of res) normalizedOpinions[item._id] = item.whatPeopleSay;
        setPeoplesOpinionsAboutBusinesses(normalizedOpinions);
      })
      .catch(console.log);
  }, [props.data?.businesses]);

  const error = useMemo(() => props.data?.status !== 'SUCCESS', [props.data?.status]);

  if (!props.data)
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

  if (!props.data?.businesses.length)
    return (
      <div className={cls(styles.businesses, styles.noResults)}>
        No results. Try searching for something else
      </div>
    );

  return (
    <ul className={cls(styles.businesses, 'no-bullets')} id="all-businesses">
      <small className={styles.totalResults}>{allResults} results</small>

      {(props.data.businesses as BusinessProps[])?.map((b, i) => {
        const reviewedByUser = b._id in userReviewLookup;
        return (
          <Business
            key={b._id}
            {...b}
            featured={false}
            serialNo={(page - 1) * 20 + i + 1}
            reviewedByCurrentUser={reviewedByUser}
            photoUrl={reviewedByUser ? userReviewLookup[b._id].images[0].photoUrl : undefined}
            userRating={reviewedByUser ? userReviewLookup[b._id].businessRating : undefined}
            whatPeopleSay={peoplesOpinionsAboutBusinesses[b._id]}
          />
        );
      })}
    </ul>
  );
}

export default AllBusinesses;
