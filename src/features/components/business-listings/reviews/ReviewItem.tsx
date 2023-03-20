import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { UserPublicProfile } from '../../../types';
import { ReviewProps } from '../../page-reviews/UserReview';

import useDate from '../../../hooks/useDate';
import useSignedInUser from '../../../hooks/useSignedInUser';
import useRequest from '../../../hooks/useRequest';
import useMiddleware, { AuthMiddlewareNext } from '../../../hooks/useMiddleware';

import api from '../../../library/api';
import { getFullName } from '../../../utils/user-utils';
import * as qtyUtils from '../../../utils/quantity-utils';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import { Accordion, Dropdown } from 'react-bootstrap';
import ReadmoreText from 'read-more-react';
import FeatureRating from '../../shared/feature-rating/FeatureRating';
import StarRating from '../../shared/star-rating/StarRating';
import CustomAccordionToggle from '../../shared/accordion/CustomAccordionToggle';
import { BusinessProps } from '../../business-results/Business';
import {
  genBusinessPageUrl,
  genUserProfileUrl,
  genUserReviewPageUrl,
  UserReviewPageUrlParams,
} from '../../../utils/url-utils';
import * as domUtils from '../../../utils/dom-utils';
import styles from './ReviewsSection.module.scss';
import useToggle from '../../../hooks/useToggle';
import ImageList from '../../shared/image-list/ImageList';

type Props = ReviewProps & {
  show: boolean;
  hideLocation?: boolean;
  businessName: string;
  businessData: Partial<BusinessProps>;
  openReportModal: (reviewId: string) => void;
  openShareModal?: (...args: [string, string]) => void;
  openReviewLikers(reviewId: string): void;
  useNativeLinkToProfile?: boolean;
};

const REVIEW_IMG_WIDTH = 120;

