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
import AppDropdown from '../../shared/dropdown/AppDropdown';
import { BusinessProps } from '../../business-results/Business';
import { genQuestionDetailsPageUrl } from '../../../utils/url-utils';

export interface QuestionItemProps {
  _id: string;
  questionText: string;
  business: BusinessProps | undefined;
  askedBy: UserPublicProfile;
  answers: AnswerProps[];
  answersCount: number;
  createdAt: string;
}

type Props = QuestionItemProps & { show: boolean };

const QuestionItem = (props: Props) => {
  const [question, setQuestion] = useState<QuestionItemProps>(props);

  const { date: askedDate } = useDate(question.createdAt, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const handleSelectDropdownOption = (evKey: string) => {
    switch (evKey as 'report') {
      case 'report':
        console.log('Reporting...');
        break;
    }
  };

  const mostHelpfulAnswer = useMemo(() => {
    if (!question) return null;

    let answer = question!.answers.reduce((acc, ans) => {
      if (ans.likes.length > acc.likes.length) return ans;
      else return acc;
    }, question!.answers[0]);

    return answer?.likes.length ? answer : null;
  }, [question]);

  const lessHelpfulAnswers = useMemo(() => {
    if (!mostHelpfulAnswer) return question.answers;
    return question.answers.filter(a => a._id !== mostHelpfulAnswer?._id);
  }, [question.answers, mostHelpfulAnswer]);

  if (question._id === '63caa1fcfe667c5d91a7112f') {
    console.log({ mostHelpfulAnswer, lessHelpfulAnswers });
  }

  const questionDetailsUrl = useMemo(
    () =>
      genQuestionDetailsPageUrl({
        businessName: props.business!.businessName!,
        qId: props._id,
        qText: props.questionText,
        city: props.business?.city,
        stateCode: props.business?.stateCode,
      }),
    [],
  );

  console.log({ mostHelpfulAnswer, lessHelpfulAnswers });

  return (
    <section className={cls(styles.question, props.show ? 'd-block' : 'd-none')}>
      <div className={styles.questionHeader}>
        <figure>
          <Image
            src={question.askedBy.imgUrl}
            layout="fill"
            objectFit="cover"
            // onError={setImgSrc.bind(null, '/img/default-profile-pic.jpeg')}
            style={{ borderRadius: '50%' }}
          />
        </figure>

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

        <AppDropdown
          items={['Report']}
          onSelect={handleSelectDropdownOption}
          toggler={<Icon icon="material-symbols:more-vert" width={20} />}
          className={styles.options}
        />
      </div>

      <div className={cls(styles.questionText, 'text-dark text-hover-dark fs-3')}>
        <Link href={questionDetailsUrl} className="link">
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

      {/* <ul>
        {question.answers.map(a => (
          <Answer
            {...a}
            questionId={question._id}
            key={a._id}
            mostHelpful={false}
            setQuestion={setQuestion}
          />
        ))}
      </ul> */}

      <>
        {!mostHelpfulAnswer ? (
          <ul>
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
            className={cls(styles.lessHelpfulAnswers, !lessHelpfulAnswers.length && 'd-none')}
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
