import { FC } from 'react';
import Image from 'next/image';

import dummyImgs from './dummy-imgs';
import { v4 as uuid } from 'uuid';

import { Icon } from '@iconify/react';
import cls from 'classnames';
import styles from './Business.module.scss';
import StarRating from '../shared/star-rating/StarRating';

export interface BusinessProps {
  index?: number;
  businessName: string;
  address: string;
  rating: number;
  featured?: boolean;
  SIC8Category?: string;
  SIC4Category: string;
  SIC2Category: string;
  [key: string]: any;
}

const Business: FC<BusinessProps> = function (props) {
  const rand = Math.floor(Math.random() * 9);
  const { businessName, address, rating, featured = false, index } = props;
  const businessCategs = Array.from(
    new Set([props.SIC8Category, props.SIC4Category, props.SIC2Category]),
  );

  // console.log({ businessCategs });

  return (
    <li className={cls(styles.business, featured ? styles.featured : '')} key={rand}>
      <figure>
        <Image
          src={dummyImgs[rand % 10] || dummyImgs[rand % 8]}
          alt={`${props.SIC8Category || ''} photo of ${businessName}`}
          layout="fill"
          objectFit="cover"
        />
      </figure>
      <div className={styles.details}>
        <div className={styles.info}>
          <div className="d-flex justify-content-between">
            <h4 className={styles.businessName}>
              {(index && index + '.') || null} {businessName}
            </h4>
            {!featured ? (
              <address className="d-flex  gap-1">
                <Icon
                  icon="material-symbols:location-on"
                  width="17"
                  height="17"
                  color="#777"
                />
                {address?.replace('<br/>', '\n') || 'No address available'}
              </address>
            ) : null}
          </div>

          <StarRating
            starSize={featured ? 'sm' : 'md'}
            ratingOver5={4}
            reviewsCount={53}
            printReviews={!featured ? n => `${n} reviews` : undefined}
          />

          {businessCategs.length ? (
            <span style={{ fontSize: '1.' }} className={styles.categories}>
              {businessCategs.join(', ')}
            </span>
          ) : null}
        </div>

        {!featured ? (
          <div className={styles.userComment}>
            {`"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus beatae
            at architecto possimus quas ullam! Accusantium, facilis! Magni, vitae
            voluptatum."`}
          </div>
        ) : null}

        {!featured ? (
          <div className={styles.question}>
            <p className="me-3">Been here before? Would you recommend?</p>
            <button className="btn btn-gray btn--sm">Yes</button>
            <button className="btn btn-gray btn--sm">No</button>
          </div>
        ) : null}
      </div>
    </li>
  );
};

export default Business;
