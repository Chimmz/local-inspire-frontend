import { Icon } from '@iconify/react';
import styles from './StarRating.module.scss';

interface StarRatingProps {
  ratingOver5: number;
  reviewsCount?: number;
  starSize: 'sm' | 'md' | 'lg';
  printReviews?: (n: number) => string;
}

const StarRating = (props: StarRatingProps) => {
  const { ratingOver5, reviewsCount, printReviews, starSize } = props;

  const size = starSize === 'sm' ? 17 : starSize === 'md' ? 20 : 23;
  const nonColoredStarsCount = 5 - ratingOver5;

  return (
    <div className={styles.rating}>
      {Array.from({ length: ratingOver5 }).map(_ => (
        <Icon icon="mdi:star-circle" color="#0955a1" inline width={size} />
      ))}
      {Array.from({ length: nonColoredStarsCount }).map(_ => (
        <Icon icon="mdi:star-circle" color="#9e9e9e" inline width={size} />
      ))}
      {reviewsCount ? (
        <small style={{ marginLeft: '5px' }}>
          {printReviews?.(reviewsCount) || `${reviewsCount}`}
        </small>
      ) : null}
    </div>
  );
};

export default StarRating;
