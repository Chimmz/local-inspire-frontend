import React, { createContext, useContext, useState } from 'react';
import useInput from '../hooks/useInput';
import { ValidationError, ValidatorRunner } from '../hooks/useValidator';
import { isEmail, isRequired, minLength } from '../utils/validators/inputValidators';

interface NewRegistration {
  firstName: string;
  handleChangeFirstName: React.ChangeEventHandler<HTMLInputElement>;
  runFirstNameValidators: ValidatorRunner;
  firstNameErrors: ValidationError[];
  pushFirstNameValidationError(msg: string): void;
  clearfirstName: () => void;
  clearFirstnameErrors: () => void;

  lastName: string;
  handleChangeLastName: React.ChangeEventHandler<HTMLInputElement>;
  runLastNameValidators: ValidatorRunner;
  lastNameErrors: ValidationError[];
  pushLastNameValidationError(msg: string): void;
  clearLastName: () => void;

  email: string;
  handleChangeEmail: React.ChangeEventHandler<HTMLInputElement>;
  runEmailValidators: ValidatorRunner;
  emailErrors: ValidationError[];
  pushEmailValidationError(msg: string): void;
  clearEmail: () => void;

  password: string;
  handleChangePassword: React.ChangeEventHandler<HTMLInputElement>;
  runPasswordValidators: ValidatorRunner;
  clearPassword: () => void;
  passwordErrors: ValidationError[];
  pushPasswordValidationError(msg: string): void;
  clearPasswordErrors: () => void;
}

interface NewRegistrationData {
  newRegistration: NewRegistration;
}

const NewRegistrationContext = createContext<NewRegistrationData | null>(null);

export const NewRegistrationContextProvider: React.FC<{
  children: React.ReactNode;
}> = props => {
  const {
    inputValue: firstName,
    handleChange: handleChangeFirstName,
    runValidators: runFirstNameValidators,
    validationErrors: firstNameErrors,
    pushValidationError: pushFirstNameValidationError,
    clearInput: clearfirstName,
    clearValidationErrors: clearFirstnameErrors,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['This field is required'] }],
  });

  const {
    inputValue: lastName,
    handleChange: handleChangeLastName,
    runValidators: runLastNameValidators,
    validationErrors: lastNameErrors,
    pushValidationError: pushLastNameValidationError,
    clearInput: clearLastName,
    clearValidationErrors: clearLastnameErrors,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['This field is required'] }],
  });

  const {
    inputValue: email,
    handleChange: handleChangeEmail,
    runValidators: runEmailValidators,
    validationErrors: emailErrors,
    pushValidationError: pushEmailValidationError,
    clearInput: clearEmail,
    clearValidationErrors: clearEmailErrors,
  } = useInput({
    init: '',
    validators: [
      { fn: isRequired, params: ['This field is required'] },
      { fn: isEmail, params: [] },
    ],
  });

  const {
    inputValue: password,
    handleChange: handleChangePassword,
    runValidators: runPasswordValidators,
    validationErrors: passwordErrors,
    pushValidationError: pushPasswordValidationError,
    clearInput: clearPassword,
    clearValidationErrors: clearPasswordErrors,
  } = useInput({
    init: '',
    validators: [
      { fn: isRequired, params: ['This field is required'] },
      { fn: minLength, params: [6, 'Password must be at least 6 characters'] },
    ],
  });

  const state: NewRegistrationData = {
    newRegistration: {
      firstName,
      handleChangeFirstName,
      runFirstNameValidators,
      pushFirstNameValidationError,
      firstNameErrors,

      clearfirstName,
      clearFirstnameErrors,
      lastName,
      handleChangeLastName,
      runLastNameValidators,
      pushLastNameValidationError,
      lastNameErrors,

      clearLastName,
      email,
      handleChangeEmail,
      runEmailValidators,
      pushEmailValidationError,
      emailErrors,

      clearEmail,
      password,
      handleChangePassword,
      runPasswordValidators,
      passwordErrors,
      pushPasswordValidationError,
      clearPassword,
      clearPasswordErrors,
    },
  };

  return (
    <NewRegistrationContext.Provider value={state}>
      {props.children}
    </NewRegistrationContext.Provider>
  );
};

export const useNewRegistrationContext = () => useContext(NewRegistrationContext);
export default NewRegistrationContext;
