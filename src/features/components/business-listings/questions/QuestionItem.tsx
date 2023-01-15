import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';

import useRequest from '../../../hooks/useRequest';
import useDate from '../../../hooks/useDate';

import { getFullName } from '../../../utils/user-utils';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import Answer, { AnswerProps } from './Answer';
import { UserPublicProfile } from '../../../types';
import NewAnswerForm from './NewAnswerForm';
import { Accordion } from 'react-bootstrap';
import CustomAccordionToggle from '../../shared/accordion/CustomAccordionToggle';
import styles from './QuestionsSection.module.scss';

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
  const [imgSrc, setImgSrc] = useState(
    // question.askedBy.imgUrl ||
    '/img/default-profile-pic.jpeg',
  );

  const mostHelpfulAnswer = useMemo(() => {
    return question.answers.reduce((accum: AnswerProps | null, ans) => {
      if (accum && ans.likes.length > accum?.likes?.length) return ans;
      return accum;
    }, null);
  }, [question, question.answers]);

  const lessHelpfulAnswers = useMemo(() => {
    return question.answers.filter(a => a._id !== mostHelpfulAnswer?._id);
  }, [question.answers]);

  if (props._id === '63c3566720476f44f35f6b82') {
    console.log({ mostHelpfulAnswer, lessHelpfulAnswers });
  }

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
        <small className="">
          <span className="text-black">
            {getFullName(question.askedBy, { lastNameInitial: true })}
          </span>{' '}
          asked a question on {askedDate}
        </small>

        <small className={styles.location}>
          <Icon icon="material-symbols:location-on" width={15} color="#2c2c2c" />
          Terrell, TX • 5 contributions
        </small>

        <button className={cls(styles.flag, 'btn btn-circle')}>
          <Icon icon="mi:options-horizontal" width={22} />
        </button>
      </div>

      <div className={cls(styles.questionText, 'text-dark text-hover-dark fs-3')}>
        <Link href={'/'} className="link">
          {question.questionText}
        </Link>
      </div>

      {/* Most helpful answer */}
      {mostHelpfulAnswer ? (
        <Answer
          {...mostHelpfulAnswer}
          questionId={question._id}
          mostHelpful
          setQuestion={setQuestion}
        />
      ) : null}

      <>
        {!mostHelpfulAnswer ? (
          <ul className={question.answers.length < 2 ? 'd-none' : 'd-block'}>
            {question.answers.map(a => (
              <Answer
                {...a}
                questionId={question._id}
                key={a._id}
                mostHelpful={false}
                setQuestion={setQuestion}
              />
            ))}
          </ul>
        ) : (
          <Accordion
            className={cls(styles.lessHelpfulAnswers, lessHelpfulAnswers.length && 'd-none')}
          >
            <CustomAccordionToggle
              eventKey="1"
              className="btn btn-bg-none no-bg-hover mt-4"
              classNameOnExpand="btn btn-bg-none no-bg-hover"
              contentOnExpand={<span className="text-pry">Show most helpful answer</span>}
            >
              <span className="text-pry">
                Show {question.answers.length - 1} more answers{' '}
              </span>
            </CustomAccordionToggle>

            <Accordion.Collapse eventKey="1">
              <ul>
                {lessHelpfulAnswers.map(a => (
                  <Answer
                    {...a}
                    questionId={question._id}
                    key={a._id}
                    mostHelpful={a._id === mostHelpfulAnswer._id}
                    setQuestion={setQuestion}
                  />
                ))}
              </ul>
            </Accordion.Collapse>
          </Accordion>
        )}
      </>

      <NewAnswerForm show questionId={props._id} setQuestion={setQuestion} />
    </section>
  );
};

export default QuestionItem;
