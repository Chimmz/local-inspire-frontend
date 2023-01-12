import React from 'react';
import Image from 'next/image';

import { Icon } from '@iconify/react';
import TextInput from '../shared/text-input/TextInput';

import cls from 'classnames';
import { Form } from 'react-bootstrap';
import StarRating from '../shared/star-rating/StarRating';
import styles from './Header.module.scss';

interface Props {
  businessName: string;
  reviewsCount: number | undefined;
  linkToReviewPage: string;
}

function Header(props: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1>{props.businessName}</h1>
        <StarRating
          readonly
          ratingValue={3}
          initialValue={3}
          showRatingCaption
          starSize="lg"
          renderReviewsCount={n => `${n} reviews`}
          className="mb-4"
        />
        <span>341 Tanger Dr, Terrell, TX 75160</span>
        <ul className="d-flex align-items-center gap-2 no-bullets">
          <li>Vacation Rentals</li>
          <li>• Cabin</li>
        </ul>
        <div className="d-flex gap-3">
          <button
            className="btn btn--lg"
            style={{ backgroundColor: '#e20e0e', color: '#fff' }}
          >
            <Icon icon="ic:round-star-outline" width={22} />
            Write a review
          </button>
          <button className="btn btn-outline btn--lg">Ask a question</button>
          <button className="btn btn-outline btn--lg">Message owner</button>
        </div>
      </div>

      <div className={cls(styles.headerRight, 'd-flex', 'flex-column')}>
        <div className="d-flex justify-content-between mb-4">
          <button className="btn btn-bg-none">
            <Icon icon="ic:outline-save" width={22} />
            Save
          </button>
          <button className="btn btn-bg-none">
            <Icon icon="material-symbols:forward" width={22} />
            Share
          </button>
          <button className="btn btn-bg-none">
            <Icon icon="material-symbols:add-photo-alternate-outline" width={23} />
            Add photo
          </button>
        </div>
        <div className={cls(styles.headerImages, 'flex-grow-1')}>
          <figure className="position-relative d-block m-0">
            <Image
              src={'/img/pexels-abdullah-ghatasheh-3069345.jpg'}
              layout="fill"
              objectFit="cover"
              style={{ borderRadius: '3px' }}
            />
          </figure>
          <figure className="position-relative d-block">
            <Image
              src={'/img/los-angeles-photo.jpg'}
              layout="fill"
              objectFit="cover"
              style={{ borderRadius: '3px' }}
            />
          </figure>
          <figure className="position-relative d-block">
            <Image
              src={'/img/newyork-photo.jpg'}
              layout="fill"
              objectFit="cover"
              style={{ borderRadius: '3px' }}
            />
          </figure>
        </div>
      </div>
    </header>
  );
}

export default Header;
