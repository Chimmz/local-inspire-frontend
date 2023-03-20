import React, { EventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import cls from 'classnames';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Layout from '../../features/components/layout';
import { ReviewProps } from '../../features/components/page-reviews/UserReview';
import api from '../../features/library/api';
import { UserPublicProfile } from '../../features/types';
import { getFullName } from '../../features/utils/user-utils';

import { Spinner as BSpinner, SSRProvider } from 'react-bootstrap';
import ProfileHeader from '../../features/components/public-profile/ProfileHeader';
import ProfileAbout from '../../features/components/public-profile/ProfileAbout';
import ProfileStats from '../../features/components/public-profile/ProfileStats';
import ReviewItem from '../../features/components/business-listings/reviews/ReviewItem';
import reviewsSectionStyles from '../../features/components/business-listings/reviews/ReviewsSection.module.scss';
import styles from '../../styles/sass/pages/ProfilePage.module.scss';
import { BusinessProps } from '../../features/components/business-results/Business';
import ReviewLikersModal from '../../features/components/business-listings/reviews/ReviewLikersModal';
import { reviewReportReasonsConfig } from '../../features/components/business-listings/reviews/config';
import ReportQA from '../../features/components/ReportQA';
import useRequest from '../../features/hooks/useRequest';
import usePaginate from '../../features/hooks/usePaginate';
import Spinner from '../../features/components/shared/spinner/Spinner';
import { unstable_getServerSession, NextAuthOptions } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { useRouter } from 'next/router';
import useSignedInUser from '../../features/hooks/useSignedInUser';
import LoadingButton from '../../features/components/shared/button/Button';

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
  helpfulVotes: number;
  businessReviewersCount?: Array<{ [businessId: string]: number }>;
  following?: number;
  currentUserBlocked?: boolean | undefined;
}

const MAX_REVIEWS_TO_FETCH = 3;

