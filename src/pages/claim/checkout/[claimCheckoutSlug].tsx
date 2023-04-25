import React, { useState, useMemo } from 'react';
import { NextAuthOptions, unstable_getServerSession } from 'next-auth';
import { GetServerSideProps, NextPage } from 'next';

import Image from 'next/image';
import { authOptions } from '../../api/auth/[...nextauth]';

import { BusinessProps } from '../../../features/components/business-results/Business';
import { BusinessClaim } from '../../../features/types';

import { useRouter } from 'next/router';
import useRequest from '../../../features/hooks/useRequest';
import useInput from '../../../features/hooks/useInput';

import * as validators from '../../../features/utils/validators/inputValidators';
import cls from 'classnames';

import api from '../../../features/library/api';
import { Icon } from '@iconify/react';
import TextInput from '../../../features/components/shared/text-input/TextInput';
import Layout from '../../../features/components/layout';
import styles from '../../../styles/sass/pages/claimBusinessCheckout.module.scss';

interface Props {
  business: BusinessProps | undefined;
  claim: BusinessClaim | undefined;
}

const packages = {
  sponsored_business_listing: 'Sponsored Business Listing',
  ehanced_business_profile: 'Ehanced Business Profile',
};

const ClaimCheckoutPage: NextPage<Props> = function (props) {
  const [prices, setPrices] = useState({
    monthly: { sponsored_business_listing: 59.99, ehanced_business_profile: 199.99 },
    yearly: { sponsored_business_listing: 199.99, ehanced_business_profile: 399.99 },
  });

  const { send: sendSubscribeReq, loading: isSubscribing } = useRequest();
  const router = useRouter();
  const { package: selectedPackage, duration } = router.query;

  const price = useMemo(() => {
    if (!['monthly', 'yearly'].includes(duration as string)) return;
    return prices[duration as keyof typeof prices][
      selectedPackage as string as keyof typeof prices.monthly
    ];
  }, [prices]);

  const {
    inputValue: cardNumber,
    onChange: handleChangeCardNumber,
    validationErrors: cardValidationErrors,
    runValidators: runCardNumberValidators,
    pushValidationError: pushCardError,
    clearInput: clearCardNumber,
  } = useInput({
    init: '',
    type: 'number',
    validators: [
      { fn: validators.isRequired, params: ['Please enter card number'] },
      { fn: validators.minLength, params: [12, 'Invalid card number'] },
      { fn: validators.maxLength, params: [12, 'Invalid card number'] },
    ],
  });

  const {
    inputValue: cardDate,
    onChange: handleChangeCardDate,
    validationErrors: dateValidationErrors,
    runValidators: runDateValidators,
    pushValidationError: pushDateError,
    clearInput: clearCardDate,
  } = useInput({
    init: '',
    validators: [{ fn: validators.isRequired, params: ['Please enter the expiry date'] }],
  });

  const {
    inputValue: cardCVC,
    onChange: handleChangeCVC,
    validationErrors: cvcValidationErrors,
    runValidators: runCvcValidators,
    pushValidationError: pushCvcError,
    clearInput: clearCVC,
  } = useInput({
    init: '',
    type: 'number',
    validators: [{ fn: validators.isRequired, params: ['Please enter the security code'] }],
  });

  const handleSubscribe = () => {
    const validations = [runCardNumberValidators(), runDateValidators(), runCvcValidators()];
    if (validations.some(v => v.errorExists)) return;
  };

  return (
    <Layout>
      <Layout.Nav />
      <Layout.Main>
        <div className={cls('container', styles.container)}>
          <aside>
            <figure>
              <Image
                src={props.business?.images[0].imgUrl || '/img/business-img-default.jpeg'}
                width={700}
                height={400}
                objectFit="cover"
              />
            </figure>
            <div className="fs-4">
              <label
                className="text-uppercase d-block text-light fs-5 mb-3 text-center"
                style={{ letterSpacing: '1px' }}
              >
                Subscription Summary
              </label>
              <strong className="text-bold d-block fs-4 mb-5 text-center">
                {packages[selectedPackage as keyof typeof packages]}
              </strong>
              <div className="d-flex justify-content-between mb-4">
                Price <strong>{price}</strong>
              </div>
              <div className="d-flex justify-content-between mb-5">
                Tax <strong>$0</strong>
              </div>
              <hr style={{ borderColor: '#aaa' }} />
              <div className="d-flex justify-content-between mt-5">
                Total <strong>{price}</strong>
              </div>
            </div>
          </aside>

          <header>
            <h1 className="fs-3">
              {packages[selectedPackage as keyof typeof packages]} for{' '}
              {props.business?.businessName}
            </h1>
            <address className="fs-4 text-light mb-0">
              {props.business?.city}, {props.business?.stateCode}
            </address>
          </header>

          <article className={cls(styles.whatYouAreGetting, 'bg-light border py-4 px-4')}>
            <h4 className="mb-4">What you are getting!</h4>
            <ul className="ms-5">
              <li>Business listed on home page of city</li>
              <li>Business listed at top of search results in city and category </li>
              <li>
                Business listed on competitor&apos;s business page (above Ratings and reviews and
                at bottom)
              </li>
              <li>Business listed in members area for city (as featured) </li>
            </ul>
          </article>

          <form className={cls(styles.cardDetails)}>
            <div style={{ flexBasis: '50%' }}>
              <TextInput
                label={<span className="text-light">Card Number</span>}
                value={cardNumber}
                onChange={handleChangeCardNumber}
                validationErrors={cardValidationErrors}
                maxlength="12"
                autoFocus
              />
            </div>
            <div>
              <TextInput
                label={<span className="text-light"> Expiry Date</span>}
                type="date"
                value={cardDate}
                onChange={handleChangeCardDate}
                validationErrors={dateValidationErrors}
              />
            </div>
            <div className="">
              <TextInput
                label={<span className="text-light"> CVC</span>}
                value={cardCVC}
                onChange={handleChangeCVC}
                validationErrors={cvcValidationErrors}
                maxlength="4"
              />
            </div>
          </form>
          <div className="d-flex align-items-center justify-content-between">
            <button className="btn btn--lg text-pry gap-2" onClick={router.back}>
              <Icon icon="material-symbols:arrow-back-ios-new" /> Back
            </button>
            <button className="btn btn-pry btn--lg" type="button" onClick={handleSubscribe}>
              Subscribe
            </button>
          </div>
        </div>
      </Layout.Main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const [, , businessId] = (context.params!.claimCheckoutSlug as string).split('_');
  if (!businessId) return { notFound: true };

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions as NextAuthOptions,
  );
  if (!session) return { redirect: { destination: '/', permanent: false } };

  const responses = await Promise.allSettled([
    api.getBusinessById(businessId),
    api.getBusinessClaim(businessId, session.user.accessToken),
  ]);

  const [businessResp, claim] = responses
    .filter(res => res.status === 'fulfilled' && res.value)
    .map(res => res.status === 'fulfilled' && res.value);

  const res = await api.getBusinessClaim(businessId, session.user.accessToken);
  if (!res.claim) return { notFound: true };

  const businessWasClaimedByLoggedInUser = session.user._id === res.claim.user._id;
  if (!businessWasClaimedByLoggedInUser) return { notFound: true };

  return { props: { business: businessResp.data, ...claim } };
};

export default ClaimCheckoutPage;
