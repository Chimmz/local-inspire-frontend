import cls from 'classnames';
import Image from 'next/image';
import React from 'react';
import useDate from '../../hooks/useDate';
import { UserPublicProfile } from '../../types';
import * as userUtils from '../../utils/user-utils';
import { BusinessProps } from '../business-results/Business';
import StarRating from '../shared/star-rating/StarRating';
import styles from './Review.module.scss';
import ReadmoreText from 'read-more-react';

export interface ReviewProps {
  _id: string;
  visitedWhen: { month: string; year: 2022 };
  business: string;
  reviewedBy: UserPublicProfile;
  recommends: boolean;
  businessRating: number;
  reviewTitle: string;
  review: string[];
  visitType: string;
  featureRatings: { feature: string; rating: number; _id: string }[];
  adviceToFutureVisitors: string;
  images: Array<{ photoUrl: string; description: string; _id: string }>;
  likes: Array<{ user: UserPublicProfile }>;
  createdAt: string;
  totalLikes: number;
  updatedAt: string;
}

const UserReview: React.FC<ReviewProps> = function (props) {
  const { date: reviewDate } = useDate(props.createdAt, { month: 'short', year: 'numeric' });
  if (!props?._id) return null;
  console.log({ props: userUtils.getFullName(props?.reviewedBy) });

  return (
    <article className={styles.review}>
      <figure>
        <Image
          src={props.reviewedBy?.imgUrl || '/img/default-profile-pic.jpeg'}
          width={40}
          height={40}
          alt={`Avatar of ${userUtils.getFullName(props?.reviewedBy)}`}
          objectFit="cover"
          style={{ borderRadius: '50%' }}
          onError={err => console.log('Image error: ', err)}
        />
      </figure>
      <strong className={styles.reviewedBy}>
        {userUtils.getFullName(props?.reviewedBy, { lastNameInitial: true })}
      </strong>
      <StarRating
        initialValue={props.businessRating}
        ratingValue={props.businessRating}
        starSize="md"
        readonly
        showRatingCaption={false}
      />
      <small className={styles.reviewDate}>{reviewDate}</small>

      <ReadmoreText
        text={props.review.join(' ')}
        readMoreText={<small className="cursor-pointer text-light">Read more...</small>}
        min={50}
        ideal={200}
        max={200}
      />
    </article>
  );
};

export default UserReview;
