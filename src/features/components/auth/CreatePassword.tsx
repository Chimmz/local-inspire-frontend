import React from 'react';
import AuthContentWrapper from './AuthContentWrapper';
import styles from './Auth.module.scss';
import TextInput from '../shared/text-input/TextInput';
import useInput from '../../hooks/useInput';
import cls from 'classnames';
import {
  isRequired,
  isStrongPassword,
  minLength,
  mustBeSameAs,
} from '../../utils/validators/inputValidators';

const CreatePassword: React.FC = function () {
  const {
    inputValue: password,
    handleChange: handleChangePassword,
    runValidators: runPasswordValidators,
    validationErrors: passwordErrors,
    setValidationErrors: setPasswordValidationErrors,
    clearInput: clearPassword,
    clearValidationErrors: clearPasswordErrors,
  } = useInput({
    init: '',
    validators: [
      { fn: isRequired, params: ['This field is required'] },
      { fn: minLength, params: [6] },
      { fn: isStrongPassword, params: ['Enter a strong password'] },
    ],
  });

  const {
    inputValue: passwordConfirm,
    handleChange: handleChangePasswordConfirm,
    setValidationErrors: setConfirmPasswordValidationErrors,
    runValidators: runConfirmPasswordValidators2,
    validationErrors: passwordConfirmErrors,
    clearInput: clearPasswordConfirm,
    clearValidationErrors: clearPasswordConfirmErrors,
  } = useInput({
    init: '',
    validators: [
      { fn: isRequired, params: ['This field is required'] },
      { fn: mustBeSameAs, params: [password, 'Passwords do not match'] },
    ],
  });

  // const changePassword = async (verificationCode?: string) => {
  //   // const spin5s = () => new Promise((resolve, reject) => setTimeout(resolve, 5000));
  //   // const result = await sendChangePasswordRequest(spin5s());
  //   const res = await sendChangePasswordRequest(
  //     API.changePassword(email, password, verificationCode),
  //   );
  //   console.log('Change password response: ', res);

  //   switch (res.status) {
  //     case 'SUCCESS':
  //       setEmailVerificationData(data => ({ ...data, successMsg: res.msg }));
  //       return setPageTitle('Password Changed!');

  //     case 'FAIL':
  //       if (res.reason === 'EMAIL_NOT_VERIFIED') {
  //         setEmailVerificationData(data => ({ ...data, promptMsg: res.msg }));
  //         showEmailVerification();
  //         setPageTitle('Confirm your Email');
  //       }
  //       if (res.reason === 'WRONG_CODE')
  //         setEmailVerificationData(data => ({ ...data, errorMsg: res.msg }));
  //       break;
  //   }
  // };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();
    const results = [runPasswordValidators(), runConfirmPasswordValidators2()];
    if (results.some(r => r.errorExists)) return;
    console.log('Proceeding to change password!');
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <p style={{ fontSize: '16px', color: '#777' }} className="mb-5">
        Create a new password. We recommend using a strong password.
      </p>
      <div className={styles.authField}>
        <label htmlFor="pass1">New password</label>
        <div className={cls(styles.inputGroup, 'mb-4')}>
          <TextInput
            type="password"
            value={password}
            onChange={handleChangePassword}
            className="textfield"
            placeholder="Enter a new password"
            validationErrors={passwordErrors}
            id="password"
          />
        </div>
      </div>
      <div className={styles.authField}>
        <label htmlFor="passwordConfirm">Password confirm</label>
        <div className={styles.inputGroup}>
          <TextInput
            type="password"
            value={passwordConfirm}
            onChange={handleChangePasswordConfirm}
            className="textfield"
            placeholder="Confirm your new password"
            validationErrors={passwordConfirmErrors}
            id="passwordConfirm"
          />
        </div>
      </div>
      <button className="btn btn-pry mt-4" type="submit">
        Continue
      </button>
    </form>
  );
};

export default CreatePassword;
