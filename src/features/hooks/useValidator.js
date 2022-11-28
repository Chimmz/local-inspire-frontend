import { useState } from 'react';
import * as inputValidators from '../utils/validators/inputValidators';
import { Feedback } from '../utils/validators/types';

function useValidator({ inputValue, validators }) {
  const [validationErrors, setValidationErrors] = useState([]);
  // console.log(validators);

  const pushValidationError = errMsg => {
    const error = inputValidators.createFeedback(Feedback.failed, errMsg);
    setValidationErrors(prevState => [error, ...prevState]);
  };

  const runValidators = function () {
    if (!validators?.length) return;

    const getFeedback = validator => {
      // 'validator' refers to each object in the 'validators' array that is passed into useInput()
      const [validatorName, args] = Object.entries(validator).flat();
      console.log({ validatorName, args });
      // console.log(Object.entries(validator));
      // console.log(
      //   inputValidators[validatorName].call({ userInput: inputValue }, ...args),
      // );
      return inputValidators[validatorName]?.call({ userInput: inputValue }, ...args); // Returns a feedback
    };

    const isError = feedback => {
      console.log(feedback);
      return feedback.type === Feedback.failed;
    };
    // For each validator, get a corresponding feedback and filter error-based feedbacks
    const errors = validators.map(getFeedback).filter(isError);
    console.log('Errors: ', errors);
    return errors;
  };

  return { runValidators, validationErrors, setValidationErrors, pushValidationError };
}

export default useValidator;
