import cls from 'classnames';
import Image from 'next/image';
import React from 'react';
import { UserPublicProfile } from '../../types';
import * as userUtils from '../../utils/user-utils';
import StarRating from '../shared/star-rating/StarRating';
import styles from './Review.module.scss';

export interface ReviewProps {
  _id: string;
  visitedWhen: { month: string; year: 2022 };
  business: string;
  reviewedBy: UserPublicProfile;
  recommends: boolean;
  businessRating: number;
  reviewTitle: string;
  review: string;
  visitType: string;
  featuresRating: { feature: string; rating: number; _id: string }[];
  adviceToFutureVisitors: string;
  photosWithDescription: [{ photo: string; description: string; _id: string }];
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
}

const UserReview: React.FC<ReviewProps> = function (props) {
  if (!props?._id) return null;

  const reviewDate = [props.visitedWhen.month, '' + props.visitedWhen.year].join(' ');

  return (
    <article className={styles.review}>
      <figure>
        <Image
          src={props.reviewedBy?.imgUrl || '/img/default-profile-pic.jpeg'}
          width={50}
          height={50}
          alt={`Avatar of ${userUtils.getFullName({
            firstName: props?.reviewedBy?.firstName,
            lastName: props?.reviewedBy?.lastName,
          })}`}
          objectFit="cover"
          style={{ borderRadius: '50%' }}
          onError={err => console.log('Image error: ', err)}
        />
      </figure>
      <strong className={styles.reviewedBy}>
        {props?.reviewedBy?.firstName} {props?.reviewedBy?.lastName?.[0]}.
      </strong>
      <StarRating
        initialValue={props.businessRating}
        ratingValue={props.businessRating}
        starSize="md"
        readonly
        showRatingCaption={false}
      />
      <small className={styles.reviewDate}>{reviewDate}</small>

      <p className={cls('parag')}>{props.review}.</p>
    </article>
  );
};

export default UserReview;
