import { useState, ChangeEventHandler } from 'react';
import useValidator, { ValidatorConfig } from './useValidator';

interface UseInputParams {
  init: string;
  type?: 'number';
  validators?: ValidatorConfig<string>[];
}

const useInput = function ({ init: initValue, type, validators = [] }: UseInputParams) {
  const [inputValue, setInputValue] = useState(initValue);

  const { runValidators, validationErrors, setValidationErrors, pushValidationError } =
    useValidator<string>({ inputValue, validators });

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = ev => {
    if (type === 'number') !isNaN(+ev.target.value) && setInputValue(ev.target.value);
    else setInputValue(ev.target.value);
    setValidationErrors([]); // Clear validation errors when user continues to input
  };

  return {
    inputValue,
    setInputValue,
    handleChange,
    onChange: handleChange,
    runValidators,
    validationErrors,
    setValidationErrors,
    pushValidationError,
    clearInput: setInputValue.bind(null, ''),
    clearValidationErrors: setValidationErrors.bind(null, []),
  };
};

export default useInput;
