import { useState, useEffect } from 'react';
// import * as inputValidators from '../validators/inputValidator';
import useValidator from './useValidator';

interface InputParams {
  init: string;
  validators: {}[];
}

const useInput = function ({ init: initValue, validators }: InputParams) {
  const [inputValue, setInputValue] = useState(initValue);
  const { runValidators, validationErrors, setValidationErrors, pushError } =
    useValidator({ inputValue: inputValue, validators });

  const clearInput = () => setInputValue('');

  const handleChange = ev => {
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
  };
};

export default useInput;
