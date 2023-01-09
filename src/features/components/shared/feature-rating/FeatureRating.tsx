import React, { ReactNode, useState } from 'react';
import { Changable, Readonly, Size } from '../../../types';
import StarRating from '../star-rating/StarRating';
import styles from './FeatureRating.module.scss';
import { RateableFeatures } from './types';

interface Props {
  features: RateableFeatures;
  ratings: number[];
  starSize?: Size;
  onRate?(feat: string, rat: number): void;
  readonly?: boolean;
}

const FeatureRating = function (props: Props) {
  const { features, ratings, starSize = 'md' } = props;

  return (
    <div className={styles.featureRating}>
      {features.map((f, i) => {
        const isWithIcon = typeof f === 'object';

        return (
          <React.Fragment key={isWithIcon ? f.label : f}>
            <span className="d-flex align-items-center gap-3">
              {isWithIcon ? (
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
              onRate={rating => props.onRate?.(isWithIcon ? f.label : f, rating)}
              readonly={props.readonly}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default FeatureRating;
