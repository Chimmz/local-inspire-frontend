import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { BusinessProps } from '../business-results/Business';
import { UserCollection } from '../../types';
import { ReviewProps } from '../page-reviews/UserReview';

import useSignedInUser from '../../hooks/useSignedInUser';
import useRequest from '../../hooks/useRequest';
import useMiddleware from '../../hooks/useMiddleware';

import {
  genRecommendBusinessPageUrl,
  getBusinessQuestionsUrl,
  genAddPhotosPageUrl,
  genClaimBusinessPageUrl,
} from '../../utils/url-utils';
import api from '../../library/api';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import StarRating from '../shared/star-rating/StarRating';
import PhotoGallery from '../shared/img-gallery/PhotoGallery';
import UserCollectionsModal from './modals/UserCollectionsModal';
import SocialShareModal from '../shared/social-share/SocialShare';
import ImageList from '../shared/image-list/ImageList';
import styles from './Header.module.scss';
import AppTooltip from '../AppTooltip';
import { Overlay, Popover } from 'react-bootstrap';

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
  const [showGallery, setShowGallery] = useState(false);

  const [showPopover, setShowPopover] = useState(false);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  const [userReviewImages, setUserReviewImages] = useState<Array<{
    _id: string;
    photoUrl: string;
    description: string;
  }> | null>(null);

  const { send: sendCollectionsReq, loading: fetchingCollections } = useRequest();
  const { send: sendReviewReq, loading: loadingReviews } = useRequest();
  const { isSignedIn, accessToken: token } = useSignedInUser();
  const { withAuth } = useMiddleware();
  const router = useRouter();

  const loadUserCollections = useCallback(async () => {
    const res = await sendCollectionsReq(api.getUserCollections(token!));
    if (res?.status === 'SUCCESS') setUserCollections(res.collections);
  }, [token, sendCollectionsReq]);

  const loadUserReview = useCallback(async () => {
    const req = sendReviewReq(api.getUserReviewOnBusiness(props.business!._id!, token!));
    req.then(res => res?.status === 'SUCCESS' && setUserReviewImages(res.review?.images));
  }, [isSignedIn, token, props.business?._id]);

  useEffect(() => {
    if (isSignedIn) loadUserCollections();
  }, [isSignedIn, loadUserCollections]);

  useEffect(() => {
    if (!isSignedIn) return setUserReviewImages(null); // If user logs out
    if (props.business?._id) loadUserReview();
  }, [isSignedIn, props.business?._id]);

  const userPreviouslySavedBusiness = useMemo(() => {
    if (!isSignedIn) return false;
    return userCollections?.some(collec =>
      collec.items.some(i => i.item === props.business?._id),
    );
  }, [userCollections, isSignedIn]);

  const businessImages = useMemo(() => props.business?.images, [props.business?.images]);

  const [reviewPageUrl, questionsPageUrl] = useMemo(() => {
    return [
      genRecommendBusinessPageUrl<string>({ slug: props.slug, recommends: null }),
      getBusinessQuestionsUrl<string>({ slug: props.slug, promptNewQuestion: true }),
    ];
  }, []);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    setShowPopover(state => !state);
    setTarget(event.target as HTMLElement);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className="d-flex align-items-center gap-3">
            <h1 className="mb-3">{props.business?.businessName}</h1>
            <div className="">
              <button
                className="btn btn-bg-none no-bg-hover text-pry d-flex align-items-center gap-1"
                style={{ color: props.business?.claimedBy && '#0ab30a' }}
                onClick={handleClick}
              >
                <Icon
                  icon={props.business?.claimedBy ? 'mdi:success-circle-outline' : 'ph:question'}
                  width={20}
                />
                {props.business?.claimedBy ? 'Claimed' : 'Unclaimed'}
              </button>
              <Overlay
                show={showPopover && !props.business?.claimedBy}
                target={target}
                placement="bottom"
              >
                <Popover id="header-popover-trigger-hover-focus" className="w-max-content p-3">
                  <Popover.Body className="fs-4 d-flex gap-5">
                    <div style={{ maxWidth: '50ch' }}>
                      <h4>
                        This business has not yet been claimed by the owner or a representative.
                      </h4>
                      <small>
                        Is this your business?{' '}
                        <Link
                          href={genClaimBusinessPageUrl<string>({ slug: props.slug })}
                          passHref
                        >
                          <a className="font-bold text-pry">Claim it now</a>
                        </Link>{' '}
                        to make sure your information is up to date, add photos and more. Plus
                        use our free tools to find new customers.
                      </small>
                    </div>
                  </Popover.Body>
                </Popover>
              </Overlay>
            </div>
          </div>

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

            {props.business?.claimedBy ? (
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

      <PhotoGallery
        show={!!businessImages?.length && showGallery}
        imgUrls={businessImages?.map(img => img.imgUrl)}
      />
    </>
  );
}

export default Header;