const UserProfilePage: NextPage<PageProps> = function (props) {
  const [currentUserBlocked, setCurrentUserBlocked] = useState(props.currentUserBlocked);
  const [reviews, setReviews] = useState(props.reviews);
  const [followers, setFollowers] = useState<string[]>(props.user?.followers || []);
  const [views, setViews] = useState({ updated: false, total: props.user?.profileViews });
  const [scrollHandlers, setScrollHandlers] = useState<any[]>([]);

  const [reviewReportId, setReviewReportId] = useState<string | null>(null);
  const [spinnerShown, setSpinnerShown] = useState(false);
  const [reviewToShare, setReviewToShare] = useState<{
    _id: string;
    reviewTitle: string;
  } | null>(null);

  const [reviewLikers, setReviewLikers] = useState<null | {
    reviewId: string;
  }>(null);

  const { isSignedIn, ...currentUser } = useSignedInUser();
  const { send: sendReviewsReq, loading: isLoadingReviews } = useRequest();
  const { currentPage, setCurrentPage } = usePaginate({ init: [], defaultCurrentPage: 1 });
  const router = useRouter();

  useEffect(() => {
    // Find out if signed user is part of the profile user's blocked list
    if (isSignedIn && props.user?.blockedUsers.includes(currentUser!._id!))
      setCurrentUserBlocked(true);
  }, [isSignedIn]); // Listen for a signin / signup

  const moreReviewsExistInDB = useMemo(() => {
    return !reviews ? true : reviews.data?.length < reviews.total;
  }, [reviews, reviews?.data?.length, reviews?.total]);

  const loadMoreReviews = (page: number) => {
    if (!props.user || !moreReviewsExistInDB) return;
    const isFirstLoad = currentPage === 1;
    const req = api.getReviewsMadeByUser(props.user?._id, { page, limit: MAX_REVIEWS_TO_FETCH });

    sendReviewsReq(req).then(res => {
      if (res?.status !== 'SUCCESS') return;
      if (isFirstLoad) setReviews(res);
      else setReviews({ ...res, data: [...(reviews?.data || []), ...res.data] });
    });
  };

  useEffect(() => {
    if (currentPage === 1) return; // Dont load first page data since we get it from server
    loadMoreReviews(currentPage);
  }, [currentPage]); // On page change, load reviews

  useEffect(() => {
    // const handleScroll = function (this: Window, ev: Event) {
    //   const isAtBottom = this.innerHeight + this.scrollY === document.body.offsetHeight;
    //   if (!isAtBottom || !moreReviewsExistInDB || isLoadingReviews) return;
    //   setCurrentPage(currentPage + 1);
    // };
    // window.addEventListener('scroll', handleScroll);
    // setScrollHandlers(handlers => {
    //   handlers.forEach(h => window.removeEventListener('scroll', h)); // Remove previous listeners
    //   return [handleScroll]; // Only current listener
    // });
  }, [currentPage]); // Start a new scroll event listener on page change

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
    (reviewId: string) => setReviewLikers({ reviewId }),
    [setReviewLikers],
  );

  const userName = useMemo(
    () => getFullName(props.user, { lastNameInitial: true }),
    [props.user],
  );

  return (
    <SSRProvider>
      <Spinner show={spinnerShown} pageWide />
      <Head>
        <title>{`${userName}. reviews, photos and more`}</title>
      </Head>
      <Layout>
        <Layout.Nav withSearchForm></Layout.Nav>
        <div className="" style={{ backgroundColor: '#f5f5f5' }}>
          {currentUserBlocked ? (
            <section className={cls(styles.unAvailableProfile, 'xy-center')}>
              <h3 className="fs-2 mt-2">This user&apos;s profile is not available.</h3>
              <button className="btn btn-outline-pry mt-5" onClick={router.back}>
                Go back
              </button>
            </section>
          ) : (
            <div className={cls(styles.container, 'container flex-grow-1')}>
              <ProfileHeader
                user={props.user}
                followers={followers}
                followingCount={props.following}
                onFollowUser={setFollowers}
              />

              <div className={styles.profileInfo}>
                <ProfileStats
                  user={props.user}
                  photosUploadedTotal={reviews?.data.map(r => r.images)?.length}
                  totalReviewsMade={reviews?.total}
                  totalHelfulVotes={props.helpfulVotes}
                  followingCount={props.following!}
                  followersCount={followers.length}
                  profileViews={views.total}
                  showSpinner={setSpinnerShown}
                />
                <ProfileAbout user={props.user} />
              </div>

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

                <LoadingButton
                  isLoading={isLoadingReviews}
                  withSpinner
                  className={cls(
                    'btn btn-pry d-flex align-items-center gap-2 my-5 w-max-content btn-rounded mx-auto',
                    moreReviewsExistInDB ? 'd-block' : 'd-none',
                  )}
                  onClick={setCurrentPage.bind(null, currentPage + 1)}
                >
                  Show more
                  <Icon icon="material-symbols:expand-more-rounded" width={20} />
                </LoadingButton>
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
                reviewId={reviewLikers?.reviewId}
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
            </div>
          )}
        </div>
      </Layout>
    </SSRProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const [, userId] = (context.params!.profilePageSlug as string).split('_');

    const responses = await Promise.allSettled([
      api.getUserPublicProfile(userId),
      api.getReviewsMadeByUser(userId, { page: 1, limit: MAX_REVIEWS_TO_FETCH }),
      unstable_getServerSession(context.req, context.res, authOptions as NextAuthOptions),
    ]);

    const [profile, reviews, session] = responses
      .filter(res => res.status === 'fulfilled' && res.value)
      .map(res => res.status === 'fulfilled' && res.value);

    console.log('Session: ', session);
    console.log({ profile, reviews });

    if (profile.status === 'NOT_FOUND') return { notFound: true };
    if (profile.status === 'ERROR') throw Error(profile);

    const currentUserBlocked = profile.user?.blockedUsers?.includes(session?.user?._id);
    const props = { ...profile, reviews };

    if (session) props.currentUserBlocked = currentUserBlocked;

    return { props };
  } catch (err) {
    console.log('Error: ', err);
    return { props: { status: 'ERROR', error: err } };
  }
};

export default UserProfilePage;
