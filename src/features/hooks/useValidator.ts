import { useState } from 'react';
import * as inputValidators from '../validators/inputValidator';

function useValidator({ inputValue, validators }) {
   const [validationErrors, setValidationErrors] = useState([]);

   const pushError = errMsg => {
      const error = inputValidators.getFeedback(
         inputValidators.statusTypes.failed,
         errMsg
      );
      setValidationErrors(prevState => [error, ...prevState]);
   };

   const runValidators = () => {
      if (!validators?.length) return;

      const getFeedback = validator => {
         // 'validator' refers to each object in the 'validators' array that is passed into useInput()
         const [validatorName, args] = Object.entries(validator).flat();
         const obj = { userInput: inputValue };
         return inputValidators[validatorName]?.call(obj, ...args); // Returns a feedback
      };

      const isError = feedback =>
         feedback?.status === inputValidators.statusTypes.failed;

      // For each validator, get a corresponding feedback and filter error-based feedbacks
      const errors = validators.map(getFeedback).filter(isError);
      return errors;
   };

   return {
      runValidators,
      validationErrors,
      setValidationErrors,
      pushError,
   };
}

export default useValidator;
