import React, { useMemo, useState } from 'react';
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

interface Props {
  businessName: string;
  reviewsCount: number | undefined;
  business: Partial<BusinessProps> | undefined;
  reviewImages: Array<{ photoUrl: string; description: string; _id: string }> | undefined;
  slug: string;
  pageDescription: string;
}

function Header(props: Props) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCollectionsModal, setShowCollectionsModal] = useState(false);
  const router = useRouter();

  const undisplayedPhotos = useMemo(() => props.reviewImages?.slice(3), [props.reviewImages]);
  const reviewPageUrl = useMemo(
    () => genRecommendBusinessPageUrl<string>({ slug: props.slug, recommends: null }),
    [],
  );
  const questionsPageUrl = useMemo(
    () =>
      getBusinessQuestionsUrl<string>({
        slug: props.slug,
        promptNewQuestion: true,
      }),
    [],
  );

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
            {props.business?.address?.concat(', ')} {props.business?.city}{' '}
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
              style={{ color: '#6a6a6a' }}
              onClick={setShowCollectionsModal.bind(null, true)}
            >
              <Icon icon="material-symbols:bookmark" width={18} />
              Save
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

          {!props.reviewImages?.length ? (
            <div className={cls(styles.headerImages, styles.noImages, 'flex-grow-1')}>
              <Icon icon="ic:outline-camera-alt" width={35} />
              <h4 className="text-center">Enhance this page - Upload photos</h4>
              {/* <button className="btn btn-pry">Add photos</button> */}

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
              {props.reviewImages?.[0] ? (
                <figure className="position-relative d-block m-0">
                  <Image
                    src={props.reviewImages[0].photoUrl}
                    layout="fill"
                    objectFit="cover"
                    style={{ borderRadius: '3px' }}
                  />
                </figure>
              ) : null}

              {props.reviewImages?.[1] ? (
                <figure className="position-relative d-block">
                  <Image
                    src={props.reviewImages?.[1].photoUrl}
                    layout="fill"
                    objectFit="cover"
                    style={{ borderRadius: '3px' }}
                  />
                </figure>
              ) : null}

              {props.reviewImages?.[2] ? (
                <figure
                  className="position-relative d-block"
                  data-remaining-count={'+' + (undisplayedPhotos?.length || 0)}
                >
                  <Image
                    src={props.reviewImages?.[2].photoUrl}
                    layout="fill"
                    objectFit="cover"
                    style={{ borderRadius: '3px' }}
                  />
                </figure>
              ) : null}
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
      {/* <PhotoGallery /> */}
    </>
  );
}

export default Header;
