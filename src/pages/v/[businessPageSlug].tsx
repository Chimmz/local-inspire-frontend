import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';

import { BusinessProps } from '../../features/components/business-results/Business';
import { ReviewProps } from '../../features/components/recommend-business/UserReview';
import { QuestionItemProps } from '../../features/components/business-listings/questions/QuestionItem';
import { TipProps } from '../../features/components/business-listings/tips/Tip';

import { useRouter } from 'next/router';
import useRequest from '../../features/hooks/useRequest';

import api from '../../features/library/api';
import { toTitleCase } from '../../features/utils/string-utils';
import navigateTo from '../../features/utils/url-utils';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import { SSRProvider } from 'react-bootstrap';
import Layout from '../../features/components/layout';
import CategoriesNav from '../../features/components/business-results/CategoriesNav';
import Aside from '../../features/components/business-listings/Aside';
import Header from '../../features/components/business-listings/Header';
import Announcement from '../../features/components/business-listings/Announcement';
import ReviewsSection from '../../features/components/business-listings/reviews/ReviewsSection';
import QuestionsSection from '../../features/components/business-listings/questions/QuestionsSection';
import AdvicesSection from '../../features/components/business-listings/tips/AdvicesSection';
import FeaturedBusinesses from '../../features/components/business-results/FeaturedBusinesses';
import Spinner from '../../features/components/shared/spinner/Spinner';
import styles from '../../styles/sass/pages/BusinessPage.module.scss';

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

  return (
    <SSRProvider>
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
              reviewsCount={props.reviews?.results}
              reviewImages={props.reviews.data?.map(rev => rev.images).flat()}
              slug={props.params.slug}
            />
            <div className={styles.left}>
              <Announcement />
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
                <h2>business Amenities</h2>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui quos fugit nam
              </section>

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
                  <Icon icon="material-symbols:rate-review" width={30} />
                  <strong>{props.reviews.total || ''} Reviews</strong>
                </button>
                <button
                  className="d-flex flex-column gap-3 align-items-center cursor-pointer"
                  onClick={setActive.bind(null, 'q&a')}
                  data-active={active === 'q&a'}
                >
                  <Icon icon="jam:messages-f" width={30} />
                  <strong>{props.questions.total} Q&A</strong>
                </button>
                <button
                  className="d-flex flex-column gap-3 align-items-center cursor-pointer"
                  onClick={setActive.bind(null, 'advices')}
                  data-active={active === 'advices'}
                >
                  <Icon icon="material-symbols:tips-and-updates" width={30} />
                  <strong>{props.tips.total || ''} Tips</strong>
                </button>
              </nav>

              <ReviewsSection
                show={active === 'reviews'}
                reviews={props.reviews?.data}
                totalReviewsCount={props.reviews?.total}
                businessName={props.params.businessName}
                businessId={props.params.businessId}
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
                businessName={props.business.data?.businessName}
                businessId={props.business.data?._id}
                sendRequest={sendRequest}
                loading={loading}
              />
            </div>

            <Aside />

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
                  rating: 3,
                },
                {
                  _id: (Math.random() + Math.random()).toString(),
                  businessName: 'Chicken Express',
                  SIC8: 'Chicken Restaurants Restaurants Restaurants & Bars',
                  SIC2: 'Chicken Restaurants Restaurants Restaurants & Bars',
                  SIC4: 'Chicken Restaurants Restaurants Restaurants & Bars',
                  city: props.params.city,
                  stateCode: props.params.stateCode,
                  rating: 3,
                },
                {
                  _id: (Math.random() + Math.random()).toString(),
                  businessName: 'Chicken Express',
                  SIC8: 'Chicken Restaurants Restaurants Restaurants & Bars',
                  SIC2: 'Chicken Restaurants Restaurants Restaurants & Bars',
                  SIC4: 'Chicken Restaurants Restaurants Restaurants & Bars',
                  city: props.params.city,
                  stateCode: props.params.stateCode,
                  rating: 3,
                },
                {
                  _id: (Math.random() + Math.random()).toString(),
                  businessName: 'Chicken Express',
                  SIC8: 'Chicken Restaurants Restaurants Restaurants & Bars',
                  SIC2: 'Chicken Restaurants Restaurants Restaurants & Bars',
                  SIC4: 'Chicken Restaurants Restaurants Restaurants & Bars',
                  city: props.params.city,
                  stateCode: props.params.stateCode,
                  rating: 3,
                },
              ]}
            />
          </div>
        </Layout.Main>
      </Layout>
    </SSRProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async function (context) {
  const slug = context.params!.businessPageSlug as string;
  const [businessName, location, businessId] = slug.split('_');

  console.log({ businessName, location, businessId });

  const responses = await Promise.allSettled([
    api.getBusinessById(businessId),
    api.getBusinessReviews(businessId, undefined, { page: 1, limit: 3 }),
    api.getQuestionsAskedAboutBusiness(businessId, undefined, { page: 1, limit: 5 }),
    api.getTipsAboutBusiness(businessId, { page: 1, limit: 5 }),
  ]);

  console.log('Review response: ', responses[1]);

  // console.log(responses);

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
