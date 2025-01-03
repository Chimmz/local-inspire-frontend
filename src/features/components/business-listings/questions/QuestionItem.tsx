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
import { genQuestionDetailsPageUrl, genUserProfileUrl } from '../../../utils/url-utils';
import * as qtyUtils from '../../../utils/quantity-utils';
import useMiddleware from '../../../hooks/useMiddleware';
import ReportQA from '../../ReportQA';
import { answerReportReasonsConfig } from './config';
import * as domUtils from '../../../utils/dom-utils';
import { useBusinessPageContext } from '../../../contexts/BusinessPageContext';

export interface QuestionItemProps {
  _id: string;
  questionText: string[];
  business: BusinessProps | undefined;
  askedBy: UserPublicProfile;
  answers: AnswerProps[];
  answersCount: number;
  createdAt: string;
}

type Props = QuestionItemProps & {
  show: boolean;
  openReportQuestionModal: (qId: string) => void;
  showPostingGuidelines: () => void;
};

const QuestionItem = function (props: Props) {
  const [question, setQuestion] = useState<QuestionItemProps>(props);
  const [answerIdReport, setAnswerIdReport] = useState<string | null>(null);

  const { withAuth } = useMiddleware();
  const { date: askedDate } = useDate(question.createdAt, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const handleSelectDropdownOption = (evKey: string) => {
    switch (evKey as 'report') {
      case 'report':
        withAuth(props.openReportQuestionModal.bind(null, question._id));
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

    const items = question.answers.filter(a => a._id !== mostHelpfulAnswer?._id);
    items.sort((prev, next) => +new Date(next.createdAt) - +new Date(prev.createdAt)); // Sort by newest first
    return items;
  }, [question.answers, mostHelpfulAnswer]);

  const businessReviewersSet = useMemo(() => {
    if (props.business?.reviewers?.length) return new Set(props.business.reviewers);
    return null;
  }, [props.business?.reviewers]);

  const openReportAnswerModal = (qid: string) => setAnswerIdReport(qid);

  const questionDetailsUrl = useMemo(
    () =>
      genQuestionDetailsPageUrl({
        businessName: props.business!.businessName!,
        qId: props._id,
        qText: props.questionText.flat().join(' '),
        city: props.business?.city,
        stateCode: props.business?.stateCode,
      }),
    [],
  );

  return (
    <section className={cls(styles.question, props.show ? 'd-block' : 'd-none')}>
      <div className={styles.questionHeader}>
        <figure>
          <Image
            src={question.askedBy.imgUrl}
            layout="fill"
            objectFit="cover"
            style={{ borderRadius: '50%' }}
          />
        </figure>

        <small className="">
          <Link href={genUserProfileUrl(question.askedBy)} passHref>
            <a className="text-black link">
              {getFullName(question.askedBy, { lastNameInitial: true })}
            </a>
          </Link>{' '}
          asked a question on {askedDate}
        </small>

        <small className={styles.location}>
          <Icon icon="material-symbols:location-on" width={15} color="#2c2c2c" />
          {props.askedBy?.city} •{' '}
          {qtyUtils.quantitize(props.askedBy.contributions?.length || 0, [
            'contribution',
            'contributions',
          ])}{' '}
        </small>

        {/* Actions dropdown */}
        <AppDropdown
          items={['Report']}
          onSelect={handleSelectDropdownOption}
          toggler={<Icon icon="material-symbols:more-vert" width={20} />}
          className={styles.options}
        />
      </div>

      {/* Question text content */}
      <div className={cls(styles.questionText, 'text-dark text-hover-dark fs-3')}>
        <Link href={questionDetailsUrl} className="link" passHref>
          <a className="w-max-content d-block">
            {domUtils.renderMultiLineText(question.questionText)}
          </a>
        </Link>
      </div>

      {/* Most helpful answer */}
      {mostHelpfulAnswer ? (
        <Answer
          {...mostHelpfulAnswer}
          questionId={question._id}
          mostHelpful
          setQuestion={setQuestion}
          openReportAnswerModal={openReportAnswerModal}
          businessReviewersSet={businessReviewersSet}
        />
      ) : null}

      {/* If no most helpful answer, show all answers. Else show a collapsible list of less helpfuls */}
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
                openReportAnswerModal={openReportAnswerModal}
                businessReviewersSet={businessReviewersSet}
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

            <Accordion.Collapse eventKey="1" className="w-100">
              <ul>
                {lessHelpfulAnswers.map(a => (
                  <Answer
                    {...a}
                    questionId={question._id}
                    key={a._id}
                    mostHelpful={a._id === mostHelpfulAnswer._id}
                    setQuestion={setQuestion}
                    openReportAnswerModal={openReportAnswerModal}
                    businessReviewersSet={businessReviewersSet}
                  />
                ))}
              </ul>
            </Accordion.Collapse>
          </Accordion>
        )}
      </>

      {/* Form for logged in user to provide a new answer */}
      <NewAnswerForm
        show
        questionId={props._id}
        setQuestion={setQuestion}
        showPostingGuidelines={props.showPostingGuidelines}
      />

      <ReportQA
        reportType="answer"
        reportObjectId={answerIdReport!}
        possibleReasons={answerReportReasonsConfig}
        show={!!answerIdReport}
        close={() => setAnswerIdReport(null)}
      />
    </section>
  );
};

export default QuestionItem;
