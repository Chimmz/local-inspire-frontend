import React, { useMemo } from 'react';
import Image from 'next/image';

import { Icon } from '@iconify/react';
import TextInput from '../shared/text-input/TextInput';

import cls from 'classnames';
import { Form } from 'react-bootstrap';
import StarRating from '../shared/star-rating/StarRating';
import styles from './Header.module.scss';
import { BusinessProps } from '../business-results/Business';
import Link from 'next/link';
import { genRecommendBusinessPageUrl, getBusinessQuestionsUrl } from '../../utils/url-utils';
import { useRouter } from 'next/router';
import { ReviewProps } from '../recommend-business/UserReview';

interface Props {
  businessName: string;
  reviewsCount: number | undefined;
  business: Partial<BusinessProps> | undefined;
  reviewImages: Array<{ photoUrl: string; description: string; _id: string }> | undefined;
  slug: string;
}

function Header(props: Props) {
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

  const undisplayedPhotos = props.reviewImages?.slice(3);

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className="mb-3">{props.business?.businessName}</h1>
        <StarRating
          readonly
          ratingValue={props.reviewsCount}
          initialValue={3}
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
              {/* undisplayedPhotos?.length */}
              {/* {true ? (
                <span className={cls(styles.remainingPhotosCount, 'd-flex xy-center fs-2')}>
                  +22
                  +{undisplayedPhotos?.length}
                </span>
              ) : null} */}
            </figure>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;
