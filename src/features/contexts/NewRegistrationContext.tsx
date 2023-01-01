import React, { createContext, useContext, useState } from 'react';
import useInput from '../hooks/useInput';
import { ValidationError, ValidatorRunner } from '../hooks/useValidator';
import { isEmail, isRequired, minLength } from '../utils/validators/inputValidators';

interface NewRegistration {
  firstName: string;
  handleChangeFirstName: React.ChangeEventHandler<HTMLInputElement>;
  runFirstNameValidators: ValidatorRunner;
  // setFirstNameValidationErrors: React.Dispatch<React.SetStateAction<ValidationError[]>>;
  pushFirstNameValidationError(msg: string): void;
  firstNameErrors: ValidationError[];
  clearfirstName: () => void;
  clearFirstnameErrors: () => void;

  lastName: string;
  handleChangeLastName: React.ChangeEventHandler<HTMLInputElement>;
  runLastNameValidators: ValidatorRunner;
  lastNameErrors: ValidationError[];
  // // setLastNameValidationErrors: React.Dispatch<React.SetStateAction<ValidationError[]>>;
  pushLastNameValidationError(msg: string): void;
  clearLastName: () => void;

  email: string;
  handleChangeEmail: React.ChangeEventHandler<HTMLInputElement>;
  runEmailValidators: ValidatorRunner;
  emailErrors: ValidationError[];
  // // setEmailValidationErrors: React.Dispatch<React.SetStateAction<ValidationError[]>>;
  pushEmailValidationError(msg: string): void;
  clearEmail: () => void;

  password: string;
  handleChangePassword: React.ChangeEventHandler<HTMLInputElement>;
  runPasswordValidators: ValidatorRunner;
  clearPassword: () => void;
  passwordErrors: ValidationError[];
  // // setPasswordValidationErrors: React.Dispatch<React.SetStateAction<ValidationError[]>>;
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
    // // setValidationErrors: setFirstNameValidationErrors,
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
    // // setValidationErrors: setLastNameValidationErrors,
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
    // // setValidationErrors: setEmailValidationErrors,
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
    // // setValidationErrors: setPasswordValidationErrors,
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
      // setFirstNameValidationErrors,
      pushFirstNameValidationError,
      firstNameErrors,

      clearfirstName,
      clearFirstnameErrors,
      // Last name
      lastName,
      handleChangeLastName,
      runLastNameValidators,
      // setLastNameValidationErrors,
      pushLastNameValidationError,
      lastNameErrors,

      clearLastName,
      // Email
      email,
      handleChangeEmail,
      runEmailValidators,
      // setEmailValidationErrors,
      pushEmailValidationError,
      emailErrors,

      clearEmail,
      // Password
      password,
      handleChangePassword,
      runPasswordValidators,
      passwordErrors,
      // setPasswordValidationErrors,
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
