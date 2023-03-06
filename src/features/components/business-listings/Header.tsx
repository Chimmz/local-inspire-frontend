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
import useMiddleware from '../../hooks/useMiddleware';
import ImageList from '../shared/image-list/ImageList';

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
  const [userReviewImages, setUserReviewImages] =
    useState<Array<{ photoUrl: string; description: string; _id: string }>>();

  const [showShareModal, setShowShareModal] = useState(false);
  const [showCollectionsModal, setShowCollectionsModal] = useState(false);

  const router = useRouter();
  const { isSignedIn, accessToken: token } = useSignedInUser();
  const { withAuth } = useMiddleware();
  const { send: sendCollectionsReq, loading: fetchingCollections } = useRequest({
    autoStopLoading: true,
  });
  const {
    send: sendReviewReq,
    loading: fetchingReviews,
    loaded: userReviewRequested,
  } = useRequest({
    autoStopLoading: true,
  });

  const loadUserCollections = useCallback(async () => {
    const res = await sendCollectionsReq(api.getUserCollections(token!));
    if (res?.status === 'SUCCESS') setUserCollections(res.collections);
  }, [token, sendCollectionsReq]);

  const loadUserReview = useCallback(async () => {
    const req = sendReviewReq(api.getUserReviewOnBusiness(props.business!._id!, token!));
    req.then(res => res?.status === 'SUCCESS' && setUserReviewImages(res.review.images));
  }, [isSignedIn, token, props.business?._id]);

  useEffect(() => {
    if (isSignedIn) loadUserCollections();
  }, [isSignedIn, loadUserCollections]);

  useEffect(() => {
    if (!isSignedIn) return setUserReviewImages(undefined); // If user logs out
    if (props.business?._id) loadUserReview();
  }, [isSignedIn, props.business?._id]);

  const userPreviouslySavedBusiness = useMemo(() => {
    if (!isSignedIn) return false;
    return userCollections?.some(collec =>
      collec.items.some(i => i.item === props.business?._id),
    );
  }, [userCollections, isSignedIn]);

  const [businessImages, morePhotosCount] = useMemo(() => {
    return [
      props.business?.images,
      userReviewImages ? props.business?.images?.length! - userReviewImages?.length : 0,
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
              onClick={withAuth.bind(null, setShowCollectionsModal.bind(null, true))}
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

          {businessImages?.length ? (
            <div className={cls(styles.headerImages, 'flex-grow-1')}>
              <ImageList
                images={businessImages?.map(img => ({ ...img, src: img.imgUrl })) || []}
                limit={4}
                imageProps={{ layout: 'fill', objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div className={cls(styles.headerImages, styles.noImages, 'flex-grow-1')}>
              <Icon icon="ic:outline-camera-alt" width={35} />
              <h4 className="text-center">Enhance this page - Upload photos</h4>
              <Link
                href={genAddPhotosPageUrl(props.business?._id!, props.business?.businessName!)}
                passHref
              >
                <a href="" className="btn btn-pry mt-3" style={{ color: '#6a6a6a' }}>
                  <Icon icon="material-symbols:photo-camera" width={19} />
                  Add photo
                </a>
              </Link>
            </div>
          )}

          {/* {!businessImages?.length && !userReviewImages?.length ? (
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
              {userReviewImages ? (
                <ImageList
                  images={userReviewImages?.map(img => ({ ...img, src: img.photoUrl })) || []}
                  limit={4}
                  imageProps={{ layout: 'fill', objectFit: 'cover' }}
                />
              ) : (
                <ImageList
                  images={businessImages?.map(img => ({ ...img, src: img.imgUrl })) || []}
                  limit={4}
                  imageProps={{ layout: 'fill', objectFit: 'cover' }}
                />
              )}
            </div> 
          )}*/}
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
