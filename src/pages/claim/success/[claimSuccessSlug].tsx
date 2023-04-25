import cls from 'classnames';
import { GetServerSideProps, NextPage } from 'next';
import React, { useState, useMemo } from 'react';
import Layout from '../../../features/components/layout';
import { SSRProvider } from 'react-bootstrap';
import claimPricingPlanSvg from '../../../../public/svg/claim-pricing-plan.svg';
import Image from 'next/image';
import RadioOptions from '../../../features/components/shared/radio/RadioOptions';
import api from '../../../features/library/api';
import { NextAuthOptions, unstable_getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';
import { BusinessClaim } from '../../../features/types';

import styles from '../../../styles/sass/pages/claimBusinessSuccessPage.module.scss';
import Link from 'next/link';
import { genClaimBusinessCheckoutPageUrl } from '../../../features/utils/url-utils';
import { toTitleCase } from '../../../features/utils/string-utils';

interface Props {
  status: 'SUCCESS' | 'FAIL' | 'ERROR';
  claim: BusinessClaim | undefined;
  pageSlug: string;
}

const ClaimSuccessPage: NextPage<Props> = function (props) {
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'yearly'>('monthly');
  const [prices, setPrices] = useState({
    monthly: { sponsored: 59.99, ehanced: 199.99 },
    yearly: { sponsored: 199.99, ehanced: 399.99 },
  });

  const getCheckoutUrl = (
    packageName: 'sponsored_business_listing' | 'ehanced_business_profile',
  ) => {
    return genClaimBusinessCheckoutPageUrl<string>(
      { slug: props.pageSlug },
      { package: packageName, duration: selectedDuration.toLowerCase() as 'monthly' | 'yearly' },
    );
  };

  const selectedPrices = useMemo(() => prices[selectedDuration], [prices, selectedDuration]);

  return (
    <SSRProvider>
      <Layout>
        <Layout.Nav withKeywordsNav={false} />
        <Layout.Main className={cls(styles.main, 'bg-light py-5')}>
          <div className={cls(styles.container, 'container d-flex flex-column')}>
            <h1
              className="mx-auto text-center parag mb-5"
              style={{ maxWidth: '50ch', lineHeight: '1.5em' }}
            >
              Thank you, {props.claim?.user.firstName} for successfully claiming your free
              business account for {props.claim?.business.businessName}!
            </h1>
            <p
              className="parag mx-auto text-light border bg-white rounded-1 p-3 px-4 mt-5"
              style={{
                maxWidth: '100ch',
                marginBottom: '10rem',
                display: props.claim?.pricingPlan === 'FREE' ? 'block' : '',
              }}
            >
              You currently have the <span className="text-black">free</span> plan. Upgrade to
              localinspire&apos;s{' '}
              <span className="text-black">Enhanced Business Profile plan</span> which provides
              all of localinspire&apos;s free tools plus our upgraded business features and tools
              to help you manage your business page, connect with your customers, and so much
              more. Start today and grow your business to a whole new level.
            </p>

            <section className={cls(styles.pricingSection, 'd-flex gap-5')}>
              <article>
                <small className="d-block text-uppercase mb-5">Pricing plans</small>
                <h2 className="mb-3">Upgrade {props.claim?.business.businessName}</h2>
                <p className="parag mb-5" style={{ maxWidth: '50ch' }}>
                  Attract more customers with our upgraded features. Choose the most suitable
                  service for your needs with our reasonable prices.
                </p>

                <RadioOptions
                  as="btn"
                  name="duration"
                  options={['monthly', 'yearly'].map(p => ({ label: toTitleCase(p), value: p }))}
                  value={selectedDuration}
                  onChange={ev => setSelectedDuration(ev.target.value as 'monthly' | 'yearly')}
                  className="w-max-content gap-0"
                  optionClassName="rounded-0 px-5"
                />
              </article>

              <ul className={cls(styles.plans, 'd-flex align-items-center no-bullets gap-4')}>
                <li className={cls(styles.plan, 'bg-white rounded-2 overflow-hidden')}>
                  <header className="p-5 position-relative">
                    <h4 className="text-uppercase">Sponsored Business Listing</h4>
                    <div className={cls(styles.price)}>
                      <small className="fs-3">$</small>{' '}
                      <strong>{selectedPrices.sponsored}</strong>
                      <small>/month</small>
                    </div>
                    {/* <figure
                      className="position-absolute"
                      style={{
                        width: '100%',
                        height: 100,
                        position: 'relative',
                        transform: 'rotate(7deg) translateX(-4rem)',
                        bottom: '-40px',
                        zIndex: '3',
                        // top: '90%',
                      }}
                    >
                      <Image src={claimPricingPlanSvg} layout="fill" />
                    </figure> */}
                  </header>

                  <div className={cls(styles.planBody, 'px-5 py-4 mb-4')}>
                    <span className="d-block text-black mb-4">
                      Your featured ad will appear on:
                    </span>
                    <ul className={cls(styles.planFeatures, 'no-bullets mb-5')}>
                      <li>
                        <small> Home page for your city</small>
                      </li>
                      <li>
                        <small> Search results pages in your city</small>
                      </li>
                      <li>
                        <small> Competitors pages in your city</small>
                      </li>
                      <li>
                        <small> Members area in your city</small>
                      </li>
                    </ul>
                    <Link href={getCheckoutUrl('sponsored_business_listing')} passHref>
                      <a className="btn btn-pry btn--lg">Get the Sponsored Business Listing</a>
                    </Link>
                  </div>
                </li>

                <li className={cls(styles.plan, 'bg-white rounded-2 overflow-hidden')}>
                  <header className="p-5">
                    <h4 className="text-uppercase">Enhanced Business Profile</h4>
                    <div className={cls(styles.price)}>
                      <small className="fs-3">$</small> <strong>{selectedPrices.ehanced}</strong>
                      <small>/year</small>
                    </div>
                    {/* <Image src={claimPricingPlanSvg} width={200} height={100} /> */}
                  </header>

                  <div className={cls(styles.planBody, 'px-5 py-4 mb-4')}>
                    <span className="d-block text-black mb-4">
                      Your featured ad will appear on:
                    </span>
                    <ul className={cls(styles.planFeatures, 'no-bullets mb-5')}>
                      <li>
                        <small>24/7 support</small>
                      </li>
                      <li>
                        <small>Remove competitor's ads</small>
                      </li>
                      <li>
                        <small>Respond to reviews</small>
                      </li>
                      <li>
                        <small>Private message reviewer</small>
                      </li>
                      <li>
                        <small>Add Video (upload, youtube, or however)</small>
                      </li>
                      <li>
                        <small>Photo slideshow</small>
                      </li>
                      <li>
                        <small>Announcements</small>
                      </li>
                      <li>
                        <small>Call to Action</small>
                      </li>
                    </ul>
                    <Link href={getCheckoutUrl('ehanced_business_profile')} passHref>
                      <a className="btn btn-pry btn--lg">Get the Sponsored Business Listing</a>
                    </Link>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </Layout.Main>
      </Layout>
    </SSRProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const slug = context.params!.claimSuccessSlug as string;
    const [, , businessId] = slug.split('_');
    if (!businessId) return { notFound: true };

    const session = await unstable_getServerSession(
      context.req,
      context.res,
      authOptions as NextAuthOptions,
    );
    if (!session) return { redirect: { destination: '/', permanent: false } };

    const res = await api.getBusinessClaim(businessId, session.user.accessToken);
    if (!res.claim) return { notFound: true };

    const businessWasClaimedByLoggedInUser = session.user._id === res.claim.user._id;
    if (!businessWasClaimedByLoggedInUser) return { notFound: true };
    return { props: { ...res, pageSlug: slug } };
  } catch (err) {
    return {
      props: {
        error: (err as Error).message,
      },
    };
  }
};

export default ClaimSuccessPage;
