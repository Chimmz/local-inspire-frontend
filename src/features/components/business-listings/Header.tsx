import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { BusinessProps } from '../business-results/Business';

import {
  genRecommendBusinessPageUrl,
  getBusinessQuestionsUrl,
  genAddPhotosPageUrl,
} from '../../utils/url-utils';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import StarRating from '../shared/star-rating/StarRating';
import styles from './Header.module.scss';
import PhotoGallery from '../shared/img-gallery/PhotoGallery';
import SocialShareModal from '../shared/social-share/SocialShare';
import UserCollectionsModal from './modals/UserCollectionsModal';
import { UserCollection } from '../../types';
import useSignedInUser from '../../hooks/useSignedInUser';
import useRequest from '../../hooks/useRequest';
import api from '../../library/api';
import { ReviewProps } from '../page-reviews/UserReview';

interface Props {
  businessName: string;
  reviewsCount: number | undefined;
  business: Partial<BusinessProps> | undefined;
  userReview?: ReviewProps;
  userCollections?: UserCollection[];
  slug: string;
  pageDescription: string;
}

function Header(props: Props) {
  const [userCollections, setUserCollections] = useState<UserCollection[] | undefined>(
    props.userCollections,
  );
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCollectionsModal, setShowCollectionsModal] = useState(false);

  const router = useRouter();
  const { isSignedIn, accessToken } = useSignedInUser();
  const { send: sendCollectionsReq, loading: fetchingCollections } = useRequest({
    autoStopLoading: true,
  });

  const loadUserCollections = useCallback(async () => {
    const res = await sendCollectionsReq(api.getUserCollections(accessToken!));
    if (res?.status === 'SUCCESS') setUserCollections(res.collections);
  }, [accessToken, sendCollectionsReq, api.getUserCollections]);

  useEffect(() => {
    if ('userCollections' in props) return;
    if (isSignedIn) loadUserCollections();
  }, [loadUserCollections, isSignedIn]);

  const userPreviouslySavedBusiness = useMemo(() => {
    return userCollections?.some(collec =>
      collec.items.some(i => i.item === props.business?._id),
    );
  }, [userCollections]);

  const userReviewImages = useMemo(
    () => props.userReview?.images,
    [props.userReview?.images],
  );

  const [businessImages, morePhotosCount] = useMemo(() => {
    return [
      props.business?.images,
      userReviewImages ? props.business?.images?.slice(userReviewImages.length).length : [],
    ];
  }, [props.business?.images]);

  const reviewPageUrl = useMemo(() => {
    return genRecommendBusinessPageUrl<string>({ slug: props.slug, recommends: null });
  }, []);
  const questionsPageUrl = useMemo(() => {
    return getBusinessQuestionsUrl<string>({ slug: props.slug, promptNewQuestion: true });
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className="mb-3">{props.business?.businessName}</h1>
          <StarRating
            readonly
            initialValue={Math.floor(props.business?.avgRating!)}
            ratingValue={props.reviewsCount}
            showRatingCaption
            starSize="xlg"
            renderReviewsCount={n => `${n} reviews`}
            className="mb-4"
          />
          <span>
            {props.business?.address?.concat(', ')} {props.business?.city?.concat(', ')}
            {props.business?.stateCode}
          </span>

          <ul className="d-flex align-items-center gap-2 no-bullets">
            <li>{props.business?.SIC4}</li>
            <li>• {props.business?.SIC8}</li>
          </ul>

          <div className="d-flex gap-3 mt-5">
            <button className="btn btn-pry btn--lg">
              <Icon icon="ic:round-star-outline" width={22} />
              <Link href={reviewPageUrl} legacyBehavior>
                Write a review
              </Link>
            </button>

            <Link href={questionsPageUrl} passHref>
              <a className="btn btn-outline btn--lg">Ask a question</a>
            </Link>

            {props.business?.claimed ? (
              <button className="btn btn-outline btn--lg">Message owner</button>
            ) : null}
          </div>
        </div>

        <div className={cls(styles.headerRight, 'd-flex', 'flex-column')}>
          <div className="d-flex justify-content-between mb-4">
            <button
              className="btn btn-bg-none"
              onClick={setShowCollectionsModal.bind(null, true)}
            >
              <Icon
                icon="material-symbols:bookmark"
                color={userPreviouslySavedBusiness ? '#0955a1' : 'gray'}
                width={18}
              />
              <span style={{ color: userPreviouslySavedBusiness ? '#0955a1' : 'inherit' }}>
                {userPreviouslySavedBusiness ? 'Saved' : 'Save'}
              </span>
            </button>
            <button
              className="btn btn-bg-none"
              style={{ color: '#6a6a6a' }}
              onClick={setShowShareModal.bind(null, true)}
            >
              <Icon icon="mdi:share" width={21} />
              Share
            </button>
            <Link
              href={genAddPhotosPageUrl(props.business?._id!, props.business?.businessName!)}
              passHref
            >
              <a href="" className="btn btn-bg-none" style={{ color: '#6a6a6a' }}>
                <Icon icon="material-symbols:photo-camera" width={19} />
                Add photo
              </a>
            </Link>
          </div>

          {!userReviewImages?.length ? (
            <div className={cls(styles.headerImages, styles.noImages, 'flex-grow-1')}>
              <Icon icon="ic:outline-camera-alt" width={35} />
              <h4 className="text-center">Enhance this page - Upload photos</h4>
              <Link
                href={genAddPhotosPageUrl(
                  props.business?._id!,
                  props.business?.businessName!,
                )}
                passHref
              >
                <a href="" className="btn btn-pry" style={{ color: '#6a6a6a' }}>
                  <Icon icon="material-symbols:photo-camera" width={19} />
                  Add photo
                </a>
              </Link>
            </div>
          ) : (
            <div className={cls(styles.headerImages, 'flex-grow-1')}>
              {userReviewImages.map((img, i) => {
                let className = 'position-relative d-block';
                const isFirstImage = i === 0;
                const isLastImage = i === userReviewImages.length - 1;

                if (isFirstImage) className = className.concat(' m-0');

                const imgUI = (
                  <Image
                    src={img.photoUrl}
                    layout="fill"
                    objectFit="cover"
                    style={{ borderRadius: '3px' }}
                  />
                );

                if (!isLastImage) return <figure className={className}>{imgUI}</figure>;

                return (
                  <figure
                    className={className}
                    data-remaining-count={'+' + (morePhotosCount || 0)}
                  >
                    {imgUI}
                  </figure>
                );
              })}
              {/* {userReviewImages?.[0] ? (
                <figure className="position-relative d-block m-0">
                  <Image
                    src={userReviewImages?.[0].photoUrl}
                    layout="fill"
                    objectFit="cover"
                    style={{ borderRadius: '3px' }}
                  />
                </figure>
              ) : null}

              {userReviewImages?.[1] ? (
                <figure className="position-relative d-block">
                  <Image
                    src={userReviewImages?.[1]?.photoUrl}
                    layout="fill"
                    objectFit="cover"
                    style={{ borderRadius: '3px' }}
                  />
                </figure>
              ) : null}

              {userReviewImages?.[2] ? (
                <figure
                  className="position-relative d-block"
                  data-remaining-count={'+' + (morePhotosCount || 0)}
                >
                  <Image
                    src={userReviewImages?.[2].photoUrl}
                    layout="fill"
                    objectFit="cover"
                    style={{ borderRadius: '3px' }}
                  />
                </figure>
              ) : null} */}
            </div>
          )}
        </div>
      </header>

      <UserCollectionsModal
        show={showCollectionsModal}
        close={setShowCollectionsModal.bind(null, false)}
        initMode="add-to-collection"
        itemToSave={{ model: 'Business', item: props.business?._id! }}
      />

      <SocialShareModal
        show={showShareModal}
        pageUrl={router.asPath}
        title={props.pageDescription}
        close={setShowShareModal.bind(null, false)}
      />

      {/* <PhotoGallery images={businessImages}/> */}
    </>
  );
}

export default Header;
