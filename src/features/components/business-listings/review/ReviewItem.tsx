import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ReviewProps } from '../../recommend-business/UserReview';

import useDate from '../../../hooks/useDate';
import useSignedInUser from '../../../hooks/useSignedInUser';
import useRequest from '../../../hooks/useRequest';

import * as dateUtils from '../../../utils/date-utils';
import api from '../../../library/api';

import cls from 'classnames';
import { Icon } from '@iconify/react';
import { Form, Spinner } from 'react-bootstrap';
import FeatureRating from '../../shared/feature-rating/FeatureRating';
import styles from './Reviews.module.scss';
import StarRating from '../../shared/star-rating/StarRating';

type Props = ReviewProps & { show: boolean; businessName: string };

const ReviewItem = function (props: Props) {
  // console.log('BusinessReview is evaluated');
  const [likes, setLikes] = useState(props.likedBy);
  const [src, setSrc] = useState(props.reviewedBy.imgUrl || '/img/default-profile-pic.jpeg');

  const [likeBtnText, setLikeBtnText] = useState('This was helpful');
  const { date: reviewDate } = useDate(props.createdAt, { month: 'short', year: 'numeric' });

  const { send: sendLikeReq, loading: isLiking } = useRequest({
    autoStopLoading: true,
  });
  const currentUser = useSignedInUser();

  const handleLikeReview = useCallback(async () => {
    const data = await sendLikeReq(
      api.toggleBusinessReviewHelpful(props._id, currentUser.accessToken!),
    );
    console.log({ data });

    if (data.status !== 'SUCCESS') return;

    console.log({ isLikedByCurrentUser });

    if (data?.likes?.users?.includes(currentUser._id))
      setLikeBtnText('Thank you for your vote');
    else setLikeBtnText('This was helpful');

    setLikes(data?.likes?.users as string[]);
  }, [sendLikeReq, api.toggleBusinessReviewHelpful, props._id, currentUser.accessToken]);

  const isLikedByCurrentUser = useMemo(
    () => likes.includes(currentUser?._id!),
    [likes, currentUser?._id],
  );

  const recommendStatusText: React.ReactNode = useMemo(
    () =>
      props.recommends ? (
        <>
          <Icon icon="mdi:cards-heart" color="red" /> recommends
        </>
      ) : (
        ' ' + 'does not recommend'
      ),
    [props.recommends],
  );

  const btnLike = useMemo(
    () => (
      <button
        className="btn btn-transp d-flex align-items-center gap-2"
        onClick={handleLikeReview}
        disabled={isLiking}
      >
        <Icon icon={`mdi:like${!isLikedByCurrentUser ? '-outline' : ''}`} width={20} />
        {likeBtnText} {likes.length ? `(${likes.length})` : ''}
      </button>
    ),
    [handleLikeReview, isLiking, isLikedByCurrentUser, likes, likes.length],
  );

  return (
    <section
      className={cls(styles.review, props.show ? 'd-block' : 'd-none')}
      key={props._id}
    >
      <div className={styles.reviewHeader}>
        <Image
          src={src}
          width={50}
          height={50}
          objectFit="cover"
          style={{ borderRadius: '50%' }}
          onError={setSrc.bind(null, '/img/default-profile-pic.jpeg')}
        />
        <small className="fs-4">
          <span className="text-black">
            {props.reviewedBy.firstName + ' ' + props.reviewedBy.lastName[0] + '.'}
          </span>{' '}
          wrote a review on {reviewDate}
        </small>

        <small className={styles.location}>
          <Icon icon="material-symbols:location-on" width={15} color="#2c2c2c" />
          Terrell, TX • 5 contributions
        </small>

        <button className={styles.flag}>
          <Icon icon="ic:round-flag" width={25} />
        </button>
      </div>

      <div className={styles.reviewText}>
        <Link href={'/'} className="link">
          {props.review}
        </Link>
      </div>
      <StarRating
        initialValue={props.businessRating}
        starSize="lg"
        readonly
        className="mt-2"
      />

      <div className="d-flex align-items-start flex-wrap  mt-4 fs-4 gap-2">
        <small className="w-max-content text-black">Tips for visitors: </small>
        <small className="parag mb-2 d-block">{props.adviceToFutureVisitors}</small>
      </div>

      <div className="d-flex align-items-center fs-4 gap-2">
        <small className="w-max-content text-black">Date of visit: </small>
        <small className="parag">
          {props.visitedWhen.month + ' ' + props.visitedWhen.year}
        </small>
      </div>

      <div className="d-flex align-items-center fs-4 gap-2">
        <small className="w-max-content text-black">Visit type: </small>
        <small className="parag">{props.visitType}</small>
      </div>
      <span>
        <small className="text-black">{props.reviewedBy.firstName} </small>
        {recommendStatusText}
        <small className="text-black"> {props.businessName}</small>
      </span>

      <div className={cls(styles.featureRatings, 'my-5', 'no-bullets')}>
        <FeatureRating
          features={props.featuresRating.map(f => f.feature)}
          ratings={props.featuresRating.map(f => f.rating)}
          readonly
          grid
        />
      </div>

      <hr />

      <div className={styles.reviewFooter}>
        {btnLike}
        <button className="btn btn-transp d-flex align-items-center gap-2">
          <Icon icon="material-symbols:forward-rounded" width={20} />
          Share
        </button>
      </div>
    </section>
  );
};

export default ReviewItem;
