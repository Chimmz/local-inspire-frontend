import React, { useState, useEffect } from 'react';
// import * as inputValidators from '../validators/inputValidator';
import useValidator from './useValidator';

interface UseInputParams {
  init: string;
  validators?: { [key: string]: object }[];
}

const useInput = function ({ init: initValue, validators }: UseInputParams) {
  const [inputValue, setInputValue] = useState(initValue);
  const { runValidators, validationErrors, setValidationErrors, pushError } =
    useValidator({ inputValue, validators });

  const clearInput = () => setInputValue('');
  const clearValidationErrors = () => setValidationErrors([]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ev => {
    setInputValue(ev.target.value);
    setValidationErrors([]); // Clear validation errors when user continues to input
  };

  return {
    inputValue,
    handleChange,
    runValidators,
    validationErrors,
    setValidationErrors,
    pushError,
    setInputValue,
    clearInput,
    clearValidationErrors,
  };
};

export default useInput;
