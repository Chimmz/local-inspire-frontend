import { Icon } from '@iconify/react';
import css from './StarRating.module.scss';
import { v4 as uuid } from 'uuid';
import cls from 'classnames';
import { Rating } from 'react-simple-star-rating';
import React from 'react';

interface StarRatingProps {
  initialValue?: number;
  ratingValue?: number;
  onRate?(r: number): void;

  starSize: 'sm' | 'md' | 'lg' | 'xlg';
  tooltip?: boolean;
  renderReviewsCount?: (count: number) => string;

  style?: { [style: string]: string };
  className?: string;
  readonly?: boolean;
  showRatingCaption?: boolean;
}

const StarRating = (props: StarRatingProps) => {
  const { ratingValue, renderReviewsCount, starSize, className } = props;
  const sizeMap = { sm: 17, md: 20, lg: 30, xlg: 45 };

  return (
    <div
      className={cls(css.rating, className, 'd-flex', 'align-items-center')}
      // title={`${ratingValue}/5 rating`}
    >
      <Rating
        onClick={rating => props.onRate?.(rating)}
        initialValue={props.initialValue || 0}
        readonly={props.readonly}
        // onPointerEnter={console.log}
        // onPointerLeave={console.log}
        // onPointerMove={console.log}
        // allowHover={true}
        disableFillHover={true}
        showTooltip={props.tooltip}
        iconsCount={5}
        // transition
        tooltipArray={['Terrible', 'Poor', 'Average', 'Good', 'Excellent']}
        tooltipClassName="position-absolute "
        tooltipStyle={{ backgroundColor: 'transparent', color: '#000' }}
        emptyIcon={
          <Icon
            icon="mdi:star-circle"
            color="#ccc"
            inline
            width={sizeMap[starSize]}
            key={uuid()}
          />
        }
        fillIcon={
          <Icon
            icon="mdi:star-circle"
            color="#0955a1"
            inline
            width={sizeMap[starSize]}
            key={uuid()}
          />
        }
      />
      {props.showRatingCaption && ratingValue ? (
        <small style={{ marginLeft: '5px' }}>
          {renderReviewsCount?.(ratingValue) || `${ratingValue}`}
        </small>
      ) : null}
    </div>
  );
};

export default StarRating;
