import cls from 'classnames';
import React, { Fragment, useState } from 'react';
import { Changable, Readonly, Size } from '../../../types';
import StarRating from '../star-rating/StarRating';
import styles from './FeatureRating.module.scss';
import { RateableFeatures } from './types';

interface Props {
  features: RateableFeatures;
  ratings: number[];
  starSize?: Size;
  onRate?(feat: string, rating: number): void;
  readonly?: boolean;
  grid?: boolean;
  rowGap?: string;
}

const FeatureRating = function (props: Props) {
  const { features, ratings, starSize = 'md', rowGap = '1.5rem' } = props;

  return (
    <ul
      className={cls(styles.featureRating, props.grid && styles.grid, 'no-bullets')}
      style={{ rowGap }}
    >
      {features.map((f, i) => {
        const hasIcon = typeof f === 'object';

        const itemContent = (
          <Fragment key={hasIcon ? f.label : f}>
            <span className="d-flex align-items-center gap-3">
              {hasIcon ? (
                <>
                  {f.icon} {f.label}
                </>
              ) : (
                f
              )}
            </span>
            <StarRating
              initialValue={props.readonly ? ratings[i] : 0}
              ratingValue={ratings[i]}
              starSize={starSize}
              onRate={rating => props.onRate?.(hasIcon ? f.label : f, rating)}
              readonly={props.readonly}
            />
          </Fragment>
        );

        if (props.grid)
          return (
            <li className="d-flex align-items-center" key={hasIcon ? f.label : f}>
              {itemContent}
            </li>
          );
        else return itemContent;
      })}
    </ul>
  );
};

export default FeatureRating;
