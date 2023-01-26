import { useCallback, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession, NextAuthOptions, Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { authOptions } from '../api/auth/[...nextauth]';

// Types
import Review, { ReviewProps } from '../../features/components/recommend-business/UserReview';

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
import NewReviewForm from '../../features/components/recommend-business/NewReviewForm';
import Spinner from '../../features/components/shared/spinner/Spinner';
import Alert from 'react-bootstrap/Alert';
import styles from '../../styles/sass/pages/RecommendBusiness.module.scss';
import { Modal, SSRProvider } from 'react-bootstrap';
import { BusinessProps } from '../../features/components/business-results/Business';
import PageSuccess from '../../features/components/shared/success/PageSuccess';

interface Props {
  // status: 'SUCCESS' | 'FAIL' | 'ERROR';
  session: Session;
  reviews: { data: ReviewProps[] } | undefined;
  currentUserReview: ReviewProps | null;
  error?: string;
}

const RecommendBusinessPage: NextPage<Props> = function (props: Props) {
  const [hasUserReviewedBefore, setHasReviewedBefore] = useState(!!props.currentUserReview);
  const [showAlert, setShowAlert] = useState(!!props.currentUserReview);

  const [reviews, setReviews] = useState<ReviewProps[]>([]);
  const currentUser = useSignedInUser();

  const { send: sendReviewRequest, loading: isSubmittingReview } = useRequest({
    autoStopLoading: false,
  });

  useEffect(() => {
    if (!props.reviews?.data.length) return;
    setReviews(props.reviews.data);
  }, [props?.reviews]);

  if (props.error) signOut({ redirect: false });

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
        <Spinner pageWide show={isSubmittingReview} />
        <Layout.Nav>
          {hasUserReviewedBefore && showAlert ? (
            <Alert
              variant="info"
              className="text-center fs-4 position-absolute w-100"
              dismissible
              onClose={setShowAlert.bind(null, false)}
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

              <NewReviewForm
                {...{ businessName, location, businessId }}
                userRecommends={userRecommendYes}
                readonly={hasUserReviewedBefore as boolean}
                userReview={props.currentUserReview}
                sendReviewRequest={sendReviewRequest}
                submitting={isSubmittingReview}
              />
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

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
  const session = await unstable_getServerSession(req, res, authOptions as NextAuthOptions);
  if (!session) return { redirect: { destination: '/?authError=true', permanent: false } };

  const slug = params!.reviewPageSlug as string;
  const [businessName, location, businessId] = slug.split('_');

  const business = (await api.getBusinessById(businessId)) as {
    data: Partial<BusinessProps>;
  };
  // console.log(business.data.businessName?.toLowerCase().split(' ').join('-'), businessName);
  // console.log(
  //   [business?.data?.city, business?.data?.stateCode].join('-').toLowerCase(),
  //   '->',
  //   location.toLowerCase(),
  // );
  if (
    !business?.data?._id ||
    business.data.businessName?.toLowerCase().split(' ').join('-') !== businessName ||
    [business?.data?.city, business?.data?.stateCode].join('-').toLowerCase() !==
      location.toLowerCase()
  )
    return { notFound: true };

  const responses = await Promise.allSettled([
    api.getUserReviewOnBusiness(businessId, session.user._id),
    api.getBusinessReviews(businessId),
  ]);

  console.log({ responses });

  const [userReviewResponse, reviewsResponse] = responses
    .filter(res => res.status === 'fulfilled' && res.value)
    .map(res => res.status === 'fulfilled' && res.value);

  if (reviewsResponse.msg === 'AUTH_ERROR' && !reviewsResponse.data)
    return { redirect: { destination: '/?authError=true', permanent: false } };

  return {
    props: {
      reviews: reviewsResponse,
      currentUserReview: userReviewResponse?.userReview,
      business,
    },
  };
};

export default RecommendBusinessPage;
