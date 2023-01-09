import { useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession, NextAuthOptions, Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { authOptions } from '../api/auth/[...nextauth]';

// Types
import Review, {
  ReviewProps,
} from '../../features/components/recommend-business/UserReview';

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

interface Props {
  // status: 'SUCCESS' | 'FAIL' | 'ERROR';
  session: Session;
  reviews?: { data: ReviewProps[] };
  error?: string;
}

const RecommendBusinessPage: NextPage<Props> = function (props: Props) {
  console.log({ props: props });
  const [reviews, setReviews] = useState<ReviewProps[]>([]);
  const [hasCurrentUserReviewedBefore, setHasCurrentUserReviewedBefore] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const currentUser = useSignedInUser();
  const { send: sendReviewRequest, loading: isSubmittingReview } = useRequest({
    autoStopLoading: false,
  });

  useEffect(() => {
    if (!props.reviews?.data.length) return;
    setReviews(props.reviews.data);

    const bool = props.reviews?.data.some(r => r.reviewedBy?._id === currentUser._id);
    setHasCurrentUserReviewedBefore(bool);
    setShowAlert(bool);
  }, [props?.reviews]);

  if (props.error) signOut({ redirect: false });

  const router = useRouter();

  const userRecommendYes = router.query.recommend === 'yes';
  const userIsNeutral = !router.query.recommend;
  const [businessName, location, businessId] = (
    router.query.businessInfo as string
  ).split('_');

  console.log({ businessName, location, businessId });

  const refreshReviews = useCallback(async () => {
    const data = await api.getBusinessReviews(businessId, currentUser.accessToken!);
    if (data.status === 'SUCCESS') setReviews(data.reviews);
  }, [setReviews, api.getBusinessReviews]);

  return (
    <Layout>
      <Spinner pageWide show={isSubmittingReview} />
      <Layout.Nav>
        {hasCurrentUserReviewedBefore && showAlert ? (
          <Alert
            variant="info"
            className="text-center fs-3 position-absolute w-100"
            dismissible
            onClose={setShowAlert.bind(null, false)}
          >
            You have previously reviewed {toTitleCase(businessName, '-')}
          </Alert>
        ) : null}
      </Layout.Nav>
      <Layout.Main className={styles.main}>
        <div className={styles.newReview}>
          <h1 className={cls('u-page-main-heading mb-5')}>
            Write a review for {toTitleCase(businessName, '-')}
          </h1>

          {userIsNeutral ? (
            <section className={styles.wouldYouRecommend}>
              <strong className="me-auto fs-3">Do you recommend Chicken Express?</strong>
              <Link href={`/write-a-review/${router.query.businessInfo}?recommend=yes`}>
                <span className="btn btn-outline">Yes</span>
              </Link>
              <Link href={`/write-a-review/${router.query.businessInfo}?recommend=no`}>
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
            readonly={hasCurrentUserReviewedBefore as boolean}
            sendReviewRequest={sendReviewRequest}
            submitting={isSubmittingReview}
            refreshReviews={refreshReviews}
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
      </Layout.Main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
  const session = await unstable_getServerSession(
    req,
    res,
    authOptions as NextAuthOptions,
  );
  console.log({ url: req.url });
  if (!session)
    // return { props: { error: 'AUTH_ERROR' } };
    return { redirect: { destination: '/?authError=true', permanent: false } };

  const slug = params!.businessInfo as string;
  const businessId = slug.split('_').slice(-1).pop()!;

  const response = await api.getBusinessReviews(businessId, session.user.accessToken);
  console.log({ reviews: response.reviews });

  if (response.msg === 'AUTH_ERROR' && !response.data)
    // return { props: { error: 'AUTH_ERROR' } };
    return { redirect: { destination: '/?authError=true', permanent: false } };

  return {
    props: { reviews: response || [], session },
  };
};

export default RecommendBusinessPage;
