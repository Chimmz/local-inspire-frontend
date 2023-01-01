import cls from 'classnames';
import Image from 'next/image';
import React from 'react';
import StarRating from '../shared/star-rating/StarRating';
import styles from './Review.module.scss';

export interface ReviewProps {
  _id: string;
  visitedWhen: { month: string; year: 2022 };
  business: string;
  reviewedBy: { _id: string; firstName: string; lastName: string; imgUrl: string };
  businessRating: number;
  reviewTitle: string;
  review: string;
  visitType: string;
  featuresRating: { feature: string; rating: number; _id: string }[];
  adviceToFutureVisitors: string;
  photosWithDescription: [{ photo: string; description: string; _id: string }];
}

const UserReview: React.FC<ReviewProps> = function (props) {
  const { firstName, lastName } = props.reviewedBy;

  return (
    <article className={styles.review}>
      <figure>
        <Image
          src={props.reviewedBy.imgUrl || '/img/default-profile-pic.jpeg'}
          width={50}
          height={50}
          alt={`Avatar of Dennis Cheesman`}
          objectFit="cover"
          style={{ borderRadius: '50%' }}
        />
      </figure>
      <strong className={styles.reviewedBy}>
        {firstName} {lastName[0]}.
      </strong>
      <StarRating
        initialValue={props.businessRating}
        ratingValue={props.businessRating}
        starSize="md"
        readonly
        showRatingCaption={false}
      />
      <small className={styles.reviewDate}>January, 2023</small>

      <p className={cls('parag')}>{props.review}.</p>
    </article>
  );
};

export default UserReview;
