import React, { useEffect, useMemo, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { ReviewProps } from '../../features/components/page-reviews/UserReview';

import useRequest from '../../features/hooks/useRequest';
import { useRouter } from 'next/router';

import api from '../../features/library/api';
import { getFullName } from '../../features/utils/user-utils';
import { genBusinessPageUrl, parseUserReviewPageSlug } from '../../features/utils/url-utils';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import { SSRProvider } from 'react-bootstrap';
import ReviewItem from '../../features/components/business-listings/reviews/ReviewItem';
import Layout from '../../features/components/layout';
import ReviewLikersModal from '../../features/components/business-listings/reviews/ReviewLikersModal';
import ReportQA from '../../features/components/ReportQA';
import { BusinessProps } from '../../features/components/business-results/Business';
import { reviewReportReasonsConfig } from '../../features/components/business-listings/reviews/config';
import ShareStrategies from '../../features/components/shared/social-share/ShareStrategies';
import SocialShareModal from '../../features/components/shared/social-share/SocialShare';
import styles from '../../styles/sass/pages/UserReviewPage.module.scss';

interface Props {
  status: 'SUCCESS' | 'FAIL';
  review: ReviewProps | undefined;
  business: BusinessProps | undefined;
  error: Error | undefined;
}

const UserReviewPage: NextPage<Props> = function (props) {
  const [review, setReview] = useState<ReviewProps | undefined>(undefined);
  const { send: sendReviewReq, loading: loadingReview } = useRequest();

  // Modals
  const [showLikersModal, setShowLikersModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!props.review) return;
    const req = api.getReviewById(props.review?._id);
    sendReviewReq(req).then(res => res?.status === 'SUCCESS' && setReview(res.review));
  }, [props.review]);

  const userFullname = useMemo(() => {
    return getFullName(review?.reviewedBy, { lastNameInitial: true });
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
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dpvothk2d/image/upload/v1683556731/cities/nntym97fap8yabj3cbdx.jpg"
        ></meta>
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
                businessName={props.business?.businessName || ''}
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

                <ul className={cls(styles.businessInfo, 'no-bullets d-flex flex-column gap-3')}>
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
        reviewId={review?._id}
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
    const { reviewId, businessName } = parseUserReviewPageSlug(slug);

    const reviewRes = await api.getReviewById(reviewId);
    console.log('reviewRes: ', reviewRes);
    if (reviewRes.status === 'NOT_FOUND') return { notFound: true };

    const businessResponse = await api.getBusinessById(reviewRes.review.business as string);
    console.log('businessResponse: ', businessResponse);

    return {
      props: { review: reviewRes.review, business: businessResponse.data, businessName },
      // revalidate: 10000
    };
  } catch (err) {
    return { props: { error: err } };
  }
};

export default UserReviewPage;
