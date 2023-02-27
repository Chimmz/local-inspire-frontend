import React, { useEffect, useMemo, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { ReviewProps } from '../../features/components/page-reviews/UserReview';

import useDate from '../../features/hooks/useDate';

import api from '../../features/library/api';
import { getFullName } from '../../features/utils/user-utils';
import { genBusinessPageUrl, parseUserReviewPageSlug } from '../../features/utils/url-utils';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import { InputGroup, SSRProvider } from 'react-bootstrap';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import CopyToClipboard from 'react-copy-to-clipboard';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ReviewItem from '../../features/components/business-listings/reviews/ReviewItem';
import Layout from '../../features/components/layout';
import styles from '../../styles/sass/pages/UserReviewPage.module.scss';
import TextInput from '../../features/components/shared/text-input/TextInput';
import ReviewLikersModal from '../../features/components/business-listings/reviews/ReviewLikersModal';
import ReportQA from '../../features/components/ReportQA';
import { BusinessProps } from '../../features/components/business-results/Business';
import { reviewReportReasonsConfig } from '../../features/components/business-listings/reviews/config';
import ShareStrategies from '../../features/components/shared/social-share/ShareStrategies';
import SocialShareModal from '../../features/components/shared/social-share/SocialShare';

interface Props {
  status: 'SUCCESS' | 'FAIL';
  review: ReviewProps | undefined;
  business: BusinessProps | undefined;
  error: Error | undefined;
}

const UserReviewPage: NextPage<Props> = function (props) {
  const [review, setReview] = useState<ReviewProps | undefined>(undefined);

  // Modals
  const [showLikersModal, setShowLikersModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (props.review) setReview(props.review);
  }, [props.review]);

  const userFullname = useMemo(() => {
    return review?.reviewedBy
      ? getFullName(review?.reviewedBy, { lastNameInitial: true })
      : '';
  }, [review?.reviewedBy]);

  const businessUrl = useMemo(
    () =>
      props.business
        ? genBusinessPageUrl<{}>({ ...props.business, businessId: props.business?._id })
        : '',
    [props.business],
  );

  return (
    <SSRProvider>
      <Head>
        <title>
          {`${props.review?.reviewTitle} - Reviews for ${props.business?.businessName}, ${props.business?.city}, 
            ${props.business?.stateCode}`}
        </title>
      </Head>
      <Layout>
        <Layout.Nav></Layout.Nav>
        <Layout.Main className={styles.main}>
          <div className={cls('container', styles.page)}>
            <nav
              className={cls(
                styles.pageRouteNav,
                'd-flex align-items-center gap-2 mb-5 flex-wrap',
              )}
            >
              <small className="text-pry">
                <Link href="/">Home</Link>
              </small>
              <Icon icon="ic:baseline-greater-than" width={10} />
              <small className="text-pry">
                <Link href={businessUrl}>{props.business?.businessName || 'Loading...'}</Link>
              </small>
              <Icon icon="ic:baseline-greater-than" width={10} />
              <small className="">
                {userFullname ? `${userFullname}'s review of ` : 'Loading...'}
                {props.business?.businessName}
              </small>
            </nav>

            <h1>
              {review?.reviewedBy.firstName}&apos;s review of {props.business?.businessName}
            </h1>

            {review ? (
              <ReviewItem
                {...review}
                businessData={props.business!}
                businessName={'Business Name'}
                openReviewLikers={setShowLikersModal.bind(null, true)}
                openReportModal={() => setShowReportModal(true)}
                openShareModal={setShowShareModal.bind(null, true)}
                show
              />
            ) : (
              <section></section>
            )}

            <aside>
              <h3 className="mb-5">Share this review</h3>
              <section className={styles.share}>
                <ShareStrategies
                  className={styles.shareStrategies}
                  pageUrl={router.asPath}
                  title={review?.reviewTitle!}
                  imgUrl={review?.images[0].photoUrl}
                  layout="grid"
                />
                <h2 className="mb-4">{props.business?.businessName}</h2>

                <ul
                  className={cls(styles.businessInfo, 'no-bullets d-flex flex-column gap-3')}
                >
                  <li className="d-flex align-items-center gap-3">
                    <Icon icon="ic:outline-location-on" width={19} />
                    {props.business?.address}, {props.business?.city},{' '}
                    {props.business?.stateCode}
                  </li>
                  <li className="d-flex align-items-center gap-3">
                    <Icon icon="ri:direction-line" width={19} />
                    <Link href={'/'}>Get Directions</Link>
                  </li>
                  <li className="d-flex align-items-center gap-3">
                    <Icon icon="fluent-mdl2:website" width={18} />
                    <Link href={'https://'.concat(props.business?.web || '')} passHref>
                      <a target="_blank">Website</a>
                    </Link>
                  </li>
                  {props.business?.email ? (
                    <li className="d-flex align-items-center gap-3">
                      <Icon icon="ic:outline-email" width={18} />
                      <Link href={'mailto:'.concat(props.business?.email || '')} passHref>
                        <a target="_blank">Website</a>
                      </Link>
                      Email
                    </li>
                  ) : null}
                  <li className="d-flex align-items-center gap-3">
                    <Icon icon="ic:baseline-access-time" width={19} />
                    <button className="btn btn-bg-none no-bg-hover">View hours</button>
                  </li>
                </ul>
              </section>
            </aside>
          </div>
        </Layout.Main>
      </Layout>

      <SocialShareModal
        heading="Share Review"
        pageUrl={router.asPath}
        show={showShareModal}
        close={() => setShowShareModal(false)}
        title={review?.reviewTitle!}
      />

      {/* Modal showing likers of a review */}
      <ReviewLikersModal
        show={!!review && showLikersModal}
        likers={review?.likes.map(like => like.user)}
        reviewerName={getFullName(review?.reviewedBy, { lastNameInitial: true })}
        closeModal={setShowLikersModal.bind(null, false)}
      />

      {/* The Report modal */}
      <ReportQA
        show={showReportModal}
        reportType="review"
        reportObjectId={review?._id!}
        close={setShowReportModal.bind(null, false)}
        possibleReasons={reviewReportReasonsConfig}
      />
    </SSRProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const slug = context.params!.userReviewPageSlug as string;
    const { reviewId } = parseUserReviewPageSlug(slug);

    const res1 = await api.getReviewById(reviewId);
    console.log('res1: ', res1);
    if (res1.status === 'NOT_FOUND') return { notFound: true };

    const res2 = await api.getBusinessById(res1.review.business as string);
    console.log('res2: ', res2);

    return {
      props: { review: res1.review, business: res2.data },
      // revalidate: 10000
    };
  } catch (err) {
    return { props: { error: err } };
  }
};

export default UserReviewPage;
