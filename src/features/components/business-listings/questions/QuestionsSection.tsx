import React, { useMemo, useState } from 'react';
import QuestionItem, { QuestionItemProps } from './QuestionItem';

import cls from 'classnames';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import styles from './QuestionsSection.module.scss';
import TextInput from '../../shared/text-input/TextInput';
import useInput from '../../../hooks/useInput';
import { maxLength, minLength } from '../../../utils/validators/inputValidators';
import LoadingButton from '../../shared/button/Button';
import api from '../../../library/api';
import useRequest from '../../../hooks/useRequest';
import useSignedInUser from '../../../hooks/useSignedInUser';
import { simulateRequest } from '../../../utils/async-utils';
import useToggle from '../../../hooks/useToggle';

interface Props {
  readonly show: boolean;
  questions: QuestionItemProps[] | undefined;
  readonly businessId: string;
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
  } = useInput({
    init: '',
    validators: [
      {
        fn: maxLength,
        params: [
          MAX_CHARS_FOR_NEW_QUESTION,
          `You have entered more than ${MAX_CHARS_FOR_NEW_QUESTION} characters}`,
        ],
      },
      {
        fn: minLength,
        params: [5, `Enter at least ${MIN_CHARS_FOR_NEW_QUESTION} characters}`],
      },
    ],
  });

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
      toggleShowNewForm();
      // window.scrollBy(0, window.pageYOffset + 1);
    }
  };

  const newQuestionForm = useMemo(
    () =>
      showNewForm && (
        <form
          className={cls(styles.newQuestionForm, 'flex-grow-1')}
          // style={{ flexBasis: '50%', justifySelf: 'center' }}
          onSubmit={postNewQuestion}
        >
          <TextInput
            as="textarea"
            value={newQuestion}
            onChange={handleChangeNewQuestion}
            validationErrors={newQuestionValidators}
            className="textfield w-100 d-block flex-grow-1"
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
      ),
    [newQuestion, handleChangeNewQuestion, postNewQuestion],
  );
  return (
    <>
      <section
        className={cls(
          show ? 'd-flex' : 'd-none',
          'align-items-center justify-content-between gap-3 flex-wrap',
        )}
      >
        <h2 className="" style={{ flexBasis: '50%' }}>
          Questions & Answers
        </h2>
        {/* <small>
          <Link href={'/'}>See all 14 questions</Link>
        </small> */}
        <button className="btn btn-gray" onClick={toggleShowNewForm}>
          <Icon
            icon={`material-symbols:${showNewForm ? 'close-rounded' : 'add'}`}
            width={20}
          />
          {showNewForm ? 'Close' : 'Ask new question'}
        </button>
        {newQuestionForm}
      </section>

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
