import * as validators from '../../../utils/validators/inputValidators';

const MAX_CHARS_FOR_NEW_QUESTION = 150;
const MIN_CHARS_FOR_NEW_QUESTION = 5;

export const newQuestionValidators = [
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
