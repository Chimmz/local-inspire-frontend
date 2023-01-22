import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import api from '../../../library/api';
import * as config from './config';
import cls from 'classnames';

import useInput from '../../../hooks/useInput';
import useRequest from '../../../hooks/useRequest';
import useSignedInUser from '../../../hooks/useSignedInUser';
import useClientAuthMiddleware, {
  MiddlewareNextAction,
} from '../../../hooks/useClientMiddleware';

import { Icon } from '@iconify/react';
import LoadingButton from '../../shared/button/Button';
import TextInput from '../../shared/text-input/TextInput';
import LabelledCheckbox from '../../shared/LabelledCheckbox';
import Accordion from 'react-bootstrap/Accordion';
import CustomAccordionToggle from '../../shared/accordion/CustomAccordionToggle';
import QuestionItem, { QuestionItemProps } from './QuestionItem';
import styles from './QuestionsSection.module.scss';
import BusinessesToConsider from './BusinessesToConsider';
import { getBusinessQuestionsUrl } from '../../../utils/url-utils';
import { BusinessProps } from '../../business-results/Business';

interface Props {
  readonly show: boolean;
  readonly questions: QuestionItemProps[] | undefined;
  business: BusinessProps | undefined;
  readonly slug: string;
  questionsCount: number;
}

const QuestionsSection = function (props: Props) {
  const [questions, setQuestions] = useState(props.questions);
  const btnCloseAccordionRef = useRef<HTMLButtonElement | null>(null);

  const { send: sendSubmitQuestionReq, loading: isPostingQuestion } = useRequest({
    autoStopLoading: true,
  });
  const { withAuth } = useClientAuthMiddleware();

  const {
    inputValue: newQuestion,
    handleChange: handleChangeNewQuestion,
    validationErrors: newQuestionValidators,
    runValidators: runNewQuestionValidators,
    clearInput: clearNewQuestionText,
  } = useInput({ init: '', validators: [...config.newQuestionValidators] });

  const postNewQuestion: MiddlewareNextAction = async (token?: string) => {
    const data = await sendSubmitQuestionReq(
      api.askQuestionAboutBusiness(newQuestion, props.business?._id!, token!),
    );
    console.log({ data });

    if (data?.status) {
      setQuestions(items => [data.question, ...(items || [])]);
      clearNewQuestionText();
      btnCloseAccordionRef.current!.click();
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();
    if (runNewQuestionValidators().errorExists) return;
    withAuth(postNewQuestion);
  };

  const questionsPageUrl = getBusinessQuestionsUrl<string>({ slug: props.slug });

  return (
    // This is the Q&A header section containing the Ask question accordion
    <>
      <Accordion
        defaultActiveKey="0"
        className={cls(styles.queSectionHeading, props.show ? 'd-grid' : 'd-none')}
      >
        <h2 className="">Questions & Answers</h2>
        {questions?.length ? (
          <Link href={questionsPageUrl} passHref>
            <a className="text-pry">See all {props.questionsCount} questions</a>
          </Link>
        ) : null}

        <CustomAccordionToggle
          eventKey="1"
          className={cls(styles.btnNewQuestion, 'btn btn-bg-none no-bg-hover text-pry')}
          contentOnExpand={
            <span className="btn btn-bg-none text-pry" ref={btnCloseAccordionRef}>
              Close
            </span>
          }
        >
          <Icon icon="material-symbols:add" width={20} />
          Ask new question
        </CustomAccordionToggle>
        <Accordion.Collapse
          eventKey="1"
          className={cls('mt-5', styles.collapsedContent)}
          appear
        >
          <form className={cls(styles.newQuestionForm)} onSubmit={handleSubmit}>
            <small className="fs-4">
              <strong className="mb-3 d-inline-block"> Got Questions?</strong> Get answers
              from <strong>{props.business?.businessName}</strong> staff and past visitors.
            </small>

            <div className={styles.defaultImg}>
              <Image
                src="/img/default-profile-pic.jpeg"
                width={35}
                height={35}
                style={{ borderRadius: '50%' }}
              />
            </div>

            <TextInput
              as="textarea"
              value={newQuestion}
              onChange={handleChangeNewQuestion}
              validationErrors={newQuestionValidators}
              className="textfield w-100 d-block"
            />
            <small className="mb-3 d-block">
              Note: your question will be posted publicly here and on the Questions & Answers
              page
            </small>
            <LabelledCheckbox
              label={<small>Get notified about new answers to your questions</small>}
              onChange={() => {}}
            />
            <LoadingButton
              className="btn btn-pry mt-3 w-100"
              type="submit"
              isLoading={isPostingQuestion}
              textWhileLoading="Posting..."
            >
              Post question
            </LoadingButton>
          </form>
        </Accordion.Collapse>
      </Accordion>

      {questions?.map(que => (
        <QuestionItem
          {...que}
          show={props.show && !!questions?.length}
          key={que._id}
          business={props.business}
        />
      ))}

      <BusinessesToConsider show={!questions?.length && props.show} />
    </>
  );
};

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
