import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';

import { authOptions } from '../api/auth/[...nextauth]';

import { BusinessProps } from '../../features/components/business-results/Business';
import { ReviewProps } from '../../features/components/recommend-business/UserReview';
import { QuestionItemProps } from '../../features/components/business-listings/questions/QuestionItem';
import { TipProps } from '../../features/components/business-listings/tips/Tip';

import { useRouter } from 'next/router';

import api from '../../features/library/api';
import { toTitleCase } from '../../features/utils/string-utils';
import navigateTo, { genRecommendBusinessPageUrl } from '../../features/utils/url-utils';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import Layout from '../../features/components/layout';
import CategoriesNav from '../../features/components/business-results/CategoriesNav';
import Aside from '../../features/components/business-listings/Aside';
import Header from '../../features/components/business-listings/Header';
import Announcement from '../../features/components/business-listings/Announcement';
import ReviewsSection from '../../features/components/business-listings/review/ReviewsSection';
import QuestionsSection from '../../features/components/business-listings/questions/QuestionsSection';
import AdvicesSection from '../../features/components/business-listings/tips/AdvicesSection';

import FeaturedBusinesses from '../../features/components/business-results/FeaturedBusinesses';
import styles from '../../styles/sass/pages/BusinessListing.module.scss';

interface Props {
  business: { data: BusinessProps | undefined };
  questions: { results: number; status: 'SUCCESS' | 'FAIL'; data?: QuestionItemProps[] };
  reviews: { results: number; status: 'SUCCESS' | 'FAIL'; data?: ReviewProps[] };
  tips: { results: number; status: 'SUCCESS' | 'FAIL'; data?: TipProps[] };
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
  const [whatsActive, setWhatsActive] = useState<'reviews' | 'q&a' | 'advices'>('reviews');

  const linkToReviewPage = router.asPath.replace('/v/', '/write-a-review/');
  // const genUrlParams = [
  //   props.params.businessId, props.params.businessName,  props.params.city, props.params.stateCode
  // ]

  return (
    <Layout>
      <Layout.Nav>
        <CategoriesNav searchParams={{ category: 'Rest', ...props.params }} />
      </Layout.Nav>

      <Layout.Main className={styles.main}>
        <Header
          business={props.business.data}
          businessName={props.params.businessName}
          linkToReviewPage={linkToReviewPage}
          reviewsCount={props.reviews?.results}
        />
        <div className={styles.left}>
          <Announcement />
          <section className={cls(styles.bookNow, 'd-flex', 'align-items-center', 'gap-4')}>
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
              className="d-flex flex-column gap-3 align-items-center"
              onClick={setWhatsActive.bind(null, 'reviews')}
              data-active={whatsActive === 'reviews'}
            >
              <Icon icon="material-symbols:rate-review" width={30} />
              <strong>{props.reviews.data?.length} Reviews</strong>
            </button>
            <button
              className="d-flex flex-column gap-3 align-items-center"
              onClick={setWhatsActive.bind(null, 'q&a')}
              data-active={whatsActive === 'q&a'}
            >
              <Icon icon="jam:messages-f" width={30} />
              <strong>{props.questions.data?.length} Q&A</strong>
            </button>
            <button
              className="d-flex flex-column gap-3 align-items-center"
              onClick={setWhatsActive.bind(null, 'advices')}
              data-active={whatsActive === 'advices'}
            >
              <Icon icon="material-symbols:tips-and-updates" width={30} />
              <strong>{props.tips.data?.length} Tips</strong>
            </button>
          </nav>

          <ReviewsSection
            show={whatsActive === 'reviews'}
            reviews={props.reviews?.data}
            businessName={props.params.businessName}
            businessId={props.params.businessId}
          />
          <QuestionsSection
            show={whatsActive === 'q&a'}
            questions={props.questions.data}
            businessId={props.params.businessId}
            businessName={props.business.data?.businessName}
          />
          <AdvicesSection
            show={whatsActive === 'advices'}
            tips={props.tips?.data}
            slug={props.params.slug}
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
      </Layout.Main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async function (context) {
  const slug = context.params!.businessDetails as string;
  const [businessName, location, businessId] = slug.split('_');

  console.log({ businessName, location, businessId });

  const responses = await Promise.allSettled([
    api.getBusinessById(businessId),
    api.getBusinessReviews(businessId),
    api.getQuestionsAskedAboutBusiness(businessId),
    api.getTipsAboutBusiness(businessId),
  ]);

  console.log(responses);

  const [business, reviews, questions, tips] = responses
    .filter(res => res.status === 'fulfilled' && res.value)
    .map(res => res.status === 'fulfilled' && res.value);

  const loc = location.split('-');
  return {
    props: {
      business,
      reviews,
      questions,
      tips,
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
