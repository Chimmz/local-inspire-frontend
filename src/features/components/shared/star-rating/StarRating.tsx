import { Icon } from '@iconify/react';
import styles from './StarRating.module.scss';
import { v4 as uuid } from 'uuid';

interface StarRatingProps {
  ratingOver5: number;
  reviewsCount?: number;
  starSize: 'sm' | 'md' | 'lg';
  renderReviewsCount?: (count: number) => string;
}

const StarRating = (props: StarRatingProps) => {
  const { ratingOver5, reviewsCount, renderReviewsCount, starSize } = props;

  const sizeMap = { sm: 17, md: 20, lg: 23 };
  const nonColoredStarsCount = 5 - ratingOver5;

  return (
    <div className={styles.rating}>
      {Array.from({ length: ratingOver5 }).map(_ => (
        <Icon
          icon="mdi:star-circle"
          color="#0955a1"
          inline
          width={sizeMap[starSize]}
          key={uuid()}
        />
      ))}

      {Array.from({ length: nonColoredStarsCount }).map(_ => (
        <Icon
          icon="mdi:star-circle"
          color="#9e9e9e"
          inline
          width={sizeMap[starSize]}
          key={uuid()}
        />
      ))}

      {reviewsCount ? (
        <small style={{ marginLeft: '5px' }}>
          {renderReviewsCount?.(reviewsCount) || `${reviewsCount}`}
        </small>
      ) : null}
    </div>
  );
};

export default StarRating;
