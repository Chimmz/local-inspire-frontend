import React, { ChangeEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import cls from 'classnames';
import Tip, { TipProps } from './Tip';
import { useRouter } from 'next/router';
import navigateTo, {
  genBusinessPageUrl,
  genRecommendBusinessPageUrl,
} from '../../../utils/url-utils';
import styles from './AdvicesSection.module.scss';
import NoReviewsYet from '../review/NoReviewsYet';

interface AdvicesSectionProps {
  show: boolean;
  tips?: TipProps[] | undefined;
  slug: string;
  businessName: string | undefined;
}

const AdvicesSection = function (props: AdvicesSectionProps) {
  const reviewPageUrl = genRecommendBusinessPageUrl<string>({
    slug: props.slug,
    recommends: null,
  });

  return (
    <>
      <section
        className={cls(
          props.show ? 'd-flex' : 'd-none',
          'align-items-center justify-content-between flex-wrap',
        )}
      >
        <h2>Tips/Advice</h2>
        <button className="btn btn-pry">
          <Link href={reviewPageUrl}>Write a review</Link>
        </button>
      </section>

      {props.tips?.map(tip => (
        <Tip
          {...tip}
          show={props.show && !!props.tips?.length}
          key={tip._id}
          slug={props.slug}
        />
      ))}

      <NoReviewsYet
        businessName={props.businessName}
        show={props.show && !props.tips?.length}
      />
    </>
  );
};

export default AdvicesSection;
