import Image from 'next/image';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import styles from './AdvicesSection.module.scss';
import Link from 'next/link';
import cls from 'classnames';
import { UserPublicProfile } from '../../../types';
import { getFullName } from '../../../utils/user-utils';
import useDate from '../../../hooks/useDate';
import navigateTo, { genRecommendBusinessPageUrl } from '../../../utils/url-utils';
import { useRouter } from 'next/router';
import AppDropdown from '../../shared/dropdown/AppDropdown';

export interface TipProps {
  _id: string;
  reviewedBy: UserPublicProfile;
  adviceToFutureVisitors: string;
  createdAt: string;
}
type Props = TipProps & {
  show: boolean;
  slug: string;
};

const Tip = function (props: Props) {
  const router = useRouter();

  const [src, setSrc] = useState(props.reviewedBy.imgUrl);
  const { date: reviewDate } = useDate(props.createdAt, {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  });

  const handleSelectDropdownItem = (evKey: string) => {
    switch (evKey as 'report') {
      case 'report':
        console.log('Reporting...');
        break;
    }
  };

  const userName = getFullName(props.reviewedBy, { lastNameInitial: true });
  return (
    <section className={cls(styles.advice, props.show ? 'd-block' : 'd-none')}>
      <div className={styles.adviceHeader}>
        <figure>
          <Image
            src={src}
            layout="fill"
            objectFit="cover"
            onError={setSrc.bind(null, '/img/default-profile-pic.jpeg')}
            style={{ borderRadius: '50%' }}
          />
        </figure>
        <small className={cls(styles.reviwer, 'fs-4')}>
          <span className="text-black"> {userName}</span> wrote a review on {reviewDate}
        </small>

        <small className={styles.location}>
          <Icon icon="material-symbols:location-on" width={15} color="#2c2c2c" />
          Terrell, TX • 5 contributions
        </small>

        {/* <button className={styles.flag}>
          <Icon icon="ic:round-flag" width={25} />
        </button> */}
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
          <Link href={'/'} className="btn">
            Read full review...
          </Link>
        </small>
      </div>
    </section>
  );
};
export default Tip;
