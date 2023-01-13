import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import QuestionItem, { QuestionItemProps } from './QuestionItem';

import api from '../../../library/api';
import { maxLength, minLength } from '../../../utils/validators/inputValidators';

import useInput from '../../../hooks/useInput';
import useRequest from '../../../hooks/useRequest';
import useSignedInUser from '../../../hooks/useSignedInUser';
import useToggle from '../../../hooks/useToggle';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

import cls from 'classnames';
import { Icon } from '@iconify/react';
import TextInput from '../../shared/text-input/TextInput';
import LoadingButton from '../../shared/button/Button';
import Accordion from 'react-bootstrap/Accordion';
import styles from './QuestionsSection.module.scss';
import LabelledCheckbox from '../../shared/LabelledCheckbox';
import Image from 'next/image';
import CustomAccordionToggle from '../../shared/accordion/CustomAccordionToggle';
import * as config from './config';

interface Props {
  readonly show: boolean;
  questions: QuestionItemProps[] | undefined;
  readonly businessId: string;
  readonly businessName: string | undefined;
}

const MAX_CHARS_FOR_NEW_QUESTION = 150;
const MIN_CHARS_FOR_NEW_QUESTION = 5;

const QuestionsSection = function (props: Props) {
  const { show } = props;
  const [questions, setQuestions] = useState(props.questions);

  const { accessToken } = useSignedInUser();
  const { send: sendSubmitQuestionReq, loading: isPostingQuestion } = useRequest({
    autoStopLoading: true,
  });
  const { state: showNewForm, toggle: toggleShowNewForm } = useToggle();

  const {
    inputValue: newQuestion,
    handleChange: handleChangeNewQuestion,
    validationErrors: newQuestionValidators,
    runValidators: runNewQuestionValidators,
    clearInput: clearNewQuestion,
  } = useInput({ init: '', validators: [...config.newQuestionValidators] });

  const postNewQuestion: React.FormEventHandler<HTMLFormElement> = async ev => {
    ev.preventDefault();
    if (runNewQuestionValidators().errorExists) return;

    const data = await sendSubmitQuestionReq(
      api.askQuestionAboutBusiness(newQuestion, props.businessId, accessToken!),
    );
    console.log({ data });

    if (data?.status) {
      setQuestions(items => [data.question, ...(items || [])]);
      clearNewQuestion();
      // window.scrollBy(0, window.pageYOffset + 1);
    }
  };

  return (
    <>
      <Accordion
        defaultActiveKey="0"
        className={cls(styles.queSectionHeading, props.show ? 'd-grid' : 'd-none')}
      >
        <h2 className="">Questions & Answers</h2>
        <small className={styles.allQuestionsLink}>
          <Link href={'/'}>See all 14 questions</Link>
        </small>

        <CustomAccordionToggle
          eventKey="1"
          className={cls(styles.btnNewQuestion, 'btn btn-bg-none no-bg-hover')}
        >
          <Icon
            icon={`material-symbols:${showNewForm ? 'close-rounded' : 'add'}`}
            width={20}
          />
          Ask new question
        </CustomAccordionToggle>
        <Accordion.Collapse eventKey="1" className={cls('mt-5', styles.collapsedContent)}>
          <form
            className={cls(styles.newQuestionForm)}
            // style={{ flexBasis: '50%', justifySelf: 'center' }}
            onSubmit={postNewQuestion}
          >
            <small className="fs-4">
              <strong className="mb-3 d-inline-block"> Got Questions?</strong> Get answers
              from <strong>{props.businessName}</strong> staff and past visitors.
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
        <QuestionItem {...que} show={props.show} key={que._id} />
      ))}
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
