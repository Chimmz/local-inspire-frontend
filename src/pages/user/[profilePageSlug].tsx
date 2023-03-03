import React, {
  EventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
  WheelEventHandler,
} from 'react';
import { Icon } from '@iconify/react';
import cls from 'classnames';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { SSRProvider } from 'react-bootstrap';
import Layout from '../../features/components/layout';
import { ReviewProps } from '../../features/components/page-reviews/UserReview';
import api from '../../features/library/api';
import { UserPublicProfile } from '../../features/types';
import { getFullName } from '../../features/utils/user-utils';
import ProfileHeader from '../../features/components/public-profile/ProfileHeader';
import ProfileAbout from '../../features/components/public-profile/ProfileAbout';
import ProfileStats from '../../features/components/public-profile/ProfileStats';
import ReviewItem from '../../features/components/business-listings/reviews/ReviewItem';
import reviewsSectionStyles from '../../features/components/business-listings/reviews/ReviewsSection.module.scss';
import styles from '../../styles/sass/pages/ProfilePage.module.scss';
import { BusinessProps } from '../../features/components/business-results/Business';
import SocialShareModal from '../../features/components/shared/social-share/SocialShare';
import ReviewLikersModal from '../../features/components/business-listings/reviews/ReviewLikersModal';
import { reviewReportReasonsConfig } from '../../features/components/business-listings/reviews/config';
import ReportQA from '../../features/components/ReportQA';
import NoReviewsYet from '../../features/components/business-listings/reviews/NoReviewsYet';
import { genUserReviewPageUrl, UserReviewPageUrlParams } from '../../features/utils/url-utils';
import useRequest from '../../features/hooks/useRequest';
import usePaginate from '../../features/hooks/usePaginate';

interface PageProps {
  status?: 'SUCCESS' | 'ERROR';
  user?: UserPublicProfile;
  reviews?: {
    data: Array<
      ReviewProps & { business: Pick<BusinessProps, 'city' | 'businessName' | 'stateCode'> }
    >;
    results: number;
    total: number;
  };
  businessReviewersCount?: Array<{ [businessId: string]: number }>;
  following?: number;
}

const MAX_REVIEWS_TO_FETCH = 3;

