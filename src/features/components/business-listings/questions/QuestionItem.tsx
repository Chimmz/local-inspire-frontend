import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';

import useInput from '../../../hooks/useInput';

import cls from 'classnames';
import { Icon } from '@iconify/react';
import styles from './QuestionsSection.module.scss';
import { getFullName } from '../../../utils/user-utils';
import Link from 'next/link';
import Answer, { AnswerProps } from './Answer';
import TextInput from '../../shared/text-input/TextInput';
import { UserPublicProfile } from '../../../types';
import api from '../../../library/api';
import useSignedInUser from '../../../hooks/useSignedInUser';
import NewAnswerForm from './NewAnswerForm';
import { simulateRequest } from '../../../utils/async-utils';
import useRequest from '../../../hooks/useRequest';
import useDate from '../../../hooks/useDate';

export interface QuestionItemProps {
  _id: string;
  questionText: string;
  askedBy: UserPublicProfile;
  askedDate: '2023-01-07T02:33:50.633Z';
  answers: AnswerProps[];
  createdAt: string;
}

type Props = QuestionItemProps & { show: boolean };

const QuestionItem = (props: Props) => {
  const [question, setQuestion] = useState<QuestionItemProps>(props);
  const { send: sendAnswerReq, loading: isSendingAnswer } = useRequest({
    autoStopLoading: true,
  });
  const { date: askedDate } = useDate(question.createdAt, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  const [imgSrc, setImgSrc] = useState(question.askedBy.imgUrl);

  let mostHelpfulAnswer: AnswerProps = useMemo(() => {
    return question.answers.reduce((accum, ans) => {
      if (ans.likes.length > accum.likes.length) return ans;
      return accum;
    }, question.answers[0]);
  }, [question.answers]);

  return (
    <section className={cls(styles.question, props.show ? 'd-block' : 'd-none')}>
      <div className={styles.questionHeader}>
        <Image
          src={imgSrc}
          width={50}
          height={50}
          objectFit="cover"
          style={{ borderRadius: '50%' }}
          onError={setImgSrc.bind(null, '/img/default-profile-pic.jpeg')}
        />
        <small className="fs-4">
          <span className="text-black">
            {getFullName(question.askedBy, { lastNameInitial: true })}
          </span>{' '}
          asked a question on {askedDate}
        </small>

        <small className={styles.location}>
          <Icon icon="material-symbols:location-on" width={15} color="#2c2c2c" />
          Terrell, TX • 5 contributions
        </small>

        <button className={styles.flag}>
          <Icon icon="mi:options-vertical" width={25} />
        </button>
      </div>

      <div className={cls(styles.questionText, 'text-dark')}>
        <Link href={'/'} className="link">
          {question.questionText}
        </Link>
      </div>

      <ul>
        {question.answers.map(a => (
          <Answer
            {...a}
            questionId={question._id}
            key={a._id}
            mostHelpful={a._id === mostHelpfulAnswer._id}
          />
        ))}
      </ul>

      <hr />
      <NewAnswerForm show questionId={props._id} setQuestion={setQuestion} />
    </section>
  );
};

export default QuestionItem;
