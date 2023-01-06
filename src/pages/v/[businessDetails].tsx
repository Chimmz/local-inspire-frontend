import React, { useState } from 'react';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import Layout from '../../features/components/layout';
import StarRating from '../../features/components/shared/star-rating/StarRating';
import styles from '../../styles/sass/pages/BusinessListing.module.scss';
import Image from 'next/image';
import CategoriesNav from '../../features/components/business-results/CategoriesNav';
import Link from 'next/link';
import TextInput from '../../features/components/shared/text-input/TextInput';
import { Form } from 'react-bootstrap';
import Aside from '../../features/components/business-listings/Aside';
import Header from '../../features/components/business-listings/Header';
import Announcement from '../../features/components/business-listings/Announcement';
import LabelledCheckbox from '../../features/components/shared/LabelledCheckbox';
import BusinessReviews from '../../features/components/business-listings/Reviews';
import QuestionsSection from '../../features/components/business-listings/Questions';
import FeaturedBusinesses from '../../features/components/business-results/FeaturedBusinesses';
import AdvicesSection from '../../features/components/business-listings/AdvicesSection';

function BusinessListings() {
  const [whatsActive, setWhatsActive] = useState<'reviews' | 'q&a' | 'advices'>(
    'reviews',
  );

  return (
    <Layout>
      <Layout.Nav>
        <CategoriesNav
          searchParams={{ category: 'Rest', city: 'Anchor', stateCode: 'AK' }}
        />
      </Layout.Nav>
      <Layout.Main className={styles.main}>
        <Header />
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
              'd-flex',
              'align-items-center',
              'justify-content-between',
            )}
          >
            <h2 className="flex-grow-1">Do you recommend Fannies BBQ?</h2>
            <button className="btn btn-outline-pry btn--sm flex-grow-1 text-center d-flex justify-content-center">
              Yes
            </button>
            <button className="btn btn-outline-pry btn--sm flex-grow-1 text-center d-flex justify-content-center">
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
              <strong>Reviews</strong>
            </button>
            <button
              className="d-flex flex-column gap-3 align-items-center"
              onClick={setWhatsActive.bind(null, 'q&a')}
              data-active={whatsActive === 'q&a'}
            >
              <Icon icon="jam:messages-f" width={30} />
              <strong>Q&A</strong>
            </button>
            <button
              className="d-flex flex-column gap-3 align-items-center"
              onClick={setWhatsActive.bind(null, 'advices')}
              data-active={whatsActive === 'advices'}
            >
              <Icon icon="material-symbols:tips-and-updates" width={30} />
              <strong>Tips</strong>
            </button>
          </nav>

          <BusinessReviews show={whatsActive === 'reviews'} />
          <QuestionsSection show={whatsActive === 'q&a'} />
          <AdvicesSection show={whatsActive === 'advices'} />
        </div>

        <Aside />

        <FeaturedBusinesses
          className={styles.similarBusinesses}
          groupName="Similar Businesses"
          businesses={[
            {
              _id: (Math.random() + Math.random()).toString(),
              businessName: 'Chicken Express',
              SIC8: 'Chicken Restaurants Restaurants Restaurants & Bars',
              SIC2: 'Chicken Restaurants Restaurants Restaurants & Bars',
              SIC4: 'Chicken Restaurants Restaurants Restaurants & Bars',
              rating: 3,
            },
            {
              _id: (Math.random() + Math.random()).toString(),
              businessName: 'Chicken Express',
              SIC8: 'Chicken Restaurants Restaurants Restaurants & Bars',
              SIC2: 'Chicken Restaurants Restaurants Restaurants & Bars',
              SIC4: 'Chicken Restaurants Restaurants Restaurants & Bars',
              rating: 3,
            },
            {
              _id: (Math.random() + Math.random()).toString(),
              businessName: 'Chicken Express',
              SIC8: 'Chicken Restaurants Restaurants Restaurants & Bars',
              SIC2: 'Chicken Restaurants Restaurants Restaurants & Bars',
              SIC4: 'Chicken Restaurants Restaurants Restaurants & Bars',
              rating: 3,
            },
            {
              _id: (Math.random() + Math.random()).toString(),
              businessName: 'Chicken Express',
              SIC8: 'Chicken Restaurants Restaurants Restaurants & Bars',
              SIC2: 'Chicken Restaurants Restaurants Restaurants & Bars',
              SIC4: 'Chicken Restaurants Restaurants Restaurants & Bars',
              rating: 3,
            },
          ]}
        />
      </Layout.Main>
    </Layout>
  );
}

export default BusinessListings;
