import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { unstable_getServerSession, NextAuthOptions, Session } from 'next-auth';
import Link from 'next/link';

import { authOptions } from '../api/auth/[...nextauth]';
import Layout from '../../features/components/layout';
import styles from '../../styles/sass/pages/RecommendBusiness.module.scss';
import cls from 'classnames';
import Review, {
  ReviewProps,
} from '../../features/components/recommend-business/UserReview';
import StarRating from '../../features/components/shared/star-rating/StarRating';
import TextInput from '../../features/components/shared/text-input/TextInput';
import NewReviewForm from '../../features/components/recommend-business/NewReviewForm';
import useInput from '../../features/hooks/useInput';
import Radio from '../../features/components/shared/radio/Radio';
import { isRequired } from '../../features/utils/validators/inputValidators';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { toTitleCase } from '../../features/utils/string-utils';
import useSignedInUser from '../../features/hooks/useSignedInUser';
import api from '../../features/library/api';
import useRequest from '../../features/hooks/useRequest';
import Spinner from '../../features/components/shared/spinner/Spinner';
import { useState } from 'react';

interface Props {
  // status: 'SUCCESS' | 'FAIL' | 'ERROR';
  session: Session;
  reviews: ReviewProps[];
}

const RecommendBusinessPage: NextPage<Props> = function (props: Props) {
  const [reviews, setReviews] = useState(props.reviews);
  const currentUser = useSignedInUser();

  const { send: sendReviewRequest, loading: isSubmittingReview } = useRequest({
    autoStopLoading: true,
  });
  const router = useRouter();

  const userRecommendYes = router.query.recommend === 'yes';
  const userIsNeutral = !router.query.recommend;
  const [businessName, location, businessId] = (
    router.query.businessInfo as string
  ).split('_');

  console.log({ businessName, location, businessId });

  const refreshReviews = async () => {
    const data = await api.getBusinessReviews(businessId, currentUser.accessToken!);
    if (data.status === 'SUCCESS') setReviews(data.reviews);
  };

  return (
    <Layout>
      <Spinner pageWide show={isSubmittingReview} />
      <Layout.Nav
        defaultCategorySuggestions={[
          'Hotels and motels',
          'Restaurants',
          'Cabins Rentals',
          'Vacation Rentals',
          'Things to do',
          'Cruises',
        ]}
      />
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
            sendReviewRequest={sendReviewRequest}
            refreshReviews={refreshReviews}
          />
        </div>

        <aside className={styles.recentReviews}>
          <h3 className="mb-4">Recent Reviews</h3>
          {!!reviews.length ? (
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
  console.log({ session });

  if (!session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };

  const businessId = (params!.businessInfo as string).split('_').slice(-1).pop()!;
  console.log({ businessId });

  const data = await api.getBusinessReviews(businessId, session.user.accessToken);
  console.log(data);
  return {
    props: { reviews: data.reviews, session },
  };
};

export default RecommendBusinessPage;
