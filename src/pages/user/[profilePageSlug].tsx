import { useCallback, useMemo, useState } from 'react';
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
import {
  genUserReviewPageUrl,
  UserReviewPageUrlParams,
} from '../../features/utils/url-utils';

interface PageProps {
  status?: 'SUCCESS' | 'ERROR';
  user?: UserPublicProfile;
  reviews?: {
    data: Array<
      ReviewProps & { business: Pick<BusinessProps, 'city' | 'businessName' | 'stateCode'> }
    >;
    total: number;
  };
  businessReviewsCount?: Array<{ [businessId: string]: number }>;
  following?: number;
}

const UserProfilePage: NextPage<PageProps> = function (props) {
  const [reviewReportId, setReviewReportId] = useState<string | null>(null);

  const [reviewToShare, setReviewToShare] = useState<{
    _id: string;
    reviewTitle: string;
  } | null>(null);

  const [reviewLikers, setReviewLikers] = useState<null | {
    likers: UserPublicProfile[];
    reviewerName: string;
  }>(null);

  const openReviewLikers = useCallback(
    function (likers: UserPublicProfile[], reviewerName: string) {
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
              photosUploadedTotal={props.reviews?.data.map(r => r.images)?.length}
              totalReviewsMade={props.reviews?.total}
              followingCount={props.following!}
            />

            <Layout.Main className={reviewsSectionStyles.reviewsSection}>
              {props.reviews?.data.map(r => (
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
            />

            {/* Share review */}
            {/* <SocialShareModal
              heading="Share Review"
              pageUrl={() => {
                if (props.business && reviewToShare)
                  return genUserReviewPageUrl({
                    ...props.reviews?.data?.[0].business!,
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

export const getStaticProps: GetStaticProps = async function (
  context: GetStaticPropsContext,
) {
  try {
    const [, userId] = (context.params!.profilePageSlug as string).split('_');
    const profile = await api.getUserPublicProfile(userId);

    if (profile.status === 'NOT_FOUND') return { notFound: true };
    if (profile.status === 'ERROR') throw Error(profile);

    return {
      props: profile,
      revalidate: 60000,
    };
  } catch (err) {
    return { props: { status: 'ERROR', error: err } };
  }
};

export default UserProfilePage;
