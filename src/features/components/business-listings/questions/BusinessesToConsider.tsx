import React from 'react';
import styles from './QuestionsSection.module.scss';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import cls from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { genBusinessPageUrl, genRecommendBusinessPageUrl } from '../../../utils/url-utils';
import StarRating from '../../shared/star-rating/StarRating';

interface Props {
  show: boolean;
}

////////////// This component is not currently in use ///////////////////
const BusinessesToConsider = function (props: Props) {
  const router = useRouter();
  const slug = router.query.businessDetails as string;
  const showStyle = props.show ? 'd-block' : 'd-none';

  return (
    <div className={cls(showStyle, styles.businessesToConsider)}>
      <header className="d-flex justify-content-between gap-4 mb-5">
        <h3 className="text-dark fs-3">Other Businesses to Consider</h3>
        <span className="d-flex align-items-center gap-2">
          Sponsored links
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            // trigger="click"
            overlay={
              <Tooltip id="tooltip-sponsored-info" className="tooltip-light-border">
                Business owners paid for these ads. For more information visit our business
                center.
              </Tooltip>
            }
          >
            <Icon icon="material-symbols:info" width={20} color="gray" />
          </OverlayTrigger>
        </span>
      </header>

      <ul className={cls(styles.businesses, 'no-bullets')}>
        <li className={styles.business}>
          <figure>
            <Image
              src="/img/pexels-suzukii-xingfu-872831.jpg"
              layout="fill"
              objectFit="cover"
              style={{ borderRadius: '4px' }}
            />
          </figure>

          <Link href={genBusinessPageUrl<string>({ slug })} passHref>
            <a
              href=""
              className="link text-pry fs-4"
              style={{ gridColumn: '2 / 3', gridRow: '1', lineHeight: '1' }}
            >
              Fannies BBQ
            </a>
          </Link>

          <StarRating
            starSize="md"
            initialValue={4}
            ratingValue={4}
            renderReviewsCount={n => `${n} reviews`}
            readonly
            style={{ gridColumn: '2 / 3', gridRow: '2' }}
          />

          <p style={{ gridColumn: '2 / 3', gridRow: '3' }}>
            <strong>
              <Link href={'/'}>Kris K.</Link>
            </strong>{' '}
            said &ldquo;It is ok all the time&rdquo;
          </p>
        </li>

        <li className={styles.business}>
          <figure>
            <Image
              src="/img/pexels-suzukii-xingfu-872831.jpg"
              layout="fill"
              objectFit="cover"
              style={{ borderRadius: '4px' }}
            />
          </figure>

          <Link href={genBusinessPageUrl<string>({ slug })} passHref>
            <a
              href=""
              className="link text-pry fs-4"
              style={{ gridColumn: '2 / 3', gridRow: '1', lineHeight: '1' }}
            >
              Fannies BBQ
            </a>
          </Link>

          <StarRating
            starSize="md"
            initialValue={4}
            ratingValue={4}
            renderReviewsCount={n => `${n} reviews`}
            readonly
            style={{ gridColumn: '2 / 3', gridRow: '2' }}
          />

          <p style={{ gridColumn: '2 / 3', gridRow: '3' }}>
            <strong>
              <Link href={'/'}>Kris K.</Link>
            </strong>{' '}
            said &ldquo;It is ok all the time&rdquo;
          </p>
        </li>
      </ul>
    </div>
  );
};

export default BusinessesToConsider;
