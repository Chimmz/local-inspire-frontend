import { FC, useEffect, useState } from 'react';
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
  yearFounded: string;
  locationType: string;
  marketVariable: string;
  annualRevenue: string;
  coordinates: string;
  SIC: string;
  NAICS: string;
  industry: string;
  rating?: number;
  claimed: boolean;
}

type Props = Partial<BusinessProps> & { featured?: boolean; index?: number };

const Business: FC<Props> = function (props) {
  const router = useRouter();
  const rand = Math.floor(Math.random() * 9);
  const { businessName, address, rating, featured = false, index } = props;
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

  return (
    <li className={cls(styles.business, featured && styles.featured)} key={rand}>
      <figure>
        <Image
          src={dummyImgs[rand % 10] || dummyImgs[rand % 8]}
          alt={`${props.SIC8 || ''} photo of ${businessName}`}
          layout="fill"
          objectFit="cover"
        />
      </figure>

      <div className={styles.details}>
        <div className={styles.info}>
          <div className="d-flex justify-content-between">
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
                {address?.replace('<br/>', '\n') || 'No address available'}
              </address>
            ) : null}
          </div>

          <StarRating
            starSize={featured ? 'sm' : 'md'}
            initialValue={4}
            ratingValue={4}
            renderReviewsCount={!featured ? n => `${n} reviews` : undefined}
            showRatingCaption
            readonly
          />

          {businessCategs.length ? (
            <span style={{ fontSize: '1.' }} className={styles.categories}>
              {businessCategs.join(', ')}
            </span>
          ) : null}
        </div>

        {!featured ? (
          <div className={styles.userComment}>
            {`Lorem, ipsum dolor sit amet consectetur adipisici elit. Voluptatibus beatae
      at architecto possimus quas ullam! Accusantium, facilis! Magni, vitae
      voluptatum...`}
          </div>
        ) : null}

        {!featured ? (
          <div className={styles.question}>
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
            {/* <button
              className="btn btn-gray btn--sm"
              onClick={setUserRecommends.bind(null, true)}
              data-choice="yes"
              disabled={userRecommends!}
            >
              Yes
              <Spinner />
            </button>
            <button
              className="btn btn-gray btn--sm"
              onClick={setUserRecommends.bind(null, false)}
              data-choice="no"
              disabled={userRecommends === false}
            >
              No
            </button> */}
          </div>
        ) : null}
      </div>
    </li>
  );
};

export default Business;
