import React from 'react';
import AuthContentWrapper from './AuthContentWrapper';
import styles from './Auth.module.scss';
import TextInput from '../shared/text-input/TextInput';
import useInput from '../../hooks/useInput';

const CreatePassword: React.FC = function () {
  const {
    inputValue: password,
    handleChange: handleChangePassword,
    runValidators: runPasswordValidators,
    validationErrors: passwordErrors,
    clearInput: clearPassword,
    clearValidationErrors: clearPasswordErrors,
  } = useInput({
    init: '',
    validators: [{ isRequired: ['This field is required'], isEmail: [] }],
  });

  const {
    inputValue: password2,
    handleChange: handleChangePassword2,
    runValidators: runPasswordValidators2,
    validationErrors: passwordErrors2,
    clearInput: clearPassword2,
    clearValidationErrors: clearPasswordErrors2,
  } = useInput({
    init: '',
    validators: [{ isRequired: ['This field is required'], isEmail: [] }],
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <p style={{ fontSize: '16px', color: '#777' }} className="mb-5">
        Create a new password. We recommend using a strong password.
      </p>
      <div className={styles.authField}>
        <label htmlFor="pass1">New password</label>
        <div className={styles.inputGroup}>
          <TextInput
            type="password"
            value={password}
            onChange={handleChangePassword}
            className="textfield text-center"
            placeholder="Enter your email"
            validationErrors={passwordErrors}
            id="email"
          />
        </div>
      </div>
      <div className={styles.authField}>
        <label htmlFor="pass1">New password</label>
        <div className={styles.inputGroup}>
          <TextInput
            type="password"
            value={password}
            onChange={handleChangePassword}
            className="textfield text-center"
            placeholder="Enter your email"
            validationErrors={passwordErrors}
            id="email"
          />
        </div>
      </div>
      <button className="btn btn-pry mt-5" type="submit">
        Continue
      </button>
    </form>
  );
};

export default CreatePassword;
