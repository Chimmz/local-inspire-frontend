import { useState, useEffect, useMemo } from 'react';
import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { authOptions } from '../api/auth/[...nextauth]';

// Types
import Review, { ReviewProps } from '../../features/components/page-reviews/UserReview';

// Hooks
import { useRouter } from 'next/router';
import useSignedInUser from '../../features/hooks/useSignedInUser';
import useRequest from '../../features/hooks/useRequest';

// Utils and helpers
import { toTitleCase } from '../../features/utils/string-utils';
import api from '../../features/library/api';

// Classes, styles, and external components
import cls from 'classnames';
import { Icon } from '@iconify/react';
import Layout from '../../features/components/layout';
import NewReviewForm from '../../features/components/page-reviews/NewReviewForm';
import Spinner from '../../features/components/shared/spinner/Spinner';
import Alert from 'react-bootstrap/Alert';
import styles from '../../styles/sass/pages/RecommendBusiness.module.scss';
import { SSRProvider } from 'react-bootstrap';
import { BusinessProps } from '../../features/components/business-results/Business';

interface Props {
  reviews: { status: 'SUCCESS' | 'FAIL' | 'ERROR'; data: ReviewProps[] | undefined };
  business: { status: 'SUCCESS' | 'FAIL' | 'ERROR'; data: BusinessProps | undefined };
  slug: string;
}

const ReviewsPage: NextPage<Props> = function (props: Props) {
  const [reviews, setReviews] = useState<ReviewProps[]>([]);

  const [currentUserReview, setCurrentUserReview] = useState<ReviewProps | null>(null);
  const [showReviewedBeforeAlert, setShowReviewedBeforeAlert] = useState(false);
  const [attemptedUserReviewFetch, setAttemptedUserReviewFetch] = useState(false);
  const { isSignedIn, ...currentUser } = useSignedInUser();

  const { send: sendUserReviewReq, loading: isGettingUserReview } = useRequest({
    autoStopLoading: true,
  });
  const { send: sendReviewRequest, loading: isSubmittingReview } = useRequest({
    autoStopLoading: true,
  });

  useEffect(() => {
    if (!isSignedIn) return;
    const req = api.getUserReviewOnBusiness(businessId, currentUser.accessToken!);

    sendUserReviewReq(req)
      .then(res => {
        if (res.status === 'SUCCESS' && res.review !== null) {
          setCurrentUserReview(res.review);
          setShowReviewedBeforeAlert(true);
        }
      })
      .finally(setAttemptedUserReviewFetch.bind(null, true));
  }, [isSignedIn, currentUser.accessToken]);

  useEffect(() => {
    if (!props.reviews?.data?.length) return;
    setReviews(props.reviews.data);
  }, [props?.reviews]);

  const router = useRouter();
  const userRecommendYes = router.query.recommend === 'yes';
  const userIsNeutral = !router.query.recommend;
  const [businessName, location, businessId] = useMemo(
    () => (router.query.reviewPageSlug as string).split('_'),
    [],
  );

  return (
    <SSRProvider>
      <Layout>
        <Spinner pageWide show={isGettingUserReview || isSubmittingReview} />
        <Layout.Nav>
          {showReviewedBeforeAlert ? (
            <Alert
              variant="info"
              className="text-center fs-4 position-absolute w-100"
              dismissible
              onClose={setShowReviewedBeforeAlert.bind(null, false)}
            >
              You have previously reviewed {toTitleCase(businessName, '-')}
            </Alert>
          ) : null}
        </Layout.Nav>
        <Layout.Main className={styles.main}>
          <div className={cls(styles.container, 'container')}>
            <div className={styles.newReview}>
              <h1 className={cls('u-page-main-heading mb-5')}>
                Write a review for {toTitleCase(businessName, '-')}
              </h1>

              {userIsNeutral ? (
                <section className={styles.wouldYouRecommend}>
                  <strong className="me-auto fs-3">Do you recommend Chicken Express?</strong>
                  <Link href={`/write-a-review/${router.query.reviewPageSlug}?recommend=yes`}>
                    <span className="btn btn-outline">Yes</span>
                  </Link>
                  <Link href={`/write-a-review/${router.query.reviewPageSlug}?recommend=no`}>
                    <span className="btn btn-outline">No</span>
                  </Link>
                </section>
              ) : (
                <section
                  className={cls(styles.wouldYouRecommend, styles.responseFromBusiness)}
                  style={{ display: 'block' }}
                >
                  <Icon
                    icon="icon-park:quote"
                    width={35}
                    className="mb-3"
                    color="#024180"
                    style={{ color: '#024180' }}
                  />
                  <p className="parag fs-3 mb-5">
                    <strong className="text-dark">{`${
                      userRecommendYes
                        ? 'Thank you for recommending us.'
                        : 'Sorry you were disappointed.'
                    }`}</strong>{' '}
                    {`${
                      userRecommendYes
                        ? 'Please give your personal experience with us below! Your review will help consumers find trustworthy businesses.'
                        : 'Please help us to improve by giving us constructive criticism!'
                    }`}
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <Image
                      src="/img/default-profile-pic.jpeg"
                      height={70}
                      width={70}
                      style={{
                        borderRadius: '50%',
                        border: '1px solid gray',
                      }}
                      objectPosition="bottom"
                    />
                    — Rockwall, TX
                  </div>
                </section>
              )}

              {attemptedUserReviewFetch ? (
                <NewReviewForm
                  userRecommends={userRecommendYes}
                  userReview={currentUserReview}
                  businessId={props.business.data?._id!}
                  businessName={props.business.data?.businessName!}
                  sendReviewRequest={sendReviewRequest}
                  submitting={isSubmittingReview}
                  readonly={Boolean(currentUserReview)}
                  slug={props.slug}
                />
              ) : null}
            </div>

            {/* Recent reviews */}
            <aside className={styles.recentReviews}>
              <h3 className="mb-4">Recent Reviews</h3>
              {!!reviews?.length ? (
                reviews?.map(review => <Review {...review} key={review._id} />)
              ) : (
                <small style={{ color: '#ccc', fontSize: '16px' }}>
                  No reviews made for {toTitleCase(businessName, '-')}.
                </small>
              )}
            </aside>
          </div>
        </Layout.Main>
      </Layout>
    </SSRProvider>
  );
};

export const getStaticPaths: GetStaticPaths = async function (context) {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params!.reviewPageSlug as string;
  const [businessName, location, businessId] = slug.split('_');

  const business = (await api.getBusinessById(businessId)) as {
    data: Partial<BusinessProps>;
  };

  if (
    !business?.data?._id ||
    business.data.businessName?.toLowerCase().split(' ').join('-') !== businessName ||
    [business?.data?.city, business?.data?.stateCode].join('-').toLowerCase() !==
      location.toLowerCase()
  )
    return { notFound: true };

  const res = await api.getBusinessReviews(businessId);
  return {
    props: { reviews: res, business, slug },
    revalidate: 30000,
  };
};

export default ReviewsPage;
