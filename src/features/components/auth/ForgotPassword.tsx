import React, { useState } from 'react';

import useRequest from '../../hooks/useRequest';
import useInput from '../../hooks/useInput';
import API from '../../library/api';

import cls from 'classnames';
import TextInput from '../shared/text-input/TextInput';
import Spinner from '../shared/spinner/Spinner';
import AuthContentWrapper from './AuthContentWrapper';
import AuthNav from './AuthNav';
import EmailVerification from './EmailVerification';
import styles from './Auth.module.scss';
import AuthSuccess from './AuthSuccess';

interface Props {
  goBack: () => void;
}

const ForgotPassword: React.FC<Props> = props => {
  const { goBack } = props;
  const { send: sendChangePasswordRequest, loading: isChangingPassword } = useRequest({
    autoStopLoading: true,
  });
  const [pageTitle, setPageTitle] = useState('Forgot Password');

  const [emailVerificationData, setEmailVerificationData] = useState<{
    shown: boolean;
    promptMsg: string;
    errorMsg: string;
    successMsg: string;
  }>({ shown: false, promptMsg: '', errorMsg: '', successMsg: '' });

  const showEmailVerification = () => {
    setEmailVerificationData(data => ({ ...data, shown: true }));
  };
  const closeEmailVerification = () => {
    setEmailVerificationData(data => ({ ...data, shown: false }));
  };

  const {
    inputValue: email,
    handleChange: handleChangeEmail,
    runValidators: runEmailValidators,
    validationErrors: emailErrors,
    clearInput: clearEmail,
    clearValidationErrors: clearEmailErrors,
  } = useInput({
    init: '',
    validators: [{ isRequired: ['This field is required'], isEmail: [] }],
  });

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
    inputValue: passwordConfirm,
    handleChange: handleChangePasswordConfirm,
    runValidators: runPasswordValidators2,
    validationErrors: passwordConfirmErrors,
    clearInput: clearPasswordConfirm,
    clearValidationErrors: clearPasswordConfirmErrors,
  } = useInput({
    init: '',
    validators: [{ isRequired: ['This field is required'], isEmail: [] }],
  });

  const changePassword = async (verificationCode?: string) => {
    // const spin5s = () => new Promise((resolve, reject) => setTimeout(resolve, 5000));
    // const result = await sendChangePasswordRequest(spin5s());
    const res = await sendChangePasswordRequest(
      API.changePassword(email, password, verificationCode),
    );
    console.log('Change password response: ', res);

    switch (res.status) {
      case 'SUCCESS':
        setEmailVerificationData(data => ({ ...data, successMsg: res.msg }));
        return setPageTitle('Password Changed!');

      case 'FAIL':
        if (res.reason === 'EMAIL_NOT_VERIFIED') {
          setEmailVerificationData(data => ({ ...data, promptMsg: res.msg }));
          showEmailVerification();
          setPageTitle('Confirm your Email');
        }
        if (res.reason === 'WRONG_CODE')
          setEmailVerificationData(data => ({ ...data, errorMsg: res.msg }));
        break;
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();
    if (!email || !password || !passwordConfirm) return;
    changePassword();
  };

  return (
    <AuthContentWrapper
      contentTitle={pageTitle}
      className={emailVerificationData.successMsg ? 'align-items-center' : ''}
    >
      {emailVerificationData.successMsg ? (
        <AuthSuccess>{emailVerificationData.successMsg}</AuthSuccess>
      ) : emailVerificationData.shown ? (
        <EmailVerification
          onEnterCode={changePassword}
          promptMsg={emailVerificationData.promptMsg}
          errorMsg={emailVerificationData.errorMsg}
          email={email}
          resendEmail={() => changePassword()}
          loading={false}
          goBack={closeEmailVerification}
        />
      ) : null}

      {(!emailVerificationData.shown && (
        <form noValidate onSubmit={handleSubmit} className={styles.credentialsForm}>
          <div className={styles.authField}>
            <label htmlFor="email">Your email</label>
            <div className={styles.inputGroup}>
              <TextInput
                type="email"
                value={email}
                onChange={handleChangeEmail}
                className="textfield"
                placeholder="Enter your email"
                validationErrors={emailErrors}
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
          <button
            className="btn btn-pry mt-3"
            type="submit"
            disabled={isChangingPassword}
          >
            Continue
          </button>
        </form>
      )) ||
        null}

      <Spinner show={isChangingPassword} />
      {!emailVerificationData.shown ? (
        <AuthNav goBack={goBack} loading={isChangingPassword} />
      ) : null}
    </AuthContentWrapper>
  );
};

export default ForgotPassword;
