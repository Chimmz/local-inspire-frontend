import React, { useEffect, useRef, useState, FormEventHandler } from 'react';

import useInput from '../../hooks/useInput';
import useRequest from '../../hooks/useRequest';
import useMiddleware from '../../hooks/useMiddleware';

import { minLength } from '../../utils/validators/inputValidators';

import { Icon } from '@iconify/react';
import TextInput from '../shared/text-input/TextInput';
import PageSuccess from '../shared/success/PageSuccess';
import styles from './Aside.module.scss';
import api from '../../library/api';
import { BusinessProps } from '../business-results/Business';
import useSignedInUser from '../../hooks/useSignedInUser';
import LoadingButton from '../shared/button/Button';
import Link from 'next/link';
import { genQuestionDetailsPageUrl } from '../../utils/url-utils';
import { QuestionItemProps } from './questions/QuestionItem';

const MIN_QUE_LENGTH = 10;

interface Props {
  business: Partial<BusinessProps> | undefined;
}

function Aside(props: Props) {
  const [submittedQuestion, setSubmittedQuestion] = useState(false);
  const [newQuestionUrl, setNewQuestionUrl] = useState('');

  const {
    inputValue: question,
    handleChange,
    validationErrors,
    runValidators: runQuestionValidators,
    clearInput: clearQuestion,
  } = useInput({
    init: '',
    validators: [
      {
        fn: minLength,
        params: [MIN_QUE_LENGTH, `Please enter up to ${MIN_QUE_LENGTH} characters`],
      },
    ],
  });

  const { withAuth } = useMiddleware();
  const { send: sendSubmitReq, loading: submitting } = useRequest({ autoStopLoading: true });

  const handleSubmitQuestion: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();
    if (runQuestionValidators().errorExists) return;

    withAuth((token?: string) => {
      const req = api.askQuestionAboutBusiness(question, props.business?._id!, token!);

      sendSubmitReq(req)
        .then(res => {
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
          setTimeout(setSubmittedQuestion.bind(null, false), 10000);
        })
        .catch(console.log);
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
          <PageSuccess description="Your question has been submitted" className="mb-3" />
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
            value={question}
            className="textfield w-100"
            onChange={handleChange}
            validationErrors={validationErrors}
          />

          <LoadingButton
            isLoading={submitting}
            className={`btn btn${!question.length ? '-outline' : ''}-pry d-block w-100 mt-3`}
            type="submit"
            textWhileLoading={'Submitting...'}
          >
            Post question
          </LoadingButton>
        </form>
      )}
    </aside>
  );
}

export default Aside;
