import { useState } from 'react';
import * as inputValidators from '../utils/validators/inputValidators';
import { Validator, ValidationFeedback, FeedbackType } from '../utils/validators/types';

export interface ValidatorConfig<T> {
  fn: Validator<T>;
  params: any[];
}
export type ValidationError = ValidationFeedback & { type: 'failed' };
export type ValidatorRunner = () => { errorExists: boolean; errors: ValidationError[] };
export type ValidationErrorPusher = (err: string) => void;

interface UseValidatorParams<T extends string | string[] | number | Date = string> {
  inputValue: T;
  validators: ValidatorConfig<T>[];
}

function useValidator<T extends string | string[] | number | Date>({
  inputValue,
  validators,
}: UseValidatorParams<T>) {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const pushValidationError: ValidationErrorPusher = (errMsg: string) => {
    const error = inputValidators.createFeedback('failed', errMsg) as ValidationError;
    setValidationErrors(prevState => [error, ...prevState]);
  };

  const runValidators: ValidatorRunner = function () {
    console.log('Input in running validator: ', inputValue);

    const getFeedback = ({ fn, params }: ValidatorConfig<T>): ValidationFeedback => {
      const validator = fn.bind({ userInput: inputValue });
      const result = validator(...params);
      return result;
    };

    // For each validator, get a corresponding feedback and filter error-based feedbacks
    const errors = validators
      .map(getFeedback)
      .filter(feedback => feedback.type === 'failed') as unknown as ValidationError[];

    setValidationErrors(errors);
    return { errorExists: !!errors.length, errors };
  };

  return { runValidators, validationErrors, setValidationErrors, pushValidationError };
}

export default useValidator;
export type UseValidator = ReturnType<typeof useValidator>;
