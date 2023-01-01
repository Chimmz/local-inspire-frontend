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
  index?: number;
  businessName: string;
  address: string;
  rating: number;
  featured?: boolean;
  SIC8?: string;
  SIC4: string;
  SIC2: string;
  [key: string]: any;
}

const Business: FC<BusinessProps> = function (props) {
  const router = useRouter();
  const rand = Math.floor(Math.random() * 9);
  const { businessName, address, rating, featured = false, index } = props;
  const businessCategs = Array.from(new Set([props.SIC8, props.SIC4, props.SIC2]));

  const [userRecommends, setUserRecommends] = useState<boolean | null>(null);
  const { isSignedIn, ...user } = useSignedInUser({});
  const { showAuthModal } = useAuthContext();

  useEffect(() => {
    if (userRecommends === null) return;
    if (!isSignedIn) return showAuthModal!('register');

    // Go to review page once user signs in
    const url = urlUtils.genRecommendBusinessPageUrl(
      props._id,
      businessName.toLowerCase(),
      props.city.toLowerCase(),
      props.stateCode.toUpperCase(),
      !!userRecommends,
    );
    console.log({ url });
    navigateTo(url, router);
  }, [userRecommends, isSignedIn]); // When user clicks either the Yes or No button

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
              {(index && index + '.') || null} {businessName}
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
              isLoading={userRecommends!}
              className="btn btn-gray btn--sm"
              onClick={setUserRecommends.bind(null, true)}
              // disabled={userRecommends !== null}
            >
              Yes
            </LoadingButton>

            <LoadingButton
              isLoading={userRecommends! === false}
              className="btn btn-gray btn--sm"
              onClick={setUserRecommends.bind(null, false)}
              // disabled={userRecommends !== null}
            >
              No
            </LoadingButton>
            {/* <button
              className="btn btn-gray btn--sm"
              onClick={setUserRecommends.bind(null, true)}
              data-choice="yes"
            >
              Yes
            </button> */}
            {/* <button
              className="btn btn-gray btn--sm"
              onClick={setUserRecommends.bind(null, false)}
              data-choice="no"
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
