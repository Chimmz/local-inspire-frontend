import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { BusinessProps } from '../business-results/Business';

import { genRecommendBusinessPageUrl, getBusinessQuestionsUrl } from '../../utils/url-utils';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import StarRating from '../shared/star-rating/StarRating';
import styles from './Header.module.scss';

interface Props {
  businessName: string;
  reviewsCount: number | undefined;
  business: Partial<BusinessProps> | undefined;
  reviewImages: Array<{ photoUrl: string; description: string; _id: string }> | undefined;
  slug: string;
}

function Header(props: Props) {
  const undisplayedPhotos = useMemo(() => props.reviewImages?.slice(3), [props.reviewImages]);

  const reviewPageUrl = useMemo(
    () => genRecommendBusinessPageUrl<string>({ slug: props.slug, recommends: null }),
    [],
  );
  const questionsPageUrl = useMemo(
    () =>
      getBusinessQuestionsUrl<string>({
        slug: props.slug,
        promptNewQuestion: true,
      }),
    [],
  );

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className="mb-3">{props.business?.businessName}</h1>
        <StarRating
          readonly
          initialValue={props.business?.avgRating}
          ratingValue={props.reviewsCount}
          showRatingCaption
          starSize="xlg"
          renderReviewsCount={n => `${n} reviews`}
          className="mb-4"
        />
        <span>{props.business?.address}</span>

        <ul className="d-flex align-items-center gap-2 no-bullets">
          <li>{props.business?.SIC4}</li>
          <li>• {props.business?.SIC8}</li>
        </ul>

        <div className="d-flex gap-3 mt-5">
          <button className="btn btn-pry btn--lg">
            <Icon icon="ic:round-star-outline" width={22} />
            <Link href={reviewPageUrl} legacyBehavior>
              Write a review
            </Link>
          </button>

          <Link href={questionsPageUrl} passHref>
            <a className="btn btn-outline btn--lg">Ask a question</a>
          </Link>

          {props.business?.claimed ? (
            <button className="btn btn-outline btn--lg">Message owner</button>
          ) : null}
        </div>
      </div>

      <div className={cls(styles.headerRight, 'd-flex', 'flex-column')}>
        <div className="d-flex justify-content-between mb-4">
          <button className="btn btn-bg-none" style={{ color: '#6a6a6a' }}>
            <Icon icon="material-symbols:bookmark" width={18} />
            Save
          </button>
          <button className="btn btn-bg-none" style={{ color: '#6a6a6a' }}>
            <Icon icon="mdi:share" width={21} />
            Share
          </button>
          <button className="btn btn-bg-none" style={{ color: '#6a6a6a' }}>
            <Icon icon="material-symbols:photo-camera" width={19} />
            Add photo
          </button>
        </div>

        {!props.reviewImages?.length ? (
          <div className={cls(styles.headerImages, styles.noImages, 'flex-grow-1')}>
            <Icon icon="ic:outline-camera-alt" width={35} />
            <h4 className="text-center">Enhance this page - Upload photos</h4>
            <button className="btn btn-pry">Add photos</button>
          </div>
        ) : (
          <div className={cls(styles.headerImages, 'flex-grow-1')}>
            {props.reviewImages?.[0] ? (
              <figure className="position-relative d-block m-0">
                <Image
                  src={props.reviewImages[0].photoUrl}
                  layout="fill"
                  objectFit="cover"
                  style={{ borderRadius: '3px' }}
                />
              </figure>
            ) : null}

            {props.reviewImages?.[1] ? (
              <figure className="position-relative d-block">
                <Image
                  src={props.reviewImages?.[1].photoUrl}
                  layout="fill"
                  objectFit="cover"
                  style={{ borderRadius: '3px' }}
                />
              </figure>
            ) : null}

            {props.reviewImages?.[2] ? (
              <figure
                className="position-relative d-block"
                data-remaining-count={'+' + (undisplayedPhotos?.length || 0)}
              >
                <Image
                  src={props.reviewImages?.[2].photoUrl}
                  layout="fill"
                  objectFit="cover"
                  style={{ borderRadius: '3px' }}
                />
              </figure>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
