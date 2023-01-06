import React, { ChangeEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import cls from 'classnames';
import { Icon } from '@iconify/react';
import { Form } from 'react-bootstrap';
import LabelledCheckbox from '../shared/LabelledCheckbox';
import StarRating from '../shared/star-rating/StarRating';
import TextInput from '../shared/text-input/TextInput';
import useInput from '../../hooks/useInput';
import styles from './AdvicesSection.module.scss';

interface AdvicesSectionProps {
  show: boolean;
}

const AdvicesSection = function (props: AdvicesSectionProps) {
  return (
    <>
      <section
        className={cls(
          props.show ? 'd-flex' : 'd-none',
          'align-items-center justify-content-between flex-wrap',
        )}
      >
        <h2>Tips/Advice</h2>
        <button className="btn btn-pry">Write a review</button>
      </section>
      <ul
        className={cls(styles.advices, 'no-bullets', props.show ? 'd-block' : 'd-none')}
      >
        <li className={styles.advice}>
          <div className={styles.adviceHeader}>
            <Image
              src={'/img/los-angeles-photo.jpg'}
              width={50}
              height={50}
              objectFit="cover"
              style={{ borderRadius: '50%' }}
            />
            <small className="fs-4">
              <span className="text-black"> Don W.</span> wrote a review on Dec 31, 2022
            </small>

            <small className={styles.location}>
              <Icon icon="material-symbols:location-on" width={15} color="#2c2c2c" />
              Terrell, TX • 5 contributions
            </small>

            <button className={styles.flag}>
              <Icon icon="ic:round-flag" width={25} />
            </button>
          </div>
          <div className={styles.questionText}>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam explicabo
              est repellat tempore...
            </p>
            <Link href={'/'} className="btn">
              Read full review...
            </Link>
          </div>
        </li>
      </ul>
    </>
  );
};

export default AdvicesSection;
