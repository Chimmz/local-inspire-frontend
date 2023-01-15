import React, { ChangeEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import cls from 'classnames';
import Tip, { TipProps } from './Tip';
import { useRouter } from 'next/router';
import navigateTo, { genBusinessPageUrl } from '../../../utils/url-utils';
import styles from './AdvicesSection.module.scss';

interface AdvicesSectionProps {
  show: boolean;
  tips: TipProps[] | undefined;
  slug: string;
}

const AdvicesSection = function (props: AdvicesSectionProps) {
  console.log({ URL: genBusinessPageUrl<string>({ slug: props.slug }) });
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
          <Link href={genBusinessPageUrl<string>({ slug: props.slug })}>Write a review</Link>
        </button>
      </section>

      {props.tips?.map(tip => (
        <Tip {...tip} show={props.show} key={tip._id} slug={props.slug} />
      ))}
    </>
  );
};

export default AdvicesSection;
