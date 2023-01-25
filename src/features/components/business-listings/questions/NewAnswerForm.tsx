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
import useClientMiddleware, {
  MiddlewareNextAction,
} from '../../../hooks/useClientMiddleware';
import Image from 'next/image';
import GuidelinesPopup from '../../GuidelinesPopup';

interface NewAnswerFormProps {
  show: boolean;
  questionId: string;
  setQuestion: React.Dispatch<React.SetStateAction<QuestionItemProps>>;
  showPostingGuidelines: () => void;
}

const NewAnswerForm: React.FC<NewAnswerFormProps> = props => {
  const [inputType, setInputType] = useState<'input' | 'textarea'>('input');
  const formRef = useRef<HTMLFormElement | null>(null);

  const { send: sendAnswerReq, loading: isSendingAnswer } = useRequest({
    autoStopLoading: true,
  });
  const currentUser = useSignedInUser();
  const { withAuth } = useClientMiddleware();

  const {
    inputValue: newAnswer,
    handleChange: handleChangeAnswer,
    clearInput: clearNewAnswer,
  } = useInput({ init: '' });

  const postAnswer: MiddlewareNextAction = useCallback(
    async (token?: string) => {
      const textarea = formRef.current!.querySelector('textarea')!;

      const data = await sendAnswerReq(
        api.addAnswerToBusinessQuestion(props.questionId, textarea.value.trim(), token!),
      );
      console.log({ data });

      if (data?.status === 'SUCCESS') {
        props.setQuestion(data.question);
        clearNewAnswer();
        setInputType('input');
      }
    },
    [
      props.questionId,
      sendAnswerReq,
      api.addAnswerToBusinessQuestion,
      currentUser.accessToken,
    ],
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();
    withAuth(postAnswer);
  };

  useEffect(() => {
    if (inputType === 'textarea')
      formRef.current!.parentElement?.querySelector('textarea')?.focus();
  }, [inputType]);

  if (!props.show) return <></>;
  return (
    <>
      <form
        className={cls(
          styles.newAnswerSection,
          `d-flex align-items-center gap-3 mt-5 ${inputType === 'textarea' && 'flex-wrap'}`,
        )}
        ref={formRef}
        onSubmit={handleSubmit}
      >
        {currentUser ? (
          <Image
            src={currentUser.imgUrl!}
            width={30}
            height={30}
            objectFit="cover"
            style={{ borderRadius: '50%' }}
            // onError={setSrc.bind(null, '/img/default-profile-pic.jpeg')}
          />
        ) : (
          <small className="d-flex align-items-center gap-2 w-max-content">
            <Icon icon="mdi:user-circle" width={30} color="#aaa" />{' '}
          </small>
        )}

        {inputType === 'textarea' ? <small> You</small> : null}

        <TextInput
          value={newAnswer}
          onChange={handleChangeAnswer}
          className="textfield"
          placeholder="Write your answer here..."
          as={inputType}
          onFocus={setInputType.bind(null, 'textarea')}
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

        <small
          className={cls(
            'btn btn-sm text-pry btn-bg-none no-bg-hover ms-auto',
            inputType === 'textarea' ? 'd-block' : 'd-none',
          )}
          onClick={props.showPostingGuidelines}
        >
          Posting guidelines
        </small>
      </form>
    </>
  );
};

export default NewAnswerForm;
