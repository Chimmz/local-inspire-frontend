import React, { useMemo, useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';

import cls from 'classnames';

import { SSRProvider } from 'react-bootstrap';
import Layout from '../../../features/components/layout';
import SuccessFeedback from '../../../features/components/shared/success/SuccessFeedback';
import api from '../../../features/library/api';
import { NextAuthOptions, unstable_getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';
import { BusinessClaim } from '../../../features/types';
import * as strUtils from '../../../features/utils/string-utils';
import * as domUtils from '../../../features/utils/dom-utils';
import Link from 'next/link';
import { genBusinessPageUrl } from '../../../features/utils/url-utils';

interface Props {
  claim?: BusinessClaim;
  error?: string;
  pageSlug: string;
}

const ClaimPaymentSuccess: NextPage<Props> = function (props) {
  const [purchasedPlanName, recurringType] = useMemo(() => {
    return [
      strUtils.toTitleCase(
        strUtils.removeSubstrings(props.claim?.currentPlan, ['_monthly', '_yearly']),
        '_',
      ),
      props.claim?.currentPlan.includes('monthly') ? 'monthly' : 'yearly',
    ];
  }, [props.claim]);

  useEffect(() => {
    domUtils.scrollToElement('main');
  }, []);

  return (
    <SSRProvider>
      <Layout>
        <Layout.Nav withKeywordsNav={false} />
        <Layout.Main
          className={cls(
            'min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light py-5',
          )}
        >
          {'error' in props ? (
            <p className="fs-2">Sorry something went wrong.</p>
          ) : (
            <>
              <SuccessFeedback
                title="Payment Received!"
                description={`Your ${recurringType} subscription for the ${purchasedPlanName} plan has been activated.`}
              />
              <div className="d-flex gap-3 justify-content-center flex-wrap mt-5">
                <Link href="/" passHref>
                  <a className="btn btn-pry">Go to business dashboard</a>
                </Link>
                <Link href={genBusinessPageUrl<string>({ slug: props.pageSlug })} passHref>
                  <a className="btn btn-outline-pry">Go to business page</a>
                </Link>
              </div>
            </>
          )}
        </Layout.Main>
      </Layout>
    </SSRProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const slug = context.params!.paySuccessSlug as string;
    const [, , businessId] = slug.split('_');

    if (!businessId || businessId.length != 24) return { notFound: true };

    const session = await unstable_getServerSession(
      context.req,
      context.res,
      authOptions as NextAuthOptions,
    );
    if (!session) return { notFound: true };

    const responses = await Promise.allSettled([
      api.getBusinessClaim(businessId, session.user.accessToken),
    ]);

    const [claim] = responses
      .filter(res => res.status === 'fulfilled' && res.value)
      .map(res => res.status === 'fulfilled' && res.value);

    // If business wasn't claimed by logged in user
    if (session.user?._id !== (claim.claim as BusinessClaim)?.user?._id)
      return { notFound: true };

    return {
      props: { ...claim, pageSlug: slug },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        error: (err as Error).message,
      },
    };
  }
};

export default ClaimPaymentSuccess;
