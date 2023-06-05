import cls from 'classnames';
import { GetServerSideProps, NextPage } from 'next';
import React, { useState, useMemo, useEffect } from 'react';
import Layout from '../../../features/components/layout';
import { SSRProvider } from 'react-bootstrap';
import claimPricingPlanSvg from '../../../../public/svg/claim-pricing-plan.svg';
import Image from 'next/image';
import RadioOptions from '../../../features/components/shared/radio/RadioOptions';
import api from '../../../features/library/api';
import { NextAuthOptions, unstable_getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';
import { BusinessClaim, StripePrice } from '../../../features/types';

import styles from '../../../styles/sass/pages/claimBusinessSuccessPage.module.scss';
import Link from 'next/link';
import {
  genBusinessPageUrl,
  genClaimBusinessCheckoutPageUrl,
} from '../../../features/utils/url-utils';
import { toTitleCase } from '../../../features/utils/string-utils';
import useRequest from '../../../features/hooks/useRequest';
import useSignedInUser from '../../../features/hooks/useSignedInUser';
import LoadingButton from '../../../features/components/shared/button/Button';
import TextInput from '../../../features/components/shared/text-input/TextInput';

interface Props {
  status: 'SUCCESS' | 'FAIL' | 'ERROR';
  prices: StripePrice[];
  //  {
  // has_more: boolean;
  // object: string;
  // status: 'SUCCESS' | 'FAIL' | 'ERROR';
  // url: string;
  // };
  claim: BusinessClaim | undefined;
  pageSlug: string;
}

type BusinessUpgradePlanNickname =
  | 'sponsored_business_listing_yearly'
  | 'sponsored_business_listing_monthly'
  | 'enhanced_business_profile_yearly'
  | 'enhanced_business_profile_monthly';

const planNicknames = [
  'sponsored_business_listing_monthly',
  'sponsored_business_listing_yearly',
  'enhanced_business_profile_monthly',
  'enhanced_business_profile_yearly',
];

const ClaimSuccessPage: NextPage<Props> = function (props) {
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'yearly'>('monthly');
  const { accessToken } = useSignedInUser();

  const { loading: sponsoredReqLoading, startLoading: startSponsoredLoader } = useRequest({
    autoStopLoading: false,
  });
  const { loading: enhancedReqLoading, startLoading: startEnhancedLoader } = useRequest({
    autoStopLoading: false,
  });

  const getPackage = async (plan: StripePrice) => {
    plan.nickname.includes('sponsored') ? startSponsoredLoader() : startEnhancedLoader();
    try {
      const res = await api.getBusinessClaimCheckoutSession(
        plan.id,
        props.claim!.business._id,
        accessToken!,
        {
          returnUrl: `/claim/payment-success/${props.pageSlug}`,
          cancelUrl: `/claim/success/${props.pageSlug}`,
        },
      );
      console.log(res);
      if (res.status === 'SUCCESS' && res.session?.url) window.location.href = res.session.url;
    } catch (err) {
      console.log(err);
    }
  };

  const plans = useMemo(() => {
    return props.prices
      ?.filter(pr => pr.nickname.includes(selectedDuration))
      .sort(curr => (curr.nickname.startsWith('sponsored') ? -1 : 1));
  }, [props.prices, selectedDuration]);

  const getPlanName = (nickname: BusinessUpgradePlanNickname) => {
    const planName = nickname.replace('_monthly', '').replace('_yearly', '');
    return toTitleCase(planName, '_');
  };

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
                display:
                  !props.claim?.currentPlan || props.claim?.currentPlan === 'free'
                    ? 'block'
                    : '',
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
                {plans?.map(plan => (
                  <li
                    className={cls(styles.plan, 'bg-white rounded-2 overflow-hidden')}
                    key={plan.id}
                  >
                    <header className="p-5 position-relative">
                      <h4 className="text-uppercase">
                        {getPlanName(plan.nickname as BusinessUpgradePlanNickname)}
                      </h4>
                      <div className={cls(styles.price)}>
                        <small className="fs-3">$</small>{' '}
                        <strong>{+plan.unit_amount_decimal / 100}</strong>
                        <small>/{plan.recurring.interval}</small>
                      </div>
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
                      <LoadingButton
                        onClick={getPackage.bind(null, plan)}
                        textWhileLoading="Processing..."
                        withSpinner
                        disabled={sponsoredReqLoading || enhancedReqLoading}
                        className="btn btn-pry btn--lg"
                        isLoading={
                          plan.nickname.includes('sponsored')
                            ? sponsoredReqLoading
                            : enhancedReqLoading
                        }
                      >
                        Get the {getPlanName(plan.nickname as BusinessUpgradePlanNickname)}
                      </LoadingButton>
                    </div>
                  </li>
                ))}
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

    const responses = await Promise.allSettled([
      api.getBusinessClaim(businessId, session.user.accessToken),
      api.getBusinessUpgradePlans(),
    ]);

    const [claimResp, prices] = responses
      .filter(res => res.status === 'fulfilled' && res.value)
      .map(res => res.status === 'fulfilled' && res.value);

    if (!claimResp.claim) return { notFound: true };

    const businessWasClaimedByLoggedInUser = session.user._id === claimResp.claim.user._id;
    if (!businessWasClaimedByLoggedInUser) return { notFound: true };

    return {
      props: {
        ...claimResp,
        prices: prices.data!.filter((price: StripePrice) =>
          planNicknames.includes(price.nickname),
        ),
        pageSlug: slug,
      },
    };
  } catch (err) {
    return {
      props: {
        error: (err as Error).message,
      },
    };
  }
};

export default ClaimSuccessPage;
