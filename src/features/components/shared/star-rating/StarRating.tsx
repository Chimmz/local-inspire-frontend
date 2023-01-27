import { Icon } from '@iconify/react';
import css from './StarRating.module.scss';
import { v4 as uuid } from 'uuid';
import cls from 'classnames';
import { Rating } from 'react-simple-star-rating';
import React from 'react';
import { Size } from '../../../types';

interface StarRatingProps {
  initialValue?: number;
  ratingValue?: number;
  onRate?(r: number): void;

  starSize: Size;
  tooltip?: boolean;
  renderReviewsCount?: (count: number) => string;

  style?: React.CSSProperties;
  className?: string;
  readonly?: boolean;
  showRatingCaption?: boolean;
}

const StarRating = (props: StarRatingProps) => {
  const { ratingValue, renderReviewsCount, starSize, className } = props;
  // const sizeMap = { sm: 17, md: 20, lg: 30, xlg: 45 };
  const sizeMap = { sm: 14, md: 17, lg: 24, xlg: 39 };

  return (
    <div
      className={cls(css.rating, className, 'd-flex', 'align-items-center')}
      style={props.style}
      // title={`${ratingValue}/5 rating`}
    >
      <Rating
        onClick={rating => props.onRate?.(rating)}
        initialValue={props.initialValue || 0}
        readonly={props.readonly}
        allowFraction
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
            // icon="mdi:star-circle"
            icon="octicon:feed-star-16"
            color="#ccc"
            inline
            width={sizeMap[starSize]}
            key={uuid()}
            style={{ marginRight: '3px' }}
          />
        }
        fillIcon={
          <Icon
            // icon="mdi:star-circle"
            icon="octicon:feed-star-16"
            color="#024180"
            inline
            width={sizeMap[starSize]}
            key={uuid()}
            style={{ marginRight: '3px' }}
          />
        }
      />
      {props.renderReviewsCount && ratingValue ? (
        <small className="ms-2 fs-5">
          {renderReviewsCount?.(ratingValue) || `${ratingValue}`}
        </small>
      ) : null}
    </div>
  );
};

export default StarRating;
