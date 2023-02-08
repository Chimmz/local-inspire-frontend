import React, { FormEventHandler, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import cls from 'classnames';
import { Icon } from '@iconify/react';
import useInput from '../../hooks/useInput';
import { newQuestionValidatorsConfig } from '../business-listings/questions/config';
import TextInput from '../shared/text-input/TextInput';
import LabelledCheckbox from '../shared/LabelledCheckbox';
import LoadingButton from '../shared/button/Button';
import useRequest from '../../hooks/useRequest';
import api from '../../library/api';
import useSignedInUser from '../../hooks/useSignedInUser';
import useMiddleware, { AuthMiddlewareNext } from '../../hooks/useMiddleware';
import { QuestionItemProps } from '../business-listings/questions/QuestionItem';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useRouter } from 'next/router';
import navigateTo, { genQuestionDetailsPageUrl } from '../../utils/url-utils';
import { BusinessProps } from '../business-results/Business';
import AppTooltip from '../AppTooltip';

interface Props {
  className?: string;
  businessName: string;
  businessId: string;
  withUserPhoto?: boolean;
  submitting: boolean;
  sendSubmitReq: (req: Promise<any>) => Promise<any>;
  pushQuestion?: (q: QuestionItemProps) => void;
  openGuidelinesModal(): void;
  openSuccessModal?: () => void;
}

const NewQuestionSection = function (props: Props) {
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
    console.log('Text: ', newQuestion.length);
    const res = await props.sendSubmitReq(
      api.askQuestionAboutBusiness(newQuestion, props.businessId, token!),
    );
    console.log('New question resp: ', res);
    if (res.status !== 'SUCCESS') return;

    const newQue = res.question as QuestionItemProps;
    props.openSuccessModal?.();
    clearNewQuestionText();

    if (props.pushQuestion) {
      props.pushQuestion(newQue);
      return window.scrollTo(0, 0);
    }
    // Else
    window.location.href = genQuestionDetailsPageUrl({
      businessName: newQue.business?.businessName!,
      city: newQue.business?.city!,
      stateCode: newQue.business?.stateCode!,
      qId: newQue._id!,
      qText: newQue.questionText.join(' ')!,
      scrollToAnswerForm: false,
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();
    if (runNewQuestionValidators().errorExists) return;
    withAuth(submitQuestion);
  };

  return (
    <form className={props.className} onSubmit={handleSubmit} id="#new-question">
      <small className="" style={{ lineHeight: '.1' }}>
        <strong className="mb-3 d-inline-block"> Questions?</strong> Get answers from{' '}
        <strong>{props.businessName}</strong> staff and past visitors.
      </small>

      <div className="d-flex align-items-start gap-3">
        {props.withUserPhoto ? (
          <figure>
            <Image
              src={isSignedIn ? loggedInUser.imgUrl! : '/img/default-profile-pic.jpeg'}
              width={35}
              height={35}
              style={{ borderRadius: '50%' }}
            />
          </figure>
        ) : null}

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

      <small
        className="mb-1 d-flex align-items-center gap-4"
        style={{ marginLeft: props.withUserPhoto ? '45px' : '0' }}
      >
        Note: your question will be posted publicly on this page
        <AppTooltip text="Posting guidelines">
          <span onClick={props.openGuidelinesModal}>
            <Icon icon="material-symbols:info" width={15} />
          </span>
        </AppTooltip>
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
};
export default NewQuestionSection;
