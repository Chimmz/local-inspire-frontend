import React, { useState, useEffect, useRef, useCallback } from 'react';
import useInput from '../../../hooks/useInput';

import cls from 'classnames';
import { Icon } from '@iconify/react';
import styles from './QuestionsSection.module.scss';
import TextInput from '../../shared/text-input/TextInput';
import LoadingButton from '../../shared/button/Button';
import useRequest from '../../../hooks/useRequest';
import useSignedInUser from '../../../hooks/useSignedInUser';
import api from '../../../library/api';
import { QuestionItemProps } from './QuestionItem';

interface NewAnswerFormProps {
  show: boolean;
  questionId: string;
  setQuestion: React.Dispatch<React.SetStateAction<QuestionItemProps>>;
}

const NewAnswerForm: React.FC<NewAnswerFormProps> = props => {
  const [inputType, setInputType] = useState<'input' | 'textarea'>('input');

  const { send: sendAnswerReq, loading: isSendingAnswer } = useRequest({
    autoStopLoading: true,
  });
  const { accessToken } = useSignedInUser();
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    inputValue: newAnswer,
    handleChange: handleChangeAnswer,
    validationErrors,
    clearInput: clearNewAnswer,
  } = useInput({ init: '' });

  const handleSubmit = useCallback(async () => {
    const textarea = formRef.current!.querySelector('textarea')!;

    const data = await sendAnswerReq(
      api.addAnswerToBusinessQuestion(
        props.questionId,
        textarea.value.trim(),
        accessToken!,
      ),
    );
    console.log({ data });

    if (data?.status === 'SUCCESS') {
      props.setQuestion(data.question);
      clearNewAnswer();
    }
  }, [props.questionId, sendAnswerReq, api.addAnswerToBusinessQuestion, accessToken]);

  useEffect(() => {
    if (inputType === 'textarea')
      formRef.current!.parentElement?.querySelector('textarea')?.focus();
  }, [inputType]);

  if (!props.show) return <></>;
  return (
    <form
      className={cls(
        styles.newAnswerSection,
        `d-flex align-items-center gap-3 mt-5 ${inputType === 'textarea' && 'flex-wrap'}`,
      )}
      ref={formRef}
      onSubmit={ev => {
        ev.preventDefault();
        handleSubmit();
      }}
    >
      <small className="d-flex align-items-center gap-2 w-max-content">
        <Icon icon="mdi:user-circle" width={30} color="#aaa" />{' '}
        {inputType === 'textarea' ? 'You' : ''}
      </small>
      <TextInput
        value={newAnswer}
        onChange={handleChangeAnswer}
        className="textfield"
        placeholder="Write your answer here..."
        as={inputType}
        onFocus={setInputType.bind(null, 'textarea')}
        // onBlur={setTimeout.bind(null, setInputType.bind(null, 'input'), 50)}
      />

      {newAnswer.length ? (
        <LoadingButton
          className="btn btn-pry"
          type="submit"
          isLoading={isSendingAnswer}
          textWhileLoading="Posting..."
        >
          Save answer
        </LoadingButton>
      ) : // <button className="btn btn-pry" type="submit">
      //   Save answer
      // </button>
      null}

      {inputType === 'textarea' && (
        <button
          className="btn btn-bg-none ml-auto"
          type="submit"
          onClick={setInputType.bind(null, 'input')}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default NewAnswerForm;
