import { Icon } from '@iconify/react';
import cls from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo, FormEventHandler, useRef } from 'react';
import { Accordion } from 'react-bootstrap';
import useMiddleware from '../../hooks/useMiddleware';
import useDate from '../../hooks/useDate';
import useInput from '../../hooks/useInput';
import useSignedInUser from '../../hooks/useSignedInUser';
import api from '../../library/api';
import {
  genQuestionDetailsPageUrl,
  genRecommendBusinessPageUrl,
} from '../../utils/url-utils';
import { getFullName } from '../../utils/user-utils';
import { isRequired, minLength } from '../../utils/validators/inputValidators';
import { QuestionItemProps } from '../business-listings/questions/QuestionItem';
import CustomAccordionToggle from '../shared/accordion/CustomAccordionToggle';
import LoadingButton from '../shared/button/Button';
import AppDropdown from '../shared/dropdown/AppDropdown';
import LabelledCheckbox from '../shared/LabelledCheckbox';
import TextInput from '../shared/text-input/TextInput';

import styles from './styles.module.scss';
import * as domUtils from '../../utils/dom-utils';
import { quantitize } from '../../utils/quantity-utils';

type Props = QuestionItemProps & {
  businessId: string;
  businessName: string;
  location: string;
  onAnswerSuccess: Function;
  sendSubmitAnswerReq: (req: Promise<any>) => Promise<any>;
  submittingNewAnswer: boolean;
  successModalShown: boolean;
  guidelinesModalShown: boolean;
  triggerGuidelinesModalOpen(): void;
  setReportedQueId: React.Dispatch<React.SetStateAction<string | null>>;
};

const MIN_ANSWER_LENGTH = 2;

function Question(props: Props) {
  const [answersCount, setAnswersCount] = useState(props.answersCount);

  const { date: askedDate } = useDate(props.createdAt, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const { withAuth } = useMiddleware();

  const currentUser = useSignedInUser();
  const accordionTogglerRef = useRef<HTMLButtonElement | null>(null);
  const askedBy = getFullName(props.askedBy, { lastNameInitial: true });

  const {
    inputValue: newAnswer,
    handleChange: handleChangeNewAnswer,
    validationErrors: newAnswerValidators,
    runValidators: runNewAnswerValidators,
    clearInput: clearNewAnswerText,
  } = useInput({
    init: '',
    validators: [
      { fn: isRequired, params: ['This field cannot be empty for a new question'] },
    ],
  });

  const submitAnswer = async function (token?: string) {
    const res = await props.sendSubmitAnswerReq(
      api.addAnswerToBusinessQuestion(props._id, newAnswer, token!),
    );
    if (res.status === 'SUCCESS') {
      setAnswersCount(res.question?.answersCount);
      props.onAnswerSuccess();
      clearNewAnswerText();
      accordionTogglerRef.current!.click();
    }
  };

  const handleSelectDropdownOption = (evKey: string) => {
    switch (evKey) {
      case 'report':
        withAuth(props.setReportedQueId.bind(null, props._id));
        break;
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async ev => {
    ev.preventDefault();
    if (runNewAnswerValidators().errorExists) return;
    withAuth(submitAnswer);
  };

  const questionDetailsUrl = genQuestionDetailsPageUrl({
    qId: props._id,
    businessName: props.businessName,
    qText: props.questionText.join(' '),
    location: props.location,
  });

  const answersInfo = useMemo(() => {
    if (!answersCount) return 'No answers yet';
    return `Show ${quantitize(answersCount, ['answer', 'answers'])}`;
  }, [answersCount]);

  return (
    <li>
      <Accordion className={cls('d-flex align-items-start gap-5 flex-wrap')}>
        <div className="flex-grow-1" style={{ flexBasis: '82%' }}>
          <p className="parag text-dark fs-4 mb-0">
            {domUtils.renderMultiLineText(props.questionText)}
          </p>
          <small className="fs-5 text-light">
            Asked by{' '}
            <strong>
              <Link href={'/'}>{askedBy}</Link>
            </strong>{' '}
            on {askedDate}
          </small>
        </div>

        <AppDropdown
          items={['Report']}
          onSelect={handleSelectDropdownOption}
          toggler={<Icon icon="material-symbols:more-vert" width={20} />}
        />

        <Link href={questionDetailsUrl} passHref>
          <a className="btn btn-bg-none no-bg-hover text-pry">{answersInfo}</a>
        </Link>

        <CustomAccordionToggle
          eventKey="4"
          className="btn btn-bg-none no-bg-hover text-pry justify-content-start w-max-content"
          style={{ flexBasis: '60%' }}
          contentOnExpand={
            <strong className="text-pry" ref={accordionTogglerRef}>
              Cancel
            </strong>
          }
        >
          <strong className="">Answer this question</strong>
        </CustomAccordionToggle>

        <Accordion.Collapse eventKey="4">
          <form
            className={cls(styles.newQuestionForm, 'd-flex gap-3 flex-wrap')}
            onSubmit={handleSubmit}
          >
            <div className="d-flex align-items-start gap-3 w-100">
              <Image
                src={currentUser.imgUrl || '/img/default-profile-pic.jpeg'}
                width={35}
                height={35}
                style={{ borderRadius: '50%' }}
              />

              <TextInput
                as="textarea"
                value={newAnswer}
                onChange={handleChangeNewAnswer}
                validationErrors={newAnswerValidators}
                className="textfield w-100 d-block flex-grow-1"
              />
            </div>
            <div className="d-flex gap-3 justify-content-between w-100">
              <LoadingButton
                className="btn btn-pry"
                type="submit"
                isLoading={props.submittingNewAnswer}
                textWhileLoading="Posting..."
              >
                Post answer
              </LoadingButton>
              <button
                className="btn btn-bg-none no-bg-hover"
                type="button"
                onClick={props.triggerGuidelinesModalOpen}
              >
                Posting guidelines
              </button>
            </div>
          </form>
        </Accordion.Collapse>
      </Accordion>
    </li>
  );
}

export default Question;
