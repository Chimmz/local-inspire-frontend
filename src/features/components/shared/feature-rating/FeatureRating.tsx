import React, { ReactNode, useState } from 'react';
import StarRating from '../star-rating/StarRating';
import styles from './FeatureRating.module.scss';
import { RateableFeature } from './types';

interface Props {
  features: RateableFeature[];
  ratings: number[];
  onRate(f: string, r: number): void;
  readonly: boolean;
}

const FeatureRating = function (props: Props) {
  const { features, ratings } = props;

  return (
    <div className={styles.featureRating}>
      {features.map((f, i) => (
        <React.Fragment key={f.label}>
          <span className="d-flex align-items-center gap-3">
            {f.icon}
            {f.label}
          </span>
          <StarRating
            ratingValue={ratings[i]}
            starSize="lg"
            onRate={rating => props.onRate(f.label, rating)}
            readonly={props.readonly}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default FeatureRating;
