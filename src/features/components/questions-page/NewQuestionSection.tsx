import React, { FormEventHandler } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import cls from 'classnames';
import { Icon } from '@iconify/react';
import useInput from '../../hooks/useInput';
import { newQuestionValidatorsConfig } from '../business-listings/questions/config';
import TextInput from '../shared/text-input/TextInput';
import LabelledCheckbox from '../shared/LabelledCheckbox';
import LoadingButton from '../shared/button/Button';
import styles from './styles.module.scss';
import useRequest from '../../hooks/useRequest';
import api from '../../library/api';
import useSignedInUser from '../../hooks/useSignedInUser';
import useMiddleware, { AuthMiddlewareNext } from '../../hooks/useMiddleware';
import { QuestionItemProps } from '../business-listings/questions/QuestionItem';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface Props {
  businessName: string;
  businessId: string;
  sendSubmitReq: (req: Promise<any>) => Promise<any>;
  submitting: boolean;
  pushQuestion: (q: QuestionItemProps) => void;
  openGuidelinesModal: () => void;
}

function NewQuestionSection(props: Props) {
  const {
    inputValue: newQuestion,
    handleChange: handleChangeNewQuestion,
    validationErrors: newQuestionValidators,
    runValidators: runNewQuestionValidators,
    clearInput: clearNewQuestionText,
  } = useInput({ init: '', validators: [...newQuestionValidatorsConfig] });

  const { isSignedIn, ...loggedInUser } = useSignedInUser();
  const { withAuth } = useMiddleware();

  const submitQuestion: AuthMiddlewareNext = async (token?: string) => {
    const res = await props.sendSubmitReq(
      api.askQuestionAboutBusiness(newQuestion, props.businessId, token!),
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
    clearNewQuestionText();
  };

  return (
    <form className={cls(styles.newQuestionForm)} onSubmit={handleSubmit}>
      <small className="fs-4">
        <strong className="mb-3 d-inline-block"> Questions?</strong> Get answers from{' '}
        <strong>{props.businessName}</strong> staff and past visitors.
      </small>

      <div className="d-flex align-items-start gap-3">
        <figure className={styles.defaultImg}>
          <Image
            src={isSignedIn ? loggedInUser.imgUrl! : '/img/default-profile-pic.jpeg'}
            width={35}
            height={35}
            style={{ borderRadius: '50%' }}
          />
        </figure>

        <div className="flex-grow-1">
          <TextInput
            as="textarea"
            value={newQuestion}
            onChange={handleChangeNewQuestion}
            validationErrors={newQuestionValidators}
            className="textfield w-100 d-block"
          />
        </div>
      </div>

      <small className="mb-3 d-flex align-items-center gap-4" style={{ marginLeft: '45px' }}>
        Note: your question will be posted publicly on this page{' '}
        <OverlayTrigger
          key="top-placement"
          placement="top"
          overlay={<Tooltip id={`tooltip-guidelines`}>Posting guidelines</Tooltip>}
        >
          <span onClick={props.openGuidelinesModal}>
            <Icon icon="material-symbols:info" width={17} />
          </span>
        </OverlayTrigger>
      </small>
      <LoadingButton
        className="btn btn-pry mt-3"
        type="submit"
        isLoading={props.submitting}
        textWhileLoading="Posting..."
      >
        Post question
      </LoadingButton>
    </form>
  );
}
export default NewQuestionSection;
