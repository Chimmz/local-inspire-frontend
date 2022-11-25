import React, { useState, useEffect } from 'react';
import { signIn, SignInOptions, SignInResponse } from 'next-auth/react';

import { Spinner as BSpinner } from 'react-bootstrap';
import useInput from '../../hooks/useInput';
import { AuthType } from '../layout/navbar/Navbar';
import TextInput from '../shared/text-input/TextInput';
import styles from './Auth.module.scss';
import AuthContentWrapper from './AuthContentWrapper';
import AuthNav from './AuthNav';
import EmailVerification from './EmailVerification';
import useRequest from '../../hooks/useRequest';
import Spinner from '../shared/spinner/Spinner';
import LoadingButton from '../shared/button/Button';
import cls from 'classnames';

interface Props {
  authType: AuthType;
  show: boolean;
  goToForgotPassword: () => void;
  goBack: () => void;
  closeModal: () => void;
}

export type Credentials = {
  username?: string;
  email: string;
  password: string;
};

const CredentialsForm: React.FC<Props> = function (props) {
  const { show, authType } = props;
  // const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { send: sendAuthRequest, loading: isAuthenticating } = useRequest({
    autoStopLoading: true,
  });
  const [emailVerificationData, setEmailVerificationData] = useState<{
    shown: boolean;
    promptMsg: string;
    errorMsg: string;
  }>({ shown: false, promptMsg: '', errorMsg: '' });
  // const [verificationErrorMsg, setVerificationErrorMsg] = useState('');

  const showEmailVerification = () => {
    setEmailVerificationData(data => ({ ...data, shown: true }));
  };
  const closeEmailVerification = () => {
    setEmailVerificationData(data => ({ ...data, shown: false }));
  };

  const isLoginAuthType = authType === 'login';

  const {
    inputValue: username,
    handleChange: handleChangeUsername,
    runValidators: runUsernameValidators,
    validationErrors: usernameErrors,
    clearInput: clearUsername,
    clearValidationErrors: clearUsernameErrors,
  } = useInput({ init: '', validators: [{ isRequired: ['This field is required'] }] });

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
    validators: [{ isRequired: ['This field is required'] }],
  });

  useEffect(() => {
    if (show) {
      clearEmail();
      clearPassword();
      clearUsername();
    }
  }, [show]);

  if (!show) return <></>;

  const validateFields = () => {
    const results = [runEmailValidators(), runPasswordValidators()];
    if (authType === 'register') results.unshift(runUsernameValidators());
    console.log('Validation results:', results);
  };

  const authenticate = async function (verificationCode?: string) {
    const cred: Credentials = { email, password };
    if (authType === 'register') cred.username = username;

    const options: SignInOptions = { ...cred, code: verificationCode, redirect: false };
    console.log('Signin options: ', options);
    // const spin5s = () => new Promise((resolve, reject) => setTimeout(resolve, 5000));
    // const result = await sendAuthRequest(spin5s());

    try {
      const result = await sendAuthRequest(signIn(authType, options));
      console.table(result);

      const { ok, error, status, url } = result;
      if (ok) return props.closeModal();

      const errorResponse = JSON.parse(error);
      console.log('Full response: ', errorResponse);

      switch (errorResponse?.reason) {
        case 'EMAIL_NOT_VERIFIED':
          showEmailVerification();
          setEmailVerificationData(data => ({
            ...data,
            errMsg: errorResponse.msg,
            promptMsg: errorResponse.msg,
          }));
          break;

        case 'WRONG_CODE':
          setEmailVerificationData(data => ({ ...data, errMsg: errorResponse.msg }));
          break;
      }
    } catch (err) {
      console.log('Credential signin Error: ', err);
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (ev): void => {
    ev.preventDefault();
    if (!email || !password || (isLoginAuthType ? false : !username)) return;
    // validateFields();

    authenticate();
  };

  if (!isLoginAuthType && emailVerificationData.shown)
    return (
      <EmailVerification
        promptMsg={emailVerificationData.promptMsg}
        errorMsg={emailVerificationData.errorMsg}
        email={email}
        resendEmail={authenticate}
        onEnterCode={authenticate}
        loading={isAuthenticating}
        goBack={closeEmailVerification}
      />
    );
  const title = isLoginAuthType ? 'Login' : 'Join';
  const subtitle = isLoginAuthType
    ? 'Login to access your account.'
    : 'Create a new account to join.';
  return (
    <AuthContentWrapper contentTitle={title} subtitle={subtitle}>
      <form
        onSubmit={handleSubmit}
        className={cls(styles.credentialsForm)}
        noValidate
        autoComplete="off"
      >
        {!isLoginAuthType ? (
          <div className={styles.authField}>
            <label htmlFor="">Username</label>
            <div className={styles.inputGroup}>
              <TextInput
                type="text"
                value={username}
                onChange={handleChangeUsername as () => any}
                className="textfield"
                placeholder="Enter a username"
                validationErrors={usernameErrors}
              />
            </div>
          </div>
        ) : null}

        <Spinner show={isAuthenticating} />

        <div className={styles.authField}>
          <label htmlFor="">Email</label>
          <div className={styles.inputGroup}>
            <TextInput
              type="email"
              value={email}
              onChange={handleChangeEmail}
              className="textfield"
              placeholder="Enter your email"
              validationErrors={emailErrors}
            />
          </div>
        </div>

        <div className={styles.authField}>
          <label htmlFor="">Password</label>
          <div className={styles.inputGroup}>
            <TextInput
              type="password"
              value={password}
              onChange={handleChangePassword}
              placeholder={isLoginAuthType ? 'Enter your password' : 'Create a password'}
              className="textfield"
              validationErrors={passwordErrors}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-pry d-flex align-items-center justify-content-center gap-4"
          disabled={isAuthenticating}
        >
          <span className="text">{`${isLoginAuthType ? 'Log in' : 'Sign up'}`}</span>
        </button>

        <small
          onClick={isAuthenticating ? () => {} : props.goToForgotPassword}
          className={cls(styles.forgotPassLink, !isLoginAuthType && 'd-none')}
        >
          <a href="#" className={styles.link} style={{ fontSize: '13px' }}>
            Forgot Password?
          </a>
        </small>
      </form>
      <AuthNav goBack={props.goBack} loading={isAuthenticating} />
    </AuthContentWrapper>
  );
};

export default CredentialsForm;
