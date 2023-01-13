import { maxLength, minLength } from '../../../utils/validators/inputValidators';

const MAX_CHARS_FOR_NEW_QUESTION = 150;
const MIN_CHARS_FOR_NEW_QUESTION = 5;

export const newQuestionValidators = [
  {
    fn: minLength,
    params: [
      MIN_CHARS_FOR_NEW_QUESTION,
      `Enter at least ${MIN_CHARS_FOR_NEW_QUESTION} characters to submit a question`,
    ],
  },
  {
    fn: maxLength,
    params: [
      MAX_CHARS_FOR_NEW_QUESTION,
      `You have entered more than ${MAX_CHARS_FOR_NEW_QUESTION} characters to submit a question`,
    ],
  },
];
