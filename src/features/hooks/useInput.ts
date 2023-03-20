import { useState, ChangeEventHandler } from 'react';
import useValidator, { ValidatorConfig } from './useValidator';

interface UseInputParams {
  init: string;
  validators?: ValidatorConfig<string>[];
}

const useInput = function ({ init: initValue, validators = [] }: UseInputParams) {
  const [inputValue, setInputValue] = useState(initValue);

  const { runValidators, validationErrors, setValidationErrors, pushValidationError } =
    useValidator<string>({ inputValue, validators });

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = ev => {
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
