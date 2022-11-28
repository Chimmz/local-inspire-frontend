import React, { useState, useEffect } from 'react';
// import * as inputValidators from '../validators/inputValidator';
import useValidator from './useValidator';

interface UseInputParams {
  init: string;
  validators?: { [key: string]: object }[];
}

const useInput = function ({ init: initValue, validators }: UseInputParams) {
  const [inputValue, setInputValue] = useState(initValue);
  const { runValidators, validationErrors, setValidationErrors, pushValidationError } =
    useValidator({ inputValue, validators });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ev => {
    setInputValue(ev.target.value);
    setValidationErrors([]); // Clear validation errors when user continues to input
  };

  return {
    inputValue,
    setInputValue,
    handleChange,
    runValidators,
    validationErrors,
    setValidationErrors,
    pushValidationError,
    clearInput: setInputValue.bind(null, ''),
    clearValidationErrors: setValidationErrors.bind(null, []),
  };
};

export default useInput;
