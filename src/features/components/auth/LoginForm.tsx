import React, { useState, useEffect } from 'react';
import { signIn, SignInOptions, SignInResponse } from 'next-auth/react';
// Hooks
import useInput from '../../hooks/useInput';
import useRequest from '../../hooks/useRequest';

import AuthContentWrapper from './AuthContentWrapper';
import TextInput from '../shared/text-input/TextInput';
import AuthNav from './AuthNav';
import Spinner from '../shared/spinner/Spinner';
import cls from 'classnames';
import styles from './Auth.module.scss';
import { isEmail, isRequired } from '../../utils/validators/inputValidators';

interface Props {
  show: boolean;
  goBack: () => void;
  goToSignup: () => void;
  goToForgotPassword: () => void;
  closeModal: () => void;
}

export type Credentials = {
  email: string;
  password: string;
};

const LoginForm: React.FC<Props> = function (props) {
  const { show } = props;
  // const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { send: sendAuthRequest, loading: isAuthenticating } = useRequest({
    autoStopLoading: true,
  });
  const [emailVerificationData, setEmailVerificationData] = useState<{
    shown: boolean;
    promptMsg: string;
    errorMsg: string;
  }>({ shown: false, promptMsg: '', errorMsg: '' });

  const {
    inputValue: email,
    handleChange: handleChangeEmail,
    runValidators: runEmailValidators,
    validationErrors: emailValidationErrors,
    setValidationErrors: setEmailValidationErrors,
    clearInput: clearEmail,
  } = useInput({
    init: '',
    validators: [
      { fn: isRequired, params: ['This field is required'] },
      { fn: isEmail, params: ['You entered an invalid email'] },
    ],
  });

  const {
    inputValue: password,
    handleChange: handleChangePassword,
    runValidators: runPasswordValidators,
    validationErrors: passwordValidationErrors,
    setValidationErrors: setPasswordValidationErrors,
    pushValidationError: pushPasswordValidationErrors,
    clearInput: clearPassword,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['This field is required'] }],
  });

  useEffect(() => {
    if (!show) return;
    clearEmail();
    clearPassword();
  }, [show]);

  if (!show) return <></>;

  const authenticate = async function () {
    const options: SignInOptions = { email, password, redirect: false };
    console.log('Signin options: ', options);
    // const spin5s = () => new Promise((resolve, reject) => setTimeout(resolve, 5000));
    // const result = await sendAuthRequest(spin5s());
    try {
      const result = await sendAuthRequest(signIn('login', options));
      console.table(result);
      const { ok, error, status, url } = result;

      if (ok) return props.closeModal();

      if (error === 'WRONG_CREDENTIALS')
        return pushPasswordValidationErrors('Wrong email or password entered');
    } catch (err) {
      console.log('Credential signin Error: ', err);
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (ev): any => {
    ev.preventDefault();
    const results = [runEmailValidators(), runPasswordValidators()];
    if (results.some(r => r.errorExists)) return;

    authenticate();
  };

  return (
    <AuthContentWrapper contentTitle="Sign In" subtitle="Login to access your account">
      <form
        onSubmit={handleSubmit}
        className={cls(styles.credentialsForm)}
        noValidate
        autoComplete="off"
      >
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
              validationErrors={emailValidationErrors}
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
              placeholder="Enter your password"
              className="textfield"
              validationErrors={passwordValidationErrors}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-pry d-flex align-items-center justify-content-center gap-4"
          disabled={isAuthenticating}
        >
          <span className="text">Log in</span>
        </button>

        <div className={cls(styles.linkSuggestions, 'd-flex justify-content-between')}>
          <small className={cls(styles.forgotPassLink, 'w-max-content')}>
            Don&apos;t have an account?{' '}
            <a
              href="#"
              className={styles.link}
              style={{ fontSize: '13px' }}
              onClick={isAuthenticating ? () => {} : props.goToSignup}
            >
              Register
            </a>
          </small>

          <small className={cls(styles.forgotPassLink)}>
            <a
              href="#"
              className={styles.link}
              style={{ fontSize: '13px' }}
              onClick={isAuthenticating ? () => {} : props.goToForgotPassword}
            >
              Forgot Password?
            </a>
          </small>
        </div>
      </form>
      <AuthNav goBack={props.goBack} loading={isAuthenticating} />
    </AuthContentWrapper>
  );
};

export default LoginForm;
