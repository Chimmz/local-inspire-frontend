import React, { useState } from 'react';
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

const BusinessListings: NextPage<Props> = function (props) {
  const router = useRouter();
  const [active, setActive] = useState<'reviews' | 'q&a' | 'advices'>('reviews');
  const { send: sendRequest, loading } = useRequest({ autoStopLoading: true });

  const linkToReviewPage = router.asPath.replace('/v/', '/write-a-review/');
  const pageDescription = `${props.business.data?.businessName || ''} - ${
    props.business.data?.stateCode
  } - ${props.reviews.total} reviews and ${props.questions.total} questions asked`;

  return (
    <SSRProvider>
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
              reviewImages={props.reviews.data?.map(rev => rev.images).flat()}
              slug={props.params.slug}
            />
            <div className={styles.left}>
              <section
                className={cls(styles.bookNow, 'd-flex', 'align-items-center', 'gap-4')}
              >
                <Icon icon="mdi:loudspeaker" width={30} color="#024180" />
                <h2 className="flex-grow-1 mt-2">Book with us now and save!</h2>
                <button className="btn btn-sec">Book now</button>
              </section>

              <section className={styles.overallRatings}>
                <h2>Overall Ratings</h2>
                Overall ratings will soon be here
                {/* <section className={styles.locationAndContact}>
          <h2>overall Ratings</h2>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat officiis sequi
          perspiciatis odio eveniet tenetur cumque qui veritatis accusamus? Eos recusandae
          sint incidunt sapiente itaque sunt nam suscipit? Alias, sapiente?
        </section>

        <section className={styles.featureRatings}>
          <h2>featureRatings</h2>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat officiis sequi
          perspiciatis odio eveniet tenetur cumque qui veritatis accusamus? Eos recusandae
          sint incidunt sapiente itaque sunt nam suscipit? Alias, sapiente?
        </section> */}
              </section>

              <section
                className={cls(
                  styles.doYouRecommend,
                  'd-flex align-items-center justify-content-between gap-3 flex-wrap',
                )}
              >
                <h2 className="flex-grow-1">Do you recommend {props.params.businessName}?</h2>
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
                  <h2 className="">Business Amenities</h2>
                  <Link href="/" passHref>
                    <a className="text-pry">
                      <strong>Improve this listing</strong>
                    </a>
                  </Link>
                </div>
                <BusinessAmenities />
              </section>

              <section className="d-flex flex-column p-0">
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
                  business={props.business.data}
                  slug={props.params.slug}
                  questionsCount={props.questions.total}
                  sendRequest={sendRequest}
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
    </SSRProvider>
  );
};

// export const getStaticPaths: GetStaticPaths = async function (context) {
//   return {
//     paths: [],
//     fallback: 'blocking',
//   };
// };

export const getServerSideProps: GetServerSideProps = async function (context) {
  const slug = context.params!.businessPageSlug as string;
  const [businessName, location, businessId] = slug.split('_');

  console.log({ businessName, location, businessId });

  const responses = await Promise.allSettled([
    api.getBusinessById(businessId),
    api.getBusinessReviews(businessId, undefined, { page: 1, limit: 3 }),
    api.getQuestionsAskedAboutBusiness(businessId, '?sort=-createdAt&', {
      page: 1,
      limit: 5,
    }),
    api.getTipsAboutBusiness(businessId, { page: 1, limit: 5 }),
  ]);

  console.log('Business page responses: ', responses);

  // Filter success responses
  const [business, reviews, questions, tips] = responses
    .filter(res => res.status === 'fulfilled' && res.value)
    .map(res => res.status === 'fulfilled' && res.value);

  const loc = location.split('-');
  return {
    props: {
      business: business || {},
      reviews: reviews || {},
      questions: questions || {},
      tips: tips || {},
      params: {
        businessName: toTitleCase(businessName.replace('-', ' ')),
        stateCode: loc.pop(),
        city: toTitleCase(loc.join(' ')),
        businessId,
        slug,
      },
    },
  };
};

export default BusinessListings;
