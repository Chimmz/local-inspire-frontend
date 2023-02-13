import React, { useCallback, useMemo, useRef, useState } from 'react';

import cls from 'classnames';
import styles from './RatingStats.module.scss';
import FeatureRating from '../../shared/feature-rating/FeatureRating';
import { featuresToRate } from '../../page-reviews/config';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { BusinessProps } from '../../business-results/Business';
import { Overlay, Popover } from 'react-bootstrap';
import MapView from '../../business-results/MapView';
import { getPeopleQuantity, quantitize } from '../../../utils/quantity-utils';

interface Props {
  business: BusinessProps | undefined;
  overallFeatureRatings: Array<{ _id: string; avgRating: number }> | undefined;
  recommendationStats: { recommends: number; doesNotRecommend: number } | undefined;
  reviewsCount: number;
}

const RatingStats = function (props: Props) {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const ref = useRef(null);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    setShow(!show);
    setTarget(event.target as HTMLElement);
  };

  const normalizedFeatureRatings = useMemo(() => {
    if (!props.overallFeatureRatings?.length) return null;
    const result: { [key: string]: number } = {};

    props.overallFeatureRatings?.forEach(({ _id: feat, avgRating }) => {
      result[feat] = avgRating;
    });
    return result;
  }, [props.overallFeatureRatings]);

  const getOverallRatingFor = useCallback(
    (feat: string) => Math.floor(normalizedFeatureRatings![feat]),
    [normalizedFeatureRatings],
  );

  console.log({ normalizedFeatureRatings });

  return (
    <section className={styles.ratingStats}>
      <section className={styles.overallRatings}>
        <h3 className="mb-4">Overall Ratings</h3>
        <div className="d-flex align-items-center gap-3 mb-4">
          <Icon icon="octicon:feed-star-16" color="#024180" inline width={50} />
          <div className="">
            <h6 className="fs-2">{Math.round(props.business?.avgRating!)} out of 5</h6>
            <span className="fs-5">
              Based off the recommendation of {getPeopleQuantity(props.reviewsCount)}
            </span>
          </div>
        </div>
        <strong className="fs-4">What goes into this rating?</strong>
        <p className="parag">
          This rating is based on how many people recommend or don&apos;t recommend the page.
        </p>
      </section>

      <section className={styles.location}>
        <h3 className="mb-3">Location & Contact</h3>
        <div className={styles.mapbox}>
          <MapView
            shown
            coords={props.business?.coordinates}
            closeMap={null}
            withModal={false}
          />
        </div>
        <ul className={'no-bullets d-flex flex-column gap-3 mb-5 mt-5 fs-5'}>
          <li className="d-flex align-items-start gap-3">
            <Icon icon="ic:outline-location-on" width={21} />
            {props.business?.address.concat(', ')} {props.business?.city.concat(', ')}{' '}
            {props.business?.stateCode}
          </li>
          <li className="d-flex align-items-center gap-3">
            <Icon icon="ri:direction-line" width={19} />
            <Link href={'/'}>Get Directions</Link>
          </li>
          <li className="d-flex align-items-center gap-3">
            <Icon icon="fluent-mdl2:website" width={18} />
            <Link href={'https://'.concat(props.business?.web || '')} passHref>
              <a target="_blank">Website</a>
            </Link>
          </li>
          {props.business?.email ? (
            <li className="d-flex align-items-center gap-3">
              <Icon icon="ic:outline-email" width={18} />
              <Link href={'mailto:'.concat(props.business?.email || '')} passHref>
                <a target="_blank">Website</a>
              </Link>
              Email
            </li>
          ) : null}
          <li className="d-flex align-items-center gap-3">
            <Icon icon="ic:baseline-access-time" width={19} />
            <button className="btn btn-bg-none no-bg-hover">View hours</button>
          </li>
        </ul>
      </section>

      <section className={styles.featureRatings}>
        {normalizedFeatureRatings ? (
          <FeatureRating
            features={featuresToRate}
            ratings={[
              getOverallRatingFor('Food'),
              getOverallRatingFor('Value'),
              getOverallRatingFor('Location'),
              getOverallRatingFor('Service'),
              getOverallRatingFor('Atmosphere'),
            ]}
            starSize="md"
            readonly
          />
        ) : null}

        <div ref={ref} className="mt-5">
          <button
            className="btn btn-bg-none no-bg-hover btn--lg text-pry"
            onClick={handleClick}
          >
            <strong>Overall rating stats</strong>
          </button>

          <Overlay
            show={show}
            target={target}
            placement="right"
            container={ref}
            containerPadding={20}
          >
            <Popover id="popover-contained" className="w-max-content  p-3">
              <Popover.Body className="fs-4 d-flex gap-5">
                <div className="">
                  <strong className="w-max-content d-block mb-3">Recommended</strong>
                  <div className="d-flex align-items-center gap-2">
                    <Icon icon="mdi:success-circle-outline" color="00cc00" width={24} />
                    <span className="fs-3">{props.recommendationStats?.recommends}</span>
                  </div>
                </div>

                <div className="">
                  <strong className="w-max-content d-block mb-3">
                    Didn&apos;t Recommend
                  </strong>
                  <div className="d-flex align-items-center gap-2">
                    <Icon icon="mi:circle-error" color="red" width={24} />
                    <span className="fs-3">
                      {props.recommendationStats?.doesNotRecommend}
                    </span>
                  </div>
                </div>
              </Popover.Body>
            </Popover>
          </Overlay>
        </div>
      </section>
    </section>
  );
};

export default RatingStats;
