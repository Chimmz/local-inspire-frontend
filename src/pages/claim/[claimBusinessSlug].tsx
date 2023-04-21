import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next';
import React, { useMemo, useState } from 'react';
import api from '../../features/library/api';
import { toTitleCase } from '../../features/utils/string-utils';
import { SSRProvider } from 'react-bootstrap';
import Layout from '../../features/components/layout';
import cls from 'classnames';
import styles from '../../styles/sass/pages/claimBusinessPage.module.scss';
import { BusinessProps } from '../../features/components/business-results/Business';
import Image from 'next/image';
import ClaimCtaImage1 from '../../../public/svg/claim-cta-img-1.svg';
import ClaimCtaImage2 from '../../../public/svg/claim-cta-img-2.svg';
import BusinessClaimModal from '../../features/components/business-claim/BusinessClaimModal';
import useMiddleware from '../../features/hooks/useMiddleware';
import { NextAuthOptions, unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

interface Props {
  business: BusinessProps;
  pageParams: {
    businessName: string;
    city: string;
    stateCode: string;
    businessId: string;
    slug: string;
  };
}

const ClaimBusinessPage: NextPage<Props> = function (props) {
  const [showClaimModal, setShowClaimModal] = useState(false);
  const { withAuth } = useMiddleware();

  const businessAddress = useMemo(() => {
    return [props.business.address, props.business.city, props.business.stateCode].join(', ');
  }, [props]);

  return (
    <SSRProvider>
      <Layout>
        <Layout.Nav withKeywordsNav={false} />
        <Layout.Main className={cls(styles.main, 'py-5')}>
          <div className={cls(styles.container, 'container')}>
            <header className="d-flex align-items-end gap-5 mb-5">
              <article>
                <h2 className="fw-light mb-5">
                  Grow your business with free tools from Localinspire!
                </h2>
                <h1>{props.business.businessName}</h1>
                <span className="d-block fs-4 text-light mb-4">{businessAddress}</span>
                <p className="fs-4 mb-3">
                  <span className="text-black"> Claim your free listing</span> – start building
                  your business with Localinspire. Attract more visitors and win more business.
                </p>
                <button
                  className="btn btn-pry btn--lg"
                  onClick={withAuth.bind(null, setShowClaimModal.bind(null, true))}
                >
                  Claim your free listing
                </button>
              </article>
              <Image
                src="/img/claim-page-header-img.png"
                width={600}
                height={300}
                objectFit="contain"
              />
            </header>

            <section className={cls(styles.cta, 'bg-white p-5')}>
              <h2 className="fs-1 text-black text-center mb-4">Take control of your listing.</h2>
              <p style={{ maxWidth: '50ch' }} className="mx-auto text-light mb-5 text-center">
                How would you like to grow your business and get more customers for{' '}
                <span className="text-dark">{props.business.businessName}?</span>
              </p>
              <ul className="no-bullets" style={{ marginTop: '10rem' }}>
                <li className={styles.ctaItem}>
                  <figure>
                    <Image src={ClaimCtaImage1} width={400} height={400} objectFit="contain" />
                  </figure>
                  <article>
                    <h5 className="fs-4 text-uppercase fw-bold mb-3">
                      Take control of your listing
                    </h5>
                    <p className="parag mb-4" style={{ maxWidth: '50ch' }}>
                      Customize your business listing details, set main photo, upload photos, and
                      more to show your customers what you&apos;re all about.
                    </p>
                    <button
                      className="btn btn-outline-pry btn--lg"
                      onClick={withAuth.bind(null, setShowClaimModal.bind(null, true))}
                    >
                      Claim your free listing
                    </button>
                  </article>
                </li>
                <li className={cls(styles.ctaItem, 'align-items-center gap-3')}>
                  <article className="">
                    <h5 className="fs-4 text-uppercase fw-bold mb-3">Manage Listing</h5>
                    <p className="parag mb-4" style={{ maxWidth: '50ch' }}>
                      Manage your reviews, photos, and check your business listings activity.
                      Claim for FREE... Its one of the best investment you&apos;ll ever make.
                    </p>
                    <button
                      className="btn btn-outline-pry btn--lg"
                      onClick={withAuth.bind(null, setShowClaimModal.bind(null, true))}
                    >
                      Claim your free listing
                    </button>
                  </article>
                  <figure>
                    <Image src={ClaimCtaImage2} width={500} height={600} objectFit="contain" />
                    {/* <Image src={ClaimCtaImage1} width={400} height={400} objectFit="contain" /> */}
                  </figure>
                </li>
              </ul>
              <button
                className="btn btn-pry btn--lg mx-auto"
                onClick={withAuth.bind(null, setShowClaimModal.bind(null, true))}
              >
                Claim your free listing
              </button>
            </section>
          </div>
        </Layout.Main>
      </Layout>
      <BusinessClaimModal
        show={showClaimModal}
        businessId={props.business._id}
        businessName={props.business.businessName}
        businessAddress={businessAddress}
        pageSlug={props.pageParams.slug}
        close={setShowClaimModal.bind(null, false)}
      />
    </SSRProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const slug = context.params!.claimBusinessSlug as string;
  const [businessName, location, businessId] = slug.split('_');

  console.log('Claim page Request URL: ', context.req.url);

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions as NextAuthOptions,
  );
  if (!session)
    return {
      redirect: { destination: `/v/${slug}`, permanent: false },
    };

  const reqs = [api.getBusinessById(businessId)];
  const responses = await Promise.allSettled(reqs);
  const [business] = responses
    .filter(res => res.status === 'fulfilled' && res.value)
    .map(res => res.status === 'fulfilled' && res.value);

  if (!business.data) return { notFound: true };

  // If business has already been claimed
  if ((business.data as BusinessProps)?.claimedBy?.length)
    return {
      redirect: { destination: `/v/${slug}`, permanent: true },
    };

  return {
    props: {
      business: business.data || {},
      pageParams: {
        businessName: toTitleCase(businessName.replace('-', ' ')),
        location,
        businessId,
        slug,
      },
    },
  };
};

export default ClaimBusinessPage;
