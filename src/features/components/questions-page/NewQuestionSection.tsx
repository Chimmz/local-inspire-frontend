import React, { FormEventHandler } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import cls from 'classnames';
import { Icon } from '@iconify/react';
import useInput from '../../hooks/useInput';
import * as config from '../business-listings/questions/config';
import TextInput from '../shared/text-input/TextInput';
import LabelledCheckbox from '../shared/LabelledCheckbox';
import LoadingButton from '../shared/button/Button';
import styles from './styles.module.scss';
import useRequest from '../../hooks/useRequest';
import api from '../../library/api';
import useSignedInUser from '../../hooks/useSignedInUser';
import useClientAuthMiddleware, {
  AuthMiddlewareNextAction,
  MiddlewareNextAction,
} from '../../hooks/useClientMiddleware';
import { QuestionItemProps } from '../business-listings/questions/QuestionItem';

interface Props {
  businessName: string;
  businessId: string;
  sendSubmitReq: (req: Promise<any>) => Promise<any>;
  submitting: boolean;
  pushQuestion: (q: QuestionItemProps) => void;
}

function NewQuestionSection(props: Props) {
  const {
    inputValue: newQuestion,
    handleChange: handleChangeNewQuestion,
    validationErrors: newQuestionValidators,
    runValidators: runNewQuestionValidators,
    clearInput: clearNewQuestionText,
  } = useInput({ init: '', validators: [...config.newQuestionValidators] });

  const { isSignedIn, ...loggedInUser } = useSignedInUser();
  const { withAuth } = useClientAuthMiddleware();

  const submitQuestion: AuthMiddlewareNextAction = async (token: string) => {
    const res = await props.sendSubmitReq(
      api.askQuestionAboutBusiness(newQuestion, props.businessId, token),
    );
    console.log('New question resp: ', res);
    if (res.status === 'SUCCESS') {
      props.pushQuestion(res.question as QuestionItemProps);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();
    if (runNewQuestionValidators().errorExists) return;
    withAuth(submitQuestion);
  };

  return (
    <form className={cls(styles.newQuestionForm)} onSubmit={handleSubmit}>
      <small className="fs-4">
        <strong className="mb-3 d-inline-block"> Questions?</strong> Get answers from{' '}
        <strong>{props.businessName}</strong> staff and past visitors.
      </small>

      <div className={styles.defaultImg}>
        <Image
          src={isSignedIn ? loggedInUser.imgUrl! : '/img/default-profile-pic.jpeg'}
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
        Note: your question will be posted publicly on this page
      </small>
      <LabelledCheckbox
        label={<small>Get notified about new answers to your questions</small>}
        onChange={() => {}}
      />
      <LoadingButton
        className="btn btn-pry mt-3 w-100"
        type="submit"
        isLoading={props.submitting}
        textWhileLoading="Posting..."
        // onClick={ha}
      >
        Post question
      </LoadingButton>
    </form>
  );
}
export default NewQuestionSection;
