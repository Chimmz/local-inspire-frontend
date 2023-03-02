import React, { useState, useEffect } from 'react';
import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next';
// Types
import { BusinessProps } from '../../features/components/business-results/Business';
import { ReviewProps } from '../../features/components/page-reviews/UserReview';
import { QuestionItemProps } from '../../features/components/business-listings/questions/QuestionItem';
import { TipProps } from '../../features/components/business-listings/tips/Tip';
// Hooks
import { useRouter } from 'next/router';
import useRequest from '../../features/hooks/useRequest';
// Utils
import api from '../../features/library/api';
import { toTitleCase } from '../../features/utils/string-utils';
import navigateTo from '../../features/utils/url-utils';
import cls from 'classnames';
// Components
import { Icon } from '@iconify/react';
import { SSRProvider } from 'react-bootstrap';
import Layout from '../../features/components/layout';
import CategoriesNav from '../../features/components/layout/navbar/CategoriesNav';
import Aside from '../../features/components/business-listings/Aside';
import Header from '../../features/components/business-listings/Header';
import ReviewsSection from '../../features/components/business-listings/reviews/ReviewsSection';
import QuestionsSection from '../../features/components/business-listings/questions/QuestionsSection';
import AdvicesSection from '../../features/components/business-listings/tips/AdvicesSection';
import FeaturedBusinesses from '../../features/components/business-results/FeaturedBusinesses';
import Spinner from '../../features/components/shared/spinner/Spinner';
import styles from '../../styles/sass/pages/BusinessPage.module.scss';
import Head from 'next/head';
import Link from 'next/link';
import BusinessAmenities from '../../features/components/business-listings/business-amenities/BusinessAmenities';
import { createContext } from 'vm';
import {
  BusinessPageContextProvider,
  useBusinessPageContext,
} from '../../features/contexts/BusinessPageContext';
import RatingStats from '../../features/components/business-listings/overall-rating/RatingStats';
import { NextAuthOptions, unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { UserCollection } from '../../features/types';

interface Props {
  reviews: {
    status: 'SUCCESS' | 'FAIL';
    data?: ReviewProps[];
    results: number;
    total: number;
  };
  questions: {
    results: number;
    status: 'SUCCESS' | 'FAIL';
    data?: QuestionItemProps[];
    total: number;
  };
  tips: {
    total: number;
    status: 'SUCCESS' | 'FAIL';
    data?: TipProps[];
  };
  businessReviewStats: {
    overallFeatureRatings?: { _id: string; avgRating: number }[];
    recommendsStats?: {
      recommends: number;
      doesNotRecommend: number;
    };
  };
  userCollections?: UserCollection[];
  userReview?: ReviewProps;

  business: {
    data: BusinessProps | undefined;
  };
  params: {
    businessName: string;
    city: string;
    stateCode: string;
    businessId: string;
    slug: string;
  };
}

const BusinessPage: NextPage<Props> = function (props) {
  const router = useRouter();
  const [active, setActive] = useState<'reviews' | 'q&a' | 'advices'>('reviews');
  const { send: sendRequest, loading } = useRequest({ autoStopLoading: true });

  const linkToReviewPage = router.asPath.replace('/v/', '/write-a-review/');

  const pageDescription = `${props.business.data?.businessName || ''} - ${
    props.business.data?.city || ''
  }, ${props.business.data?.stateCode} - ${props.reviews.total} reviews and ${
    props.questions.total
  } questions asked`;

  return (
    <SSRProvider>
      <BusinessPageContextProvider>
        <Head>
          <title>{pageDescription}</title>
          <meta name="description" content={pageDescription} />
        </Head>
        <Layout>
          <Spinner pageWide show={loading} />
          <Layout.Nav>
            <CategoriesNav searchParams={{ category: 'Rest', ...props.params }} />
          </Layout.Nav>

          <Layout.Main className={styles.main}>
            <div className={cls(styles.container, 'container')}>
              <Header
                business={props.business.data}
                businessName={props.params.businessName}
                reviewsCount={props.reviews?.total}
                userReview={props.userReview}
                userCollections={props.userCollections}
                slug={props.params.slug}
                pageDescription={pageDescription}
              />
              <div className={styles.left}>
                <section
                  className={cls(styles.bookNow, 'd-flex', 'align-items-center', 'gap-4')}
                >
                  <Icon icon="mdi:loudspeaker" width={30} color="#024180" />
                  <h2 className="flex-grow-1 mt-2">Book with us now and save!</h2>
                  <button className="btn btn-sec">Book now</button>
                </section>

                <RatingStats
                  business={props.business.data}
                  overallFeatureRatings={props.businessReviewStats.overallFeatureRatings!}
                  recommendationStats={props.businessReviewStats.recommendsStats}
                  reviewsCount={props.reviews.total}
                />

                <section
                  className={cls(
                    styles.doYouRecommend,
                    'd-flex align-items-center justify-content-between gap-3 flex-wrap',
                  )}
                >
                  <h2 className="flex-grow-1">
                    Do you recommend {props.params.businessName}?
                  </h2>
                  <button
                    className="btn btn-outline-pry btn--sm flex-grow-1 text-center d-flex justify-content-center"
                    onClick={navigateTo.bind(
                      null,
                      linkToReviewPage.concat('?recommend=yes'),
                      router,
                    )}
                  >
                    Yes
                  </button>
                  <button
                    className="btn btn-outline-pry btn--sm flex-grow-1 text-center d-flex justify-content-center"
                    onClick={navigateTo.bind(
                      null,
                      linkToReviewPage.concat('?recommend=no'),
                      router,
                    )}
                  >
                    No
                  </button>
                </section>

                <section className={styles.businessAmenities}>
                  <div className="d-flex align-items-center justify-content-between pb-3 border-bottom">
                    <h2 className="">About</h2>
                    <Link href="/" passHref>
                      <a className="text-pry">
                        <strong>Improve this listing</strong>
                      </a>
                    </Link>
                  </div>
                  <BusinessAmenities />
                </section>

                <section
                  className="d-flex flex-column p-0"
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                >
                  <nav
                    className={cls(
                      styles.nav,
                      'd-flex align-items-center justify-content-between flex-wrap',
                    )}
                  >
                    <button
                      className="d-flex flex-column gap-3 align-items-center cursor-pointer"
                      onClick={setActive.bind(null, 'reviews')}
                      data-active={active === 'reviews'}
                    >
                      <Icon icon="material-symbols:rate-review-outline" width={30} />
                      <strong>{props.reviews.total || ''} Reviews</strong>
                    </button>
                    <button
                      className="d-flex flex-column gap-3 align-items-center cursor-pointer"
                      onClick={setActive.bind(null, 'q&a')}
                      data-active={active === 'q&a'}
                    >
                      <Icon icon="bx:chat" width={30} />
                      <strong>{props.questions.total} Q&A</strong>
                    </button>
                    <button
                      className="d-flex flex-column gap-3 align-items-center cursor-pointer"
                      onClick={setActive.bind(null, 'advices')}
                      data-active={active === 'advices'}
                    >
                      <Icon icon="material-symbols:tips-and-updates-outline" width={30} />
                      <strong>{props.tips.total || ''} Tips</strong>
                    </button>
                  </nav>

                  <ReviewsSection
                    show={active === 'reviews'}
                    reviews={props.reviews?.data}
                    totalReviewsCount={props.reviews?.total}
                    businessName={props.params.businessName}
                    businessId={props.params.businessId}
                    business={props.business.data}
                    sendRequest={sendRequest}
                    loading={loading}
                  />

                  <QuestionsSection
                    show={active === 'q&a'}
                    questions={props.questions.data}
                    questionsCount={props.questions.total}
                    sendRequest={sendRequest}
                    business={props.business.data}
                    slug={props.params.slug}
                    loading={loading}
                  />

                  <AdvicesSection
                    show={active === 'advices'}
                    tips={props.tips?.data}
                    tipsTotal={props.tips?.total}
                    slug={props.params.slug}
                    business={props.business.data!}
                    businessName={props.business.data?.businessName}
                    businessId={props.business.data?._id}
                    sendRequest={sendRequest}
                    loading={loading}
                  />
                </section>
              </div>

              <Aside business={props.business.data} />

              <FeaturedBusinesses
                className={styles.similarBusinesses}
                groupName="Similar Businesses you may like"
                businesses={[
                  {
                    _id: (Math.random() + Math.random()).toString(),
                    businessName: 'Chicken Express',
                    SIC8: 'Chicken Restaurants Restaurants Restaurants & Bars',
                    SIC2: 'Chicken Restaurants Restaurants Restaurants & Bars',
                    SIC4: 'Chicken Restaurants Restaurants Restaurants & Bars',
                    city: props.params.city,
                    stateCode: props.params.stateCode,
                    avgRating: 3,
                  },
                  {
                    _id: (Math.random() + Math.random()).toString(),
                    businessName: 'Chicken Express',
                    SIC8: 'Chicken Restaurants Restaurants Restaurants & Bars',
                    SIC2: 'Chicken Restaurants Restaurants Restaurants & Bars',
                    SIC4: 'Chicken Restaurants Restaurants Restaurants & Bars',
                    city: props.params.city,
                    stateCode: props.params.stateCode,
                    avgRating: 3,
                  },
                  {
                    _id: (Math.random() + Math.random()).toString(),
                    businessName: 'Chicken Express',
                    SIC8: 'Chicken Restaurants Restaurants Restaurants & Bars',
                    SIC2: 'Chicken Restaurants Restaurants Restaurants & Bars',
                    SIC4: 'Chicken Restaurants Restaurants Restaurants & Bars',
                    city: props.params.city,
                    stateCode: props.params.stateCode,
                    avgRating: 3,
                  },
                  {
                    _id: (Math.random() + Math.random()).toString(),
                    businessName: 'Chicken Express',
                    SIC8: 'Chicken Restaurants Restaurants Restaurants & Bars',
                    SIC2: 'Chicken Restaurants Restaurants Restaurants & Bars',
                    SIC4: 'Chicken Restaurants Restaurants Restaurants & Bars',
                    city: props.params.city,
                    stateCode: props.params.stateCode,
                    avgRating: 3,
                  },
                ]}
              />
            </div>
          </Layout.Main>
        </Layout>
      </BusinessPageContextProvider>
    </SSRProvider>
  );
};

export const getStaticProps: GetStaticProps = async function (context) {
  const slug = context.params!.businessPageSlug as string;
  const [businessName, location, businessId] = slug.split('_');
  console.log({ businessName, location, businessId });

  const reqs = [
    api.getBusinessById(businessId),
    api.getBusinessReviews(businessId, '?sort=-createdAt', { page: 1, limit: 3 }),
    api.getQuestionsAskedAboutBusiness(businessId, '?sort=-createdAt&', {
      page: 1,
      limit: 5,
    }),
    api.getTipsAboutBusiness(businessId, { page: 1, limit: 5 }),
    api.getBusinessOverallRating(businessId),
  ];
  const responses = await Promise.allSettled(reqs);
  // console.log('Business page responses: ', responses);
  console.log('getUserReviewOnBusiness response: ', responses[6]);

  const [business, reviews, questions, tips, businessReviewStats] = responses
    .filter(res => res.status === 'fulfilled' && res.value)
    .map(res => res.status === 'fulfilled' && res.value);

  // if (!business?.businessName ) return { notFound: true };

  const loc = location.split('-');
  const props: any = {
    business: business || {},
    reviews: reviews || {},
    questions: questions || {},
    tips: tips || {},
    businessReviewStats: businessReviewStats || {},

    params: {
      businessName: toTitleCase(businessName.replace('-', ' ')),
      stateCode: loc.pop(),
      city: toTitleCase(loc.join(' ')),
      businessId,
      slug,
    },
  };

  return { props };
};

export const getStaticPaths: GetStaticPaths = context => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

// export const getServerSideProps: GetServerSideProps = async function (context) {
//   const slug = context.params!.businessPageSlug as string;
//   const [businessName, location, businessId] = slug.split('_');
//   console.log({ businessName, location, businessId });

//   const reqs = [
//     api.getBusinessById(businessId), // 0
//     api.getBusinessReviews(businessId, '?sort=-createdAt', { page: 1, limit: 3 }), // 1
//     api.getQuestionsAskedAboutBusiness(businessId, '?sort=-createdAt&', {
//       // 2
//       page: 1,
//       limit: 5,
//     }),
//     api.getTipsAboutBusiness(businessId, { page: 1, limit: 5 }), // 3
//     api.getBusinessOverallRating(businessId), // 4
//   ];

//   const session = await unstable_getServerSession(
//     context.req,
//     context.res,
//     authOptions as NextAuthOptions,
//   );

//   if (session)
//     reqs.push(
//       api.getUserCollections(session.user.accessToken), // 5
//       api.getUserReviewOnBusiness(businessId, session.user.accessToken), // 6
//     );

//   const responses = await Promise.allSettled(reqs);
//   // console.log('Business page responses: ', responses);
//   console.log('getUserReviewOnBusiness response: ', responses[6]);

//   const [business, reviews, questions, tips, businessReviewStats] = responses
//     .filter(res => res.status === 'fulfilled' && res.value)
//     .map(res => res.status === 'fulfilled' && res.value);

//   // if (!business?.businessName ) return { notFound: true };

//   const collectionsResponse = responses[5] as { status: string; value: { collections: [] } };
//   const userReviewResponse = responses[6] as {
//     status: string;
//     value: { review: ReviewProps };
//   };

//   const loc = location.split('-');
//   const props: any = {
//     business: business || {},
//     reviews: reviews || {},
//     questions: questions || {},
//     tips: tips || {},
//     businessReviewStats: businessReviewStats || {},

//     params: {
//       businessName: toTitleCase(businessName.replace('-', ' ')),
//       stateCode: loc.pop(),
//       city: toTitleCase(loc.join(' ')),
//       businessId,
//       slug,
//     },
//   };

//   if (collectionsResponse?.value?.collections) {
//     props.userCollections = collectionsResponse?.value.collections;
//   }
//   if (userReviewResponse?.value?.review) props.userReview = userReviewResponse.value.review;

//   return { props };
// };

export default BusinessPage;
