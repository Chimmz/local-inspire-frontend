import { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
import { useAuthModalContext } from '../../contexts/AuthContext';
import Spinner from '../shared/spinner/Spinner';
import LoadingButton from '../shared/button/Button';
import { renderMultiLineText } from '../../utils/dom-utils';

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
  whatPeopleSay?: string[][] | undefined;
  reviewedByCurrentUser?: boolean;
}

const Business: FC<RatedBusiness & { featured?: boolean; serialNo?: number }> = function (
  props,
) {
  const { businessName, address, featured = false, serialNo } = props;
  const businessCategs = Array.from(new Set([props.SIC8, props.SIC4, props.SIC2]));

  const { isSignedIn, ...user } = useSignedInUser({});

  const [businessId, city, stateCode] = [props._id!, props.city!, props.stateCode!];

  const genRecommendUrl = useCallback(
    (recommends: boolean) => {
      return urlUtils.genRecommendBusinessPageUrl({
        businessId,
        businessName,
        city,
        stateCode,
        recommends,
      });
    },
    [businessId, businessName, city, stateCode],
  );

  const peoplesOpinions = useMemo(() => {
    if (!props.whatPeopleSay) return null;

    return props.whatPeopleSay.slice(0, 2).map(reviewText => {
      const reviewStr = reviewText.join(' ');
      const first7Words = reviewStr.split(' ').slice(0, 7).join(' ');

      return first7Words.length < reviewStr.length ? first7Words.concat('...') : first7Words;
    });
  }, [props.whatPeopleSay]);

  return (
    <li className={cls(styles.business, featured && styles.featured)} key={props._id}>
      <figure>
        <Image
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
                {(serialNo ? serialNo + '.' : '').concat(' ').concat(businessName!)}
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

        {/* {!featured && props.reviewedByCurrentUser ? (
          <div className={styles.userComment}>{renderWhatPeopleSay()}</div>
        ) : null} */}

        {!featured && peoplesOpinions ? (
          <div className={styles.userOpinions}>{renderMultiLineText(peoplesOpinions)}</div>
        ) : null}

        {!featured && !props.reviewedByCurrentUser ? (
          <div className={cls(styles.question, 'd-flex gap-2')}>
            <p className="me-3">Been here before? Would you recommend?</p>

            <Link href={genRecommendUrl(true)} passHref>
              <a className="btn btn-gray btn--sm" style={{ minWidth: '100px' }}>
                Yes
              </a>
            </Link>
            <Link href={genRecommendUrl(false)} passHref>
              <a className="btn btn-gray btn--sm" style={{ minWidth: '100px' }}>
                No
              </a>
            </Link>
          </div>
        ) : null}
      </div>
    </li>
  );
};
export default Business;
