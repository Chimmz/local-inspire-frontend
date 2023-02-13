import { FC, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import useSignedInUser from '../../hooks/useSignedInUser';
import { useRouter } from 'next/router';
import { NewRegistrationContextProvider } from '../../contexts/NewRegistrationContext';
import navigateTo, * as urlUtils from '../../utils/url-utils';

import dummyImgs from './dummy-imgs';

import StarRating from '../shared/star-rating/StarRating';
import { Icon } from '@iconify/react';
import Auth from '../auth/Auth';
import cls from 'classnames';
import styles from './Business.module.scss';
import { useAuthContext } from '../../contexts/AuthContext';
import Spinner from '../shared/spinner/Spinner';
import LoadingButton from '../shared/button/Button';

export interface BusinessProps {
  _id: string;
  businessName: string;
  SIC2: string;
  SIC4: string;
  SIC8: string;
  contactName: string;
  stateCode: string;
  city: string;
  zipCode: string;
  address: string;
  phone: string;
  email?: string;
  web: string;
  yearFounded: string;
  locationType: string;
  marketVariable: string;
  annualRevenue: string;
  coordinates: string;
  SIC: string;
  NAICS: string;
  industry: string;

  reviewers?: Array<string>;
  images: { _id: string; imgUrl: string; approvedByBusinessOwner: boolean }[];
  avgRating?: number;
  claimed: boolean;
}

interface RatedBusiness extends Partial<BusinessProps> {
  userRating?: number;
  photoUrl?: string;
  reviewText?: string[];
  reviewedByCurrentUser?: boolean;
}

const Business: FC<RatedBusiness & { featured?: boolean; index?: number }> = function (
  props,
) {
  const router = useRouter();
  const rand = Math.floor(Math.random() * 9);
  const { businessName, address, featured = false, index } = props;
  const businessCategs = Array.from(new Set([props.SIC8, props.SIC4, props.SIC2]));

  const [userRecommends, setUserRecommends] = useState<boolean | null>(null);
  const { isSignedIn, ...user } = useSignedInUser({});
  const { showAuthModal } = useAuthContext();

  const [businessId, city, stateCode] = [props._id!, props.city!, props.stateCode!];

  const handleClickYesOrNo = (val: 'yes' | 'no') => {
    if (!isSignedIn) return showAuthModal!('register');
    setUserRecommends(val === 'yes');
  };

  useEffect(() => {
    if (!isSignedIn || userRecommends === null) return;
    // Go to review page once user signs in
    const url = urlUtils.genRecommendBusinessPageUrl({
      businessId,
      businessName: businessName!,
      city,
      stateCode,
      recommends: !!userRecommends,
    });
    console.log({ url });
    navigateTo(url, router);
  }, [isSignedIn, userRecommends]); // Watch for anytime user signs in

  const renderReviewText = useCallback(() => {
    const words = props.reviewText!.join(' ').split(' ');
    const first20Words = words.slice(0, 20);
    if (words?.length > 20) return first20Words.join(' ').concat('...');
    return first20Words.join(' ');
  }, [props.reviewText]);

  return (
    <li className={cls(styles.business, featured && styles.featured)} key={rand}>
      <figure>
        <Image
          // src={dummyImgs[rand % 10] || dummyImgs[rand % 8]}
          // src={props.photoUrl || '/img/business-img-default.jpeg'}
          src={props.images?.[0]?.imgUrl || '/img/business-img-default.jpeg'}
          alt={`${props.SIC8 || ''} photo of ${businessName}`}
          layout="fill"
          objectFit="cover"
        />
      </figure>

      <div className={styles.details}>
        <div className={styles.info}>
          <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <h4 className={styles.businessName}>
              <Link
                href={urlUtils.genBusinessPageUrl({
                  businessId,
                  businessName: businessName!,
                  city,
                  stateCode,
                })}
              >
                {(index ? index + '.' : '').concat(' ').concat(businessName!)}
              </Link>
            </h4>

            {!featured ? (
              <address className="d-flex align-items-center gap-1">
                <Icon
                  icon="material-symbols:location-on"
                  width="17"
                  height="17"
                  color="#777"
                />
                <small>{address?.replace('<br/>', '\n') || 'No address available'}</small>
              </address>
            ) : null}
          </div>

          <StarRating
            starSize={featured ? 'sm' : 'md'}
            initialValue={
              props.userRating || typeof props.avgRating === 'number'
                ? Math.floor(props.avgRating!)
                : 0
            }
            readonly
          />

          {businessCategs.length ? (
            <span style={{ fontSize: '1.' }} className={styles.categories}>
              {businessCategs.join(', ')}
            </span>
          ) : null}
        </div>

        {!featured && props.reviewedByCurrentUser ? (
          <div className={styles.userComment}>{renderReviewText()}</div>
        ) : null}

        {!featured && !props.reviewedByCurrentUser ? (
          <div className={cls(styles.question, 'd-flex gap-2')}>
            <p className="me-3">Been here before? Would you recommend?</p>
            <LoadingButton
              isLoading={userRecommends! && isSignedIn}
              className="btn btn-gray btn--sm"
              onClick={handleClickYesOrNo.bind(null, 'yes')}
              withSpinner
            >
              Yes
            </LoadingButton>

            <LoadingButton
              isLoading={userRecommends === false && isSignedIn}
              className="btn btn-gray btn--sm"
              onClick={handleClickYesOrNo.bind(null, 'no')}
              withSpinner
            >
              No
            </LoadingButton>
          </div>
        ) : null}
      </div>
    </li>
  );
};

export default Business;
