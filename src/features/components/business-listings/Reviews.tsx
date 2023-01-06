import React, { ChangeEventHandler, useEffect, useMemo, useRef, useState } from 'react';

import { Icon } from '@iconify/react';
import { Form } from 'react-bootstrap';
import LabelledCheckbox from '../shared/LabelledCheckbox';
import styles from './Reviews.module.scss';
import Image from 'next/image';
import cls from 'classnames';
import Link from 'next/link';
import StarRating from '../shared/star-rating/StarRating';

const reviewFilters = [
  'Excellent',
  'Very Good',
  'Average',
  'Poor',
  'Terrible',
  'Recommends',
  'Helpful',
];

interface Props {
  show: boolean;
}

function BusinessReviews(props: Props) {
  const [addedFilters, setAddedFilters] = useState<typeof reviewFilters>([]);

  const addFilter = (label: string) => setAddedFilters(filters => [label, ...filters]);

  const removeFilter = (label: string) => {
    setAddedFilters(filters => filters.filter(f => f !== label));
  };

  const filters = useMemo(() => {
    return (
      <section className={styles.filters}>
        {reviewFilters.map(label => (
          <LabelledCheckbox
            key={label}
            label={<small>{label}</small>}
            onChange={ev =>
              (ev.target.checked ? addFilter : removeFilter)(ev.target.value)
            }
            value={label}
          />
        ))}
      </section>
    );
  }, []);

  return (
    <>
      <section className={cls(props.show ? 'd-block' : 'd-none')}>
        <h2>Reviews</h2>
        <hr />
        <small className="d-block my-4">Filter for better results</small>
        {filters}
      </section>

      <ul
        className={cls(styles.reviews, 'no-bullets', props.show ? 'd-block' : 'd-none')}
      >
        <li className={styles.review}>
          <div className={styles.reviewHeader}>
            <Image
              src={'/img/los-angeles-photo.jpg'}
              width={50}
              height={50}
              objectFit="cover"
              style={{ borderRadius: '50%' }}
            />
            <small className="fs-4">
              <span className="text-black"> Don W.</span> wrote a review on Dec 31, 2022
            </small>

            <small className={styles.location}>
              <Icon icon="material-symbols:location-on" width={15} color="#2c2c2c" />
              Terrell, TX • 5 contributions
            </small>

            <button className={styles.flag}>
              <Icon icon="ic:round-flag" width={25} />
            </button>
          </div>

          <div className={styles.reviewText}>
            <Link href={'/'} className="link">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, nulla?
            </Link>
          </div>
          <StarRating initialValue={3} starSize="md" readonly className="mt-2" />

          <div className="d-flex align-items-start flex-wrap  mt-4 fs-4 gap-2">
            <small className="w-max-content text-black">Tips for visitors: </small>
            <small className="parag mb-2 d-block">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur,
              exercitationem odit a excepturi molestias quas!
            </small>
          </div>

          <div className="d-flex align-items-center fs-4 gap-2">
            <small className="w-max-content text-black">Date of visit: </small>
            <small className="parag">December 2022</small>
          </div>

          <div className="d-flex align-items-center fs-4 gap-2">
            <small className="w-max-content text-black">Visit type: </small>
            <small className="parag">Visited as Business</small>
          </div>
          <span>
            <small className="text-black">Don</small>{' '}
            <Icon icon="mdi:cards-heart" color="red" /> recommends
            <small className="text-black"> Fannies BBQ</small>
          </span>

          <ul className={cls(styles.featureRatings, 'my-5', 'no-bullets')}>
            <li className="text-cente">
              <div className="text-black">Food</div> <small>3 stars</small>
            </li>
            <li className="text-cente">
              <div className="text-black">Value</div> <small>3 stars</small>
            </li>
            <li className="text-cente">
              <div className="text-black">Location</div> <small>3 stars</small>
            </li>
            <li className="text-cente">
              <div className="text-black">Service</div> <small>3 stars</small>
            </li>
            <li className="text-cente">
              <div className="text-black">Atmosphere</div> <small>4 stars</small>
            </li>
          </ul>
          <hr />
          <div className={styles.reviewFooter}>
            <button className="btn btn-transp d-flex align-items-center gap-2">
              <Icon icon="mdi:like-outline" width={20} />
              Helpful
            </button>
            <button className="btn btn-transp d-flex align-items-center gap-2">
              <Icon icon="material-symbols:forward-rounded" width={20} />
              Share
            </button>
          </div>
        </li>
      </ul>
    </>
  );
}

export default BusinessReviews;
