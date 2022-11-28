import React, { createContext, useContext, useState } from 'react';
import useInput from '../hooks/useInput';

interface NewRegistration {
  firstName: string;
  handleChangeFirstName: React.ChangeEventHandler<HTMLInputElement>;
  runFirstNameValidators: () => any;
  setFirstNameValidationErrors: React.Dispatch<React.SetStateAction<never[]>>;
  pushFirstNameValidationError(msg: string): void;
  firstNameErrors: any[];
  clearfirstName: () => void;
  clearFirstnameErrors: () => void;

  lastName: string;
  handleChangeLastName: React.ChangeEventHandler<HTMLInputElement>;
  runLastNameValidators: () => any;
  lastNameErrors: any[];
  setLastNameValidationErrors: React.Dispatch<React.SetStateAction<never[]>>;
  pushLastNameValidationError(msg: string): void;
  clearLastName: () => void;

  email: string;
  handleChangeEmail: React.ChangeEventHandler<HTMLInputElement>;
  runEmailValidators: () => any;
  emailErrors: any[];
  setEmailValidationErrors: React.Dispatch<React.SetStateAction<never[]>>;
  pushEmailValidationError(msg: string): void;
  clearEmail: () => void;

  password: string;
  handleChangePassword: React.ChangeEventHandler<HTMLInputElement>;
  runPasswordValidators: () => any;
  clearPassword: () => void;
  passwordErrors: any[];
  setPasswordValidationErrors: React.Dispatch<React.SetStateAction<never[]>>;
  pushPasswordValidationError(msg: string): void;
  clearPasswordErrors: () => void;

  // photo: string;
  // setPhoto: React.Dispatch<React.SetStateAction<string>>;

  // birthInfo: BirthInfo;
  // changeBirthInfo(field: 'day' | 'month' | 'year', newValue: string): void;

  // gender: 'male' | 'female' | null;
  // setGender: React.Dispatch<React.SetStateAction<'male' | 'female' | null>>;
}

interface AuthData {
  newRegistration: NewRegistration;
}

const AuthContext = createContext<AuthData | null>(null);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = props => {
  // const [photo, setPhoto] = useState('');
  // const [gender, setGender] = useState<'male' | 'female' | null>(null);

  // const [birthInfo, setBirthInfo] = useState<{
  //   year: string;
  //   month: string;
  //   day: string;
  // }>({ year: '', month: '', day: '' });

  const {
    inputValue: firstName,
    handleChange: handleChangeFirstName,
    runValidators: runFirstNameValidators,
    validationErrors: firstNameErrors,
    setValidationErrors: setFirstNameValidationErrors,
    pushValidationError: pushFirstNameValidationError,
    clearInput: clearfirstName,
    clearValidationErrors: clearFirstnameErrors,
  } = useInput({ init: '', validators: [{ isRequired: ['This field is required'] }] });

  const {
    inputValue: lastName,
    handleChange: handleChangeLastName,
    runValidators: runLastNameValidators,
    validationErrors: lastNameErrors,
    setValidationErrors: setLastNameValidationErrors,
    pushValidationError: pushLastNameValidationError,
    clearInput: clearLastName,
    clearValidationErrors: clearLastnameErrors,
  } = useInput({ init: '', validators: [{ isRequired: ['This field is required'] }] });

  const {
    inputValue: email,
    handleChange: handleChangeEmail,
    runValidators: runEmailValidators,
    validationErrors: emailErrors,
    setValidationErrors: setEmailValidationErrors,
    pushValidationError: pushEmailValidationError,
    clearInput: clearEmail,
    clearValidationErrors: clearEmailErrors,
  } = useInput({
    init: '',
    validators: [{ isRequired: ['This field is required'] }, { isEmail: [] }],
  });

  const {
    inputValue: password,
    handleChange: handleChangePassword,
    runValidators: runPasswordValidators,
    validationErrors: passwordErrors,
    setValidationErrors: setPasswordValidationErrors,
    pushValidationError: pushPasswordValidationError,
    clearInput: clearPassword,
    clearValidationErrors: clearPasswordErrors,
  } = useInput({
    init: '',
    validators: [
      { isRequired: ['This field is required'] },
      { minLength: [6, 'Password must be at least 6 characters'] },
    ],
  });

  const state: AuthData = {
    newRegistration: {
      firstName,
      handleChangeFirstName,
      runFirstNameValidators,
      setFirstNameValidationErrors,
      pushFirstNameValidationError,
      firstNameErrors,

      clearfirstName,
      clearFirstnameErrors,
      // Last name
      lastName,
      handleChangeLastName,
      runLastNameValidators,
      setLastNameValidationErrors,
      pushLastNameValidationError,
      lastNameErrors,

      clearLastName,
      // Email
      email,
      handleChangeEmail,
      runEmailValidators,
      setEmailValidationErrors,
      pushEmailValidationError,
      emailErrors,

      clearEmail,
      // Password
      password,
      handleChangePassword,
      runPasswordValidators,
      passwordErrors,
      setPasswordValidationErrors,
      pushPasswordValidationError,
      clearPassword,
      clearPasswordErrors,
      // Photo
      // photo,
      // setPhoto,
      // birthInfo,
      // // Birthinfo
      // changeBirthInfo: (field: 'day' | 'month' | 'year', newValue: string) => {
      //   setBirthInfo(info => ({ ...info, [field]: newValue }));
      // },
      // // Gender,
      // gender,
      // setGender,
    },
  };

  return <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthContext;
