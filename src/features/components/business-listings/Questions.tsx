import React, { ChangeEventHandler, useEffect, useMemo, useRef, useState } from 'react';

import cls from 'classnames';
import { Icon } from '@iconify/react';
import { Form } from 'react-bootstrap';
import LabelledCheckbox from '../shared/LabelledCheckbox';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from '../shared/star-rating/StarRating';
import styles from './Questions.module.scss';
import TextInput from '../shared/text-input/TextInput';
import useInput from '../../hooks/useInput';

interface Props {
  show: boolean;
}

function QuestionsSection(props: Props) {
  const { show } = props;

  return (
    <>
      <section
        className={cls(show ? 'd-flex' : 'd-none', 'align-items-center gap-5 flex-wrap')}
      >
        <h2 className="flex-grow-1" style={{ flexBasis: '65%' }}>
          Questions & Answers
        </h2>
        <button className="btn btn-gray">
          <Icon icon="material-symbols:add" />
          Ask new question
        </button>
        <Link href={'/'}>See all 14 questions</Link>
      </section>
      <ul className={cls(styles.questions, 'no-bullets', show ? 'd-block' : 'd-none')}>
        <Question />
      </ul>
    </>
  );
}

function Question() {
  const {
    inputValue: answerValue,
    handleChange: handleChangeAnswer,
    validationErrors,
  } = useInput({ init: '' });

  useEffect(() => {}, []);
  return (
    <li className={styles.question}>
      <div className={styles.questionHeader}>
        <Image
          src={'/img/los-angeles-photo.jpg'}
          width={50}
          height={50}
          objectFit="cover"
          style={{ borderRadius: '50%' }}
        />
        <small className="fs-4">
          <span className="text-black"> Don W.</span> asked a question on Dec 31, 2022
        </small>

        <small className={styles.location}>
          <Icon icon="material-symbols:location-on" width={15} color="#2c2c2c" />
          Terrell, TX • 5 contributions
        </small>

        <button className={styles.flag}>
          <Icon icon="mi:options-vertical" width={25} />
        </button>
      </div>
      <div className={styles.questionText}>
        <Link href={'/'} className="link">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam explicabo est
          repellat tempore, ad inventore ex quia ipsa, quidem in repellendus esse
        </Link>
      </div>
      <hr />

      <div className={styles.answer}>
        <div className={styles.answerHeader}>
          <Image
            src={'/img/los-angeles-photo.jpg'}
            width={30}
            height={30}
            objectFit="cover"
            style={{ borderRadius: '50%' }}
          />
          <small className={cls(styles.authorAndDate, 'd-block')}>
            <small>
              Answer from
              <small className="text-black"> Don W.</small> on Jan 07, 2020
            </small>
          </small>

          <small
            className={cls(
              styles.responderInfo,
              'd-flex gap-3 align-items-center flex-wrap',
            )}
          >
            <small>Business Representative</small>
            <small>• 4 people found this helpful</small>
            <span>
              <Icon icon="mdi:like" width={15} />
              <small> Most helpful answer</small>
            </span>
          </small>
        </div>
        <small className="parag mb-4 d-block">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi ut officiis sunt
          iure qui, ratione veniam deleniti natus dolore expedita?
        </small>

        <div className="d-flex align-items-center justify-content-start gap-4 mb-4">
          <button className="btn btn-bg-none btn--sm">
            <Icon icon="mdi:like-outline" width={20} />1
          </button>
          <button className="btn btn-bg-none btn--sm">
            <Icon icon="mdi:dislike-outline" width={20} />1
          </button>
        </div>
      </div>

      <hr />

      <div className={cls(styles.answerSection, 'd-flex align-items-center gap-3 mt-5')}>
        <Icon icon="mdi:user-circle" width={30} color="#aaa" />
        <TextInput
          value={answerValue}
          onChange={handleChangeAnswer}
          className="textfield"
          placeholder="Write your answer here..."
        />
      </div>
    </li>
  );
}

export default QuestionsSection;

// #include <stdio.h>

// int isDaphneNumber(int n) {
//     if (n < 0) return 0;

//     int minFactor = NULL, maxFactor=NULL;
//     int factorsCount = 0;
//     int i;
//     for (int i=2; i < n; i++) {
//         if (n % i != 0) continue;
//         maxFactor = i;
//         if (minFactor == NULL) minFactor = i;
//     }
//     // Here, both factors will be 0, 0 if n is prime.
//     if (!minFactor || !maxFactor) return 0;

//     int diff = maxFactor - minFactor;
//     if (diff * diff < n) return 1;

//     return 0;
// }
