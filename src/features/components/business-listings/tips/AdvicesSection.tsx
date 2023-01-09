import React, { ChangeEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import cls from 'classnames';
import { Icon } from '@iconify/react';
import { Form } from 'react-bootstrap';
import LabelledCheckbox from '../../shared/LabelledCheckbox';
import StarRating from '../../shared/star-rating/StarRating';
import TextInput from '../../shared/text-input/TextInput';
import useInput from '../../../hooks/useInput';
import styles from './AdvicesSection.module.scss';
import Tip, { TipProps } from './Tip';
import { useRouter } from 'next/router';
import navigateTo from '../../../utils/url-utils';

interface AdvicesSectionProps {
  show: boolean;
  tips: TipProps[] | undefined;
}

const AdvicesSection = function (props: AdvicesSectionProps) {
  const router = useRouter();

  const linkToReviewPage = router.asPath.replace('/v/', '/write-a-review/');

  return (
    <>
      <section
        className={cls(
          props.show ? 'd-flex' : 'd-none',
          'align-items-center justify-content-between flex-wrap',
        )}
      >
        <h2>Tips/Advice</h2>
        <button
          className="btn btn-pry"
          onClick={navigateTo.bind(null, linkToReviewPage, router)}
        >
          Write a review
        </button>
      </section>

      {props.tips?.map(tip => (
        <Tip
          {...tip}
          show={props.show}
          key={tip._id}
          linkToReviewPage={linkToReviewPage}
          goToReviewPage={navigateTo.bind(null, linkToReviewPage, router)}
        />
      ))}
    </>
  );
};

export default AdvicesSection;
