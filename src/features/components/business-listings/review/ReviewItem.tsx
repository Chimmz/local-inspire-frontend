import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Icon } from '@iconify/react';
import { Form, Spinner } from 'react-bootstrap';
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
import FeatureRating from '../../shared/feature-rating/FeatureRating';
import * as dateUtils from '../../../utils/date-utils';
import useDate from '../../../hooks/useDate';

type Props = ReviewProps & { show: boolean; businessName: string };

const ReviewItem = function (props: Props) {
  console.log('BusinessReview is evaluated');
  const [likes, setLikes] = useState(props.likedBy);
  const { date: reviewDate } = useDate(props.createdAt, {
    month: 'short',
    year: 'numeric',
  });
  const currentUser = useSignedInUser();
  const { send: sendLikeReq, loading: isLiking } = useRequest({
    autoStopLoading: true,
  });

  const handleLikeReview: React.MouseEventHandler<HTMLButtonElement> =
    useCallback(async () => {
      const data = await sendLikeReq(
        api.toggleBusinessReviewHelpful(props._id, currentUser.accessToken!),
      );
      console.log({ data });
      if (data.status === 'SUCCESS') setLikes(data?.likes?.users as string[]);
    }, [
      sendLikeReq,
      api.toggleBusinessReviewHelpful,
      props._id,
      currentUser.accessToken,
    ]);

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
        This was helpful{' '}
        {/* {isLiking ? (
        <Spinner animation="border" size="sm" style={{ borderWidth: '1px' }} />
      ) : null} */}
        {likes.length ? `(${likes.length})` : ''}
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
          src={props.reviewedBy.imgUrl || '/img/los-angeles-photo.jpg'}
          width={50}
          height={50}
          objectFit="cover"
          style={{ borderRadius: '50%' }}
          onError={ev => {
            (ev.target as HTMLImageElement).src = '/img/los-angeles-photo.jpg';
          }}
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

      <ul className={cls(styles.featureRatings, 'my-5', 'no-bullets')}>
        <FeatureRating
          features={props.featuresRating.map(f => f.feature)}
          ratings={props.featuresRating.map(f => f.rating)}
          readonly
        />
      </ul>
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