const ReviewItem = function (props: Props) {
  const [likes, setLikes] = useState(props.likes);
  const { state: isShowingFullReviewText, toggle: toggleShowFullReviewText } = useToggle(false);
  const imgsContianerRef = useRef<HTMLDivElement | null>(null);

  const { withAuth } = useMiddleware();
  const currentUser = useSignedInUser();
  const { date: reviewDate } = useDate(props.createdAt, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const { send: sendLikeReq, loading: isLiking } = useRequest();

  const getPartialReviewText = useCallback(() => {
    if (props.review.length > 1) return props.review.slice(0, props.review.length / 2 + 1); // Show half array
    const strlen = props.review.join('').length;
    const lengthOfPortionToShow = Math.round(0.75 * strlen); // 75% of the string length
    return [
      props.review
        .join('')
        .slice(0, lengthOfPortionToShow)
        .concat(strlen > lengthOfPortionToShow ? '...' : ''),
    ];
  }, [props.review]);

  const handleToggleLikeReview: AuthMiddlewareNext = async (token?: string) => {
    const res = await sendLikeReq(api.toggleBusinessReviewHelpful(props._id, token!));
    if (res.status !== 'SUCCESS') return;
    setLikes(res?.likes as { user: UserPublicProfile }[]);
  };

  const isLikedByCurrentUser = useMemo(
    () => likes.some(({ user }) => user._id === currentUser?._id!),
    [likes, currentUser?._id],
  );

  const recommendStatusText: React.ReactNode = useMemo(() => {
    return props.recommends ? (
      <>
        <Icon icon="mdi:cards-heart" color="red" /> recommends
      </>
    ) : (
      ' '.concat('does not recommend')
    );
  }, [props.recommends]);

  const btnLike = useMemo(
    () => (
      <button
        className="btn btn-transp d-flex align-items-center gap-2"
        onClick={() => withAuth(handleToggleLikeReview)}
        disabled={isLiking}
      >
        <Icon
          icon={`ant-design:like-${isLikedByCurrentUser ? 'filled' : 'outlined'}`}
          width={20}
        />
        {isLikedByCurrentUser ? 'Thank you for your vote' : `Helpful (${likes.length})`}
      </button>
    ),
    [handleToggleLikeReview, isLiking, isLikedByCurrentUser, likes],
  );

  const reviewerName = getFullName(props.reviewedBy, { lastNameInitial: true })?.replace(
    '.',
    '',
  );

  return (
    <section className={cls(styles.review, props.show ? 'd-block' : 'd-none')} key={props._id}>
      <div className={styles.reviewHeader}>
        <Image
          src={props.reviewedBy.imgUrl}
          width={40}
          height={40}
          objectFit="cover"
          style={{ borderRadius: '50%' }}
        />
        <span>
          {props.useNativeLinkToProfile ? (
            <a href={genUserProfileUrl(props.reviewedBy)} className="text-black link">
              {reviewerName}
            </a>
          ) : (
            <Link href={genUserProfileUrl(props.reviewedBy)} passHref>
              <a className="text-black link">{reviewerName}</a>
            </Link>
          )}{' '}
          wrote a review on {reviewDate}
        </span>

        <small className={cls(styles.location, props.hideLocation && 'd-none')}>
          {props.reviewedBy?.city ? (
            <>
              <Icon icon="material-symbols:location-on" width={15} color="#2c2c2c" />{' '}
              {props.reviewedBy.city} •{' '}
            </>
          ) : null}
          {props.reviewedBy.contributions?.length || 0} contributions
        </small>

        <Dropdown className={cls(styles.options)}>
          <Dropdown.Toggle className={'p-0'} style={{ backgroundColor: 'none' }}>
            <Icon icon="material-symbols:more-vert" width={20} />
          </Dropdown.Toggle>
          <Dropdown.Menu className="fs-5" style={{ overflowY: 'auto' }}>
            <Dropdown.Item
              eventKey="report"
              onClick={withAuth.bind(null, (_?: string) => props.openReportModal(props._id))}
            >
              Report
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className={styles.reviewText}>
        <h4 className="fs-3 mt-3 mb-3 text-dark w-max-content text-hover-dark text-hover-underline">
          <Link
            href={genUserReviewPageUrl({
              ...props.businessData!,
              reviewId: props._id!,
              reviewTitle: props.reviewTitle!,
            } as UserReviewPageUrlParams)}
            className="link"
          >
            {props.reviewTitle}
          </Link>
        </h4>

        <StarRating
          initialValue={props.businessRating}
          starSize="lg"
          readonly
          className="mb-5"
        />

        <div>
          {domUtils.renderMultiLineText(
            !isShowingFullReviewText ? getPartialReviewText() : props.review,
          )}
        </div>
      </div>

      <Accordion className="mb-5">
        <CustomAccordionToggle
          eventKey="1"
          className="btn btn-bg-none no-bg-hover text-pry"
          style={{ marginTop: '-7px' }}
          contentOnExpand={
            <>
              <Icon icon="material-symbols:expand-less-rounded" height={20} /> Show less
            </>
          }
          onClick={toggleShowFullReviewText}
        >
          <Icon icon="material-symbols:expand-more-rounded" height={20} /> Show more
        </CustomAccordionToggle>
        <Accordion.Collapse eventKey="1">
          <div className={styles.hiddenContent}>
            <div className="d-flex align-items-start flex-wrap  mt-4 fs-4 gap-2">
              <small className="w-max-content text-black">Tips for visitors: </small>
              <small className="parag mb-2 d-block">{props.adviceToFutureVisitors}</small>
            </div>

            <div className="d-flex align-items-center fs-4 gap-2">
              <small className="w-max-content text-black">Date of visit: </small>
              <small className="parag">
                {props.visitedWhen.month + ' ' + props.visitedWhen.year}
              </small>
            </div>

            <div className="d-flex align-items-center fs-4 gap-2">
              <small className="w-max-content text-black">Visit type: </small>
              <small className="parag">{props.visitType}</small>
            </div>
            <span>
              <small className="text-black">{props.reviewedBy.firstName} </small>
              {recommendStatusText}{' '}
              <Link
                href={genBusinessPageUrl({
                  ...props.businessData,
                  businessId: props.businessData._id,
                })}
              >
                <a className="text-black link">{props.businessData.businessName}</a>
              </Link>
            </span>

            <div className={cls(styles.featureRatings, 'my-5', 'no-bullets')}>
              <FeatureRating
                features={props.featureRatings.map(f => f.feature)}
                ratings={props.featureRatings.map(f => f.rating)}
                readonly
                grid
              />
            </div>
          </div>
        </Accordion.Collapse>
      </Accordion>

      <div
        className={cls(styles.reviewImages, 'd-flex align-items-center flex-wrap')}
        ref={imgsContianerRef}
      >
        <ImageList
          images={useMemo(
            () => props.images.map(img => ({ ...img, src: img.photoUrl })),
            [props.images],
          )}
          limit={4}
          imageProps={{ layout: 'fill', objectFit: 'cover' }}
          pictureClassName={styles.picture}
        />
      </div>

      <hr />

      <div className={styles.reviewFooter}>
        {btnLike}

        <button
          className="btn btn-transp d-flex align-items-center gap-2"
          onClick={props.openShareModal?.bind?.(null, props._id, props.reviewTitle)}
        >
          <Icon icon="fluent:share-48-regular" width={20} /> Share
        </button>

        <button
          className="btn bg-none"
          onClick={
            props.totalLikes > 0 ? props.openReviewLikers.bind(null, props._id) : undefined
          }
        >
          {likes.length
            ? qtyUtils.getPeopleQuantity(likes.length)?.concat(' found this review helpful')
            : 'No helpful votes, was it helpful to you?'}
        </button>
      </div>
    </section>
  );
};

export default ReviewItem;