const UserProfilePage: NextPage<PageProps> = function (props) {
  const [reviews, setReviews] = useState(props.reviews);
  const [views, setViews] = useState({ updated: false, total: props.user?.profileViews });
  const [reviewReportId, setReviewReportId] = useState<string | null>(null);
  const [reviewToShare, setReviewToShare] = useState<{
    _id: string;
    reviewTitle: string;
  } | null>(null);

  const [reviewLikers, setReviewLikers] = useState<null | {
    likers: UserPublicProfile[];
    reviewerName: string;
  }>(null);

  const { currentPage, setCurrentPage } = usePaginate({ init: [], defaultCurrentPage: 1 });
  const [scrollHandlers, setScrollHandlers] = useState<any[]>([]);
  const { send: sendReviewsReq, loading: isLoadingReviews } = useRequest();

  const shouldLoadMoreData = useMemo(() => {
    return !reviews ? true : reviews.data.length < reviews.total;
  }, [reviews, reviews?.data.length, reviews?.total]);

  const loadReviews = (page: number) => {
    if (!props.user) return;
    const isFirstLoad = currentPage === 1;

    if (!shouldLoadMoreData) return;

    const req = api.getReviewsMadeByUser(props.user?._id, {
      page,
      limit: MAX_REVIEWS_TO_FETCH,
    });
    sendReviewsReq(req).then(res => {
      if (res?.status !== 'SUCCESS') return;
      if (isFirstLoad) setReviews(res);
      else setReviews({ ...res, data: [...(reviews?.data || []), ...res.data] });
    });
  };

  useEffect(() => {
    const handleScroll = function (this: Window, ev: Event) {
      const isAtBottom = this.innerHeight + this.scrollY === document.body.offsetHeight;

      if (!isAtBottom || !shouldLoadMoreData || isLoadingReviews) return;
      setCurrentPage(currentPage + 1);
    };
    window.addEventListener('scroll', handleScroll);

    setScrollHandlers(handlers => {
      handlers.forEach(h => window.removeEventListener('scroll', h)); // Stop listening to previous listeners
      return [handleScroll]; // Only current listener
    });
  }, [currentPage]);

  useEffect(() => {
    loadReviews(currentPage);
  }, [currentPage]);

  useEffect(() => {
    // On unmount
    return () => {
      if (props.user)
        api.updateUserProfileViews(props.user._id).then(res => {
          res?.status === 'SUCCESS' && setViews({ updated: true, total: res.profileViews });
        });
      scrollHandlers.forEach(handler => window.removeEventListener('scroll', handler));
    };
  }, []);

  const openReviewLikers = useCallback(
    (likers: UserPublicProfile[], reviewerName: string) => {
      setReviewLikers({ likers, reviewerName });
    },
    [setReviewLikers],
  );

  const userName = useMemo(
    () => getFullName(props.user, { lastNameInitial: true }),
    [props.user],
  );

  return (
    <SSRProvider>
      <Head>
        <title>{`${userName}. reviews, photos and more`}</title>
      </Head>
      <Layout>
        <Layout.Nav withSearchForm></Layout.Nav>
        <div className="" style={{ backgroundColor: '#f5f5f5' }}>
          <div className={cls(styles.container, 'container flex-grow-1')}>
            <ProfileHeader user={props.user} followingCount={props.following} />

            <ProfileStats
              user={props.user}
              photosUploadedTotal={reviews?.data.map(r => r.images)?.length}
              totalReviewsMade={reviews?.total}
              followingCount={props.following!}
              profileViews={views.total}
            />

            <Layout.Main className={reviewsSectionStyles.reviewsSection}>
              {reviews?.data.map(r => (
                <ReviewItem
                  show
                  key={r._id}
                  {...r}
                  businessData={r.business}
                  businessName={r.business.businessName}
                  openReviewLikers={openReviewLikers}
                  openReportModal={(reviewId: string) => setReviewReportId(reviewId)}
                  openShareModal={(reviewId: string, reviewTitle: string) =>
                    setReviewToShare({ _id: reviewId, reviewTitle })
                  }
                  hideLocation
                  useNativeLinkToProfile
                />
              ))}
            </Layout.Main>

            <aside className={styles.ads}>Ads</aside>

            {/* The Report modal */}
            <ReportQA
              show={!!reviewReportId}
              reportObjectId={reviewReportId as string}
              reportType="review"
              possibleReasons={reviewReportReasonsConfig}
              close={setReviewReportId.bind(null, null)}
            />

            {/* Modal showing likers of a review */}
            <ReviewLikersModal
              show={!!reviewLikers}
              closeModal={setReviewLikers.bind(null, null)}
              likers={reviewLikers?.likers}
              reviewerName={reviewLikers?.reviewerName}
              useNativeLinkToProfile
            />

            {/* Share review */}
            {/* <SocialShareModal
              heading="Share Review"
              pageUrl={() => {
                if (props.business && reviewToShare)
                  return genUserReviewPageUrl({
                    ...reviews?.data?.[0].business!,
                    reviewId: reviewToShare?._id!,
                    reviewTitle: reviewToShare?.reviewTitle!,
                  });
                return '';
              }}
              show={!!reviewToShare}
              close={setReviewToShare.bind(null, null)}
              title={reviewToShare?.reviewTitle!}
            /> */}

            <ProfileAbout user={props.user} />
          </div>
        </div>
      </Layout>
    </SSRProvider>
  );
};

export const getStaticPaths: GetStaticPaths = function (context) {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async function (context: GetStaticPropsContext) {
  try {
    const [, userId] = (context.params!.profilePageSlug as string).split('_');
    const responses = await Promise.allSettled([
      api.getUserPublicProfile(userId),
      api.getReviewsMadeByUser(userId, { page: 1, limit: MAX_REVIEWS_TO_FETCH }),
    ]);

    const [profile, reviews] = responses
      .filter(res => res.status === 'fulfilled' && res.value)
      .map(res => res.status === 'fulfilled' && res.value);

    console.log({ profile, reviews });

    if (profile.status === 'NOT_FOUND') return { notFound: true };
    if (profile.status === 'ERROR') throw Error(profile);

    return {
      props: { ...profile, reviews },
      revalidate: 60000,
    };
  } catch (err) {
    return { props: { status: 'ERROR', error: err } };
  }
};

export default UserProfilePage;
