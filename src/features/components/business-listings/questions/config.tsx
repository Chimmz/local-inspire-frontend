import * as validators from '../../../utils/validators/inputValidators';
import { Icon } from '@iconify/react';

const MAX_CHARS_FOR_NEW_QUESTION = 150;
const MIN_CHARS_FOR_NEW_QUESTION = 5;

export const newQuestionValidatorsConfig = [
  {
    fn: validators.minLength,
    params: [
      MIN_CHARS_FOR_NEW_QUESTION,
      `Please enter at least ${MIN_CHARS_FOR_NEW_QUESTION} characters to submit a question`,
    ],
  },
  {
    fn: validators.maxLength,
    params: [
      MAX_CHARS_FOR_NEW_QUESTION,
      `Please enter at most ${MAX_CHARS_FOR_NEW_QUESTION} characters to submit a question`,
    ],
  },
];

export const questionReportReasonsConfig = [
  'It is not a question',
  'It is a duplicate',
  'It is not helpful',
  'Contains threats, lewdness, or hate speach',
  'It is not specific to this business',
];

export const answerReportReasonsConfig = [
  'It does not answer the question asked',
  'It contains threats, lewdness or hate speech',
  "It violates Local Inspire's privacy standards",
  'It contains promotional material',
  'It is spam',
  'I want to report something else',
];

export const newQuestionGuidelinesConfig = {
  heading: (
    <h2 className="">
      <Icon icon="mdi:question-mark-circle" /> Tips for submitting a good question
    </h2>
  ),
  body: (businessName: string | null) => (
    <>
      <p className="parag">
        Questions & Answers is a feature that allows consumers to ask questions about a
        business and to get quick answers from representatives from the business, past
        reviewers and other members of our community..
      </p>
      <br />
      <p className="parag">Please follow the below guidelines when answering questions:</p>
      <ul>
        <li className="mb-3">
          Keep your question specific to <strong>{businessName}</strong>&apos;s page. For
          example, &apos;Will the business make menu changes to accommodate dietary
          restrictions?
        </li>
        <li className="mb-3">
          Your question will be posted publicly. Please don&apos;t submit any personal
          information you don&apos;t want revealed.
        </li>
        <li className="mb-3">This is NOT a place to vent, keep questions useful.</li>
        <li className="mb-3">
          If you have a customer service issue or a complaint, please contact{' '}
          <strong>{businessName}</strong> directly.
        </li>
        <li className="mb-3">
          We do not tolerate filthy talk, cursing, threats, harassment, lewdness, hate speech,
          and other displays of bigotry, so leave it out.
        </li>
        <li className="mb-3">
          The point of questions and answers is to help people get a better idea of where they
          are visiting, so please be as specific as you can.
        </li>
      </ul>
      <p className="parag">
        Localinspire reserves the right to remove any question or answer for any reason. This
        is not something we want to do, but our goal is to make this feature as helpful to our
        visitors as possible, so will take the needed actions to achieve this.
      </p>
    </>
  ),
};

export const postingGuidelinesConfig = {
  heading: <h2 className="">Q&A Posting Guidelines</h2>,
  body: (businessName: string | null) => (
    <>
      <p className="parag">
        Questions & Answers is a feature that allows consumers to ask questions about a
        business and to get quick answers from representatives from the business, past
        reviewers and other members of our community..
      </p>
      <br />
      <p className="parag">Please follow the below guidelines when answering questions:</p>
      <ul>
        <li className="mb-3">
          Answers should be objective and to the point. Links, contact information, and
          advertising are not permitted.
        </li>
        <li className="mb-3">
          Content must be family friendly. We do not tolerate filthy talk, cursing, threats,
          harassment, lewdness, hate speech, and other displays of bigotry, so leave it out.
        </li>
        <li className="mb-3">
          The point of questions and answers is to help people get a better idea of where they
          are visiting, so please be as specific as you can with your answers.
        </li>
        <li className="mb-3">
          Content must be original so copied and pasted questions or answers are not allowed,
          even if you own the rights to it.
        </li>
        <li className="mb-3">This is NOT a place to vent, keep answers useful.</li>
        <li className="mb-3">
          If you have a customer service issue or a complaint, please contact{' '}
          <strong>{businessName}</strong> directly.
        </li>
      </ul>
      <p className="parag">
        Localinspire reserves the right to remove any question or answer for any reason. This
        is not something we want to do, but our goal is to make this feature as helpful to our
        visitors as possible, so will take the needed actions to achieve this.
      </p>
    </>
  ),
};
