import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import styles from './AdvicesSection.module.scss';
import Link from 'next/link';
import cls from 'classnames';
import { UserPublicProfile } from '../../../types';
import { getFullName } from '../../../utils/user-utils';
import useDate from '../../../hooks/useDate';
import navigateTo, {
  genRecommendBusinessPageUrl,
  genUserProfileUrl,
  genUserReviewPageUrl,
} from '../../../utils/url-utils';
import { useRouter } from 'next/router';
import AppDropdown from '../../shared/dropdown/AppDropdown';
import { BusinessProps } from '../../business-results/Business';
import { quantitize } from '../../../utils/quantity-utils';

export interface TipProps {
  _id: string;
  reviewedBy: UserPublicProfile;
  reviewTitle: string;
  adviceToFutureVisitors: string;
  createdAt: string;
}
interface Props extends TipProps {
  show: boolean;
  slug: string;
  business: BusinessProps;
  openAdviceReportModal: (id: string) => void;
}

const Tip = function (props: Props) {
  const router = useRouter();

  const [src, setSrc] = useState();
  const { date: reviewDate } = useDate(props.createdAt, {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  });

  const handleSelectDropdownItem = (evKey: string) => {
    switch (evKey as 'report') {
      case 'report':
        props.openAdviceReportModal(props._id);
        break;
    }
  };

  const userName = getFullName(props.reviewedBy, { lastNameInitial: true });
  return (
    <section className={cls(styles.advice, props.show ? 'd-block' : 'd-none')}>
      <div className={styles.adviceHeader}>
        <figure>
          <Image
            src={props.reviewedBy.imgUrl}
            layout="fill"
            objectFit="cover"
            style={{ borderRadius: '50%' }}
          />
        </figure>
        <span className={cls(styles.reviewer)}>
          <Link href={genUserProfileUrl(props.reviewedBy)} passHref>
            <a className="text-black link">
              {getFullName(props.reviewedBy, { lastNameInitial: true })}
            </a>
          </Link>{' '}
          wrote a review on {reviewDate}
        </span>

        <small className={styles.location}>
          <Icon icon="material-symbols:location-on" width={15} color="#2c2c2c" />
          {props.reviewedBy.city} •{' '}
          {quantitize(props.reviewedBy.contributions.length, [
            'contribution',
            'contributions',
          ])}
        </small>

        <AppDropdown
          items={['Report']}
          onSelect={handleSelectDropdownItem}
          toggler={<Icon icon="material-symbols:more-vert" width={20} />}
          className={styles.options}
        />
      </div>

      <div className={styles.questionText}>
        <p>{props.adviceToFutureVisitors}</p>

        <small className="link text-pry">
          <Link
            href={genUserReviewPageUrl({
              ...props.business!,
              reviewId: props._id,
              reviewTitle: props.reviewTitle,
            })}
            // href={useMemo(() => {
            //   if (!props.business || !props._id || !props.reviewTitle) return '';
            //   return genUserReviewPageUrl({
            //     ...props.business!,
            //     reviewId: props._id,
            //     reviewTitle: props.reviewTitle,
            //   });
            // }, [props.business, props._id, props.reviewTitle])}
            className="btn"
          >
            Read full review...
          </Link>
        </small>
      </div>
    </section>
  );
};
export default Tip;
