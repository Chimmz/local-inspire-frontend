import React, { useEffect, useMemo, useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
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
import Head from 'next/head';

interface Props {
  status: string;
  review: ReviewProps | undefined;
  error: Error | undefined;
}

const UserReviewPage: NextPage<Props> = function (props) {
  const [review, setReview] = useState<ReviewProps | undefined>(undefined);

  const [showLikersModal, setShowLikersModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const [userCopiedUrl, setUserCopiedUrl] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (props.review) setReview(props.review);
  }, [props.review]);

  useEffect(() => {
    setPageUrl(window.location.origin.concat(router.asPath));
  }, []);

  const userFullname = useMemo(() => {
    return review?.reviewedBy
      ? getFullName(review?.reviewedBy, { lastNameInitial: true })
      : '';
  }, [review?.reviewedBy, getFullName]);

  const businessUrl = useMemo(
    () =>
      review?.business
        ? genBusinessPageUrl<{}>({ ...review?.business!, businessId: review?.business._id })
        : '',
    [review?.business],
  );

  const handleReportReview = async (reviewId: string) => {
    console.log('Reporting review: ', reviewId);
  };

  return (
    <SSRProvider>
      <Head>
        <title>
          {`Favorite Restaurant - Reviews for ${review?.business.businessName
            .concat(', ')
            .concat(review?.business.stateCode)} | Localinspire`}
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
                <Link href={businessUrl}>
                  {review?.business.businessName || 'Loading...'}
                </Link>
              </small>
              <Icon icon="ic:baseline-greater-than" width={10} />
              <small className="">
                {userFullname ? `${userFullname}'s` : 'Loading...'} of{' '}
                {review?.business.businessName}
              </small>
            </nav>

            <h1>
              {review?.reviewedBy.firstName}'s review of {review?.business.businessName}
            </h1>

            {review ? (
              <ReviewItem
                {...review}
                show
                businessName={'Business Name'}
                openReviewLikers={setShowLikersModal.bind(null, true)}
                openReportModal={() => setShowReportModal(true)}
              />
            ) : (
              <section></section>
            )}

            <aside>
              <h3 className="mb-5">Share this review</h3>
              <section className={styles.share}>
                <FacebookShareButton url={pageUrl} className="w-100">
                  <button
                    className="btn btn-pry btn--lg w-100 mb-3"
                    style={{ backgroundColor: '#3b5998' }}
                  >
                    Share on Facebook
                  </button>
                </FacebookShareButton>

                <TwitterShareButton url={pageUrl} className="w-100">
                  <button
                    className="btn btn-pry btn--lg w-100 color-white mb-3"
                    style={{ backgroundColor: '#1da1f2' }}
                  >
                    Share on Twitter
                  </button>
                </TwitterShareButton>

                <InputGroup className="mb-5">
                  <TextInput
                    value={pageUrl}
                    className="textfield flex-grow-1"
                    style={{ flexBasis: '80%' }}
                    readonly
                    selectOnFocus
                  />
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-copy-url">
                        {!userCopiedUrl ? 'Copy URL' : 'Copied!'}
                      </Tooltip>
                    }
                  >
                    <CopyToClipboard
                      text={pageUrl}
                      onCopy={setUserCopiedUrl.bind(null, true)}
                    >
                      <button
                        className="btn btn-outline"
                        onMouseLeave={setTimeout.bind(
                          null,
                          setUserCopiedUrl.bind(null, false),
                          100,
                        )}
                      >
                        <Icon icon="material-symbols:content-copy" width={16} />
                      </button>
                    </CopyToClipboard>
                  </OverlayTrigger>

                  <small className="d-block">
                    Want to link to it instead? Copy the above URL!
                  </small>
                </InputGroup>

                <h2 className="mb-4">Crystals Cabin</h2>

                <ul
                  className={cls(styles.businessInfo, 'no-bullets d-flex flex-column gap-3')}
                >
                  <li className="d-flex align-items-center gap-3">
                    <Icon icon="ic:outline-location-on" width={19} />
                    {review?.business.address}
                  </li>
                  <li className="d-flex align-items-center gap-3">
                    <Icon icon="ri:direction-line" width={19} />
                    <Link href={'/'}>Get Directions</Link>
                  </li>
                  <li className="d-flex align-items-center gap-3">
                    <Icon icon="fluent-mdl2:website" width={18} />
                    <Link href={'https://'.concat(review?.business.web || '')} passHref>
                      <a target="_blank">Website</a>
                    </Link>
                  </li>
                  {review?.business.email ? (
                    <li className="d-flex align-items-center gap-3">
                      <Icon icon="ic:outline-email" width={18} />
                      <Link href={'mailto:'.concat(review?.business.email || '')} passHref>
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
        onReport={handleReportReview}
        close={setShowReportModal.bind(null, false)}
      />
    </SSRProvider>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  try {
    const slug = context.params!.userReviewPageSlug as string;
    const { reviewId } = parseUserReviewPageSlug(slug);
    const res = await api.getReviewById(reviewId);

    return {
      props: {
        status: res.status,
        review: res?.review,
      },
    };
  } catch (err) {
    return { props: { error: err } };
  }
};

export default UserReviewPage;
