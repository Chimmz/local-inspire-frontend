import React, { useEffect, useRef, useState } from 'react';

import useInput from '../../hooks/useInput';
import useRequest from '../../hooks/useRequest';
import useMiddleware from '../../hooks/useMiddleware';

import { isRequired, minLength } from '../../utils/validators/inputValidators';

import { Icon } from '@iconify/react';
import TextInput from '../shared/text-input/TextInput';
import SuccessFeedback from '../shared/success/SuccessFeedback';
import styles from './Aside.module.scss';
import api from '../../library/api';
import { BusinessProps } from '../business-results/Business';
import useSignedInUser from '../../hooks/useSignedInUser';
import LoadingButton from '../shared/button/Button';
import Link from 'next/link';
import { genQuestionDetailsPageUrl } from '../../utils/url-utils';
import { QuestionItemProps } from './questions/QuestionItem';
import AppTooltip from '../AppTooltip';
import PopupInfo from '../PopupInfo';
import { newQuestionGuidelinesConfig } from './questions/config';

const MIN_QUE_LENGTH = 7;

interface Props {
  business: Partial<BusinessProps> | undefined;
}

function Aside(props: Props) {
  const [submittedQuestion, setSubmittedQuestion] = useState(false);
  const [showNewQuestionGuidelines, setShowNewQuestionGuidelines] = useState(false);

  const [newQuestionUrl, setNewQuestionUrl] = useState('');
  const { withAuth } = useMiddleware();
  const { send: sendSubmitReq, loading: submitting } = useRequest({ autoStopLoading: true });

  const {
    inputValue: newQuestion,
    handleChange,
    validationErrors,
    runValidators: runQuestionValidators,
    clearInput: clearQuestion,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['Cannot be empty'] }],
  });

  const handleSubmitQuestion: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();
    if (runQuestionValidators().errorExists) return;

    withAuth(async (token?: string) => {
      const req = api.askQuestionAboutBusiness(newQuestion, props.business?._id!, token!);
      const res = await sendSubmitReq(req);
      if (res?.status !== 'SUCCESS') return;
      const question = res.question as QuestionItemProps;

      setNewQuestionUrl(
        genQuestionDetailsPageUrl({
          ...question.business!,
          qText: question.questionText.join(' '),
          qId: question._id,
        }),
      );
      setSubmittedQuestion(true);
      clearQuestion();
      // setTimeout(setSubmittedQuestion.bind(null, false), 30000);
    });
  };

  return (
    <aside className={styles.right}>
      <section className={styles.about}>
        <h2>About the Business</h2>
        <p className="parag mb-3 mt-3">
          At Crystals Cabin we strive on comfort, cleanliness, and an all around good time. We
          welcome you to join us for a weekend getaway.
        </p>
        <p className="parag mb-5">
          <strong> Fannies BBQ</strong> was established in 1985.
        </p>
        <button className="btn btn-outline-sec d-block w-100">Send owner a message</button>
      </section>

      <section className={styles.getUpdated}>
        <h2> Get Updated! </h2>
        <p className="parag mb-4 mt-3">
          Get updates, specials and more by saving this business to one of your lists...
        </p>
        <button className="btn btn-outline-sec d-block w-100 d-flex xy-center gap-2">
          <Icon icon="material-symbols:view-list" width={22} /> Save to a list
        </button>
      </section>

      <section className={styles.businessObjectives}>
        <h2 className="mb-4">We as a family owned business</h2>
        <ul className="no-bullets d-flex flex-column gap-3">
          <li className="d-flex gap-4">
            <Icon icon="material-symbols:done-rounded" color="#e87525" width={25} />
            Seek to grow trust and growth in our community and businesses.
          </li>
          <li className="d-flex gap-4">
            <Icon icon="material-symbols:done-rounded" color="#e87525" width={25} />
            Seek to grow trust and growth in our community and businesses.
          </li>
          <li className="d-flex gap-4">
            <Icon icon="material-symbols:done-rounded" color="#e87525" width={25} />
            Seek to grow trust and growth in our community and businesses.
          </li>
        </ul>
      </section>

      {submittedQuestion ? (
        <div>
          <SuccessFeedback description="Your question has been submitted" className="mb-3" />
          <Link href={newQuestionUrl} passHref>
            <a className="btn btn-gray" target="_blank">
              See question
            </a>
          </Link>
        </div>
      ) : (
        <form className={styles.askNewQuestion} onSubmit={handleSubmitQuestion}>
          <h2 className="mb-4">Ask a question</h2>
          <small className="mb-2 d-block">
            Get quick answers from Fannies BBQ staff and past visitors.
          </small>

          <TextInput
            as="textarea"
            value={newQuestion}
            className="textfield w-100"
            onChange={handleChange}
            validationErrors={validationErrors}
          />

          <div className="d-flex align-items-center justify-content-between">
            <LoadingButton
              isLoading={submitting}
              className={`btn btn${!newQuestion.length ? '-outline' : ''}-pry d-block mt-3`}
              type="submit"
              textWhileLoading={'Submitting...'}
            >
              Post question
            </LoadingButton>
            <AppTooltip text="Question guidelines">
              <Icon
                icon="ic:baseline-info"
                className="cursor-pointer"
                width={16}
                onClick={setShowNewQuestionGuidelines.bind(null, true)}
              />
            </AppTooltip>
          </div>
        </form>
      )}

      {/* Guidelines on writing a new questions */}
      <PopupInfo
        show={showNewQuestionGuidelines}
        close={setShowNewQuestionGuidelines.bind(null, false)}
        heading={newQuestionGuidelinesConfig.heading}
      >
        {newQuestionGuidelinesConfig.body(props.business?.businessName!)}
      </PopupInfo>
    </aside>
  );
}

export default Aside;
