import React, { useEffect, useRef } from 'react';
import { signIn, SignInOptions, SignInResponse } from 'next-auth/react';
import cls from 'classnames';

import useInput from '../../hooks/useInput';
import useRequest from '../../hooks/useRequest';
import * as stringUtils from '../../utils/string-utils';

import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
// import Modal from '../shared/modal/Modal';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from './Auth.module.scss';
import TextInput from '../shared/text-input/TextInput';
import LoadingButton from '../shared/button/Button';
import Spinner from '../shared/spinner/Spinner';

interface AuthProps {
  show: boolean;
  authType: 'login' | 'register';
  close: () => void;
}

const Auth: React.FC<AuthProps> = function ({ show, authType, close }) {
  // const usernameRef = useRef<HTMLInputElement | null>(null);
  // const emailRef = useRef<HTMLInputElement | null>(null);

  const {
    send: sendAuthRequest,
    loading: authRequestLoading,
    startLoading: showLoader,
    stopLoading: stopAuthRequestLoading,
  } = useRequest({
    autoStopLoading: false,
  });

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

  useEffect(() => stopAuthRequestLoading, [stopAuthRequestLoading]);

  const validateFields = () => {
    const results = [runEmailValidators(), runPasswordValidators()];
    if (authType === 'register') results.unshift(runUsernameValidators());
    console.log(results);
  };

  const authWithCredentials: React.FormEventHandler<HTMLFormElement> = async ev => {
    console.log('In authWithCredentials...');
    ev.preventDefault();
    validateFields();

    if (!email || !password || (isLoginAuthType ? false : !username)) {
      return;
    }
    const options: SignInOptions = { email, password, redirect: false };
    if (authType === 'register') options.username = username;

    try {
      // console.log(authType);
      const result = await sendAuthRequest(signIn(authType, options));
      if (!result) return;
      const { ok, error, status, url } = result;
      if (ok) {
        close();
      }
      console.table({ ok, error, status, url });
    } catch (err) {
      console.log('Credential signin Error: ', err);
    }
  };

  const signInWith3rdParty: React.MouseEventHandler<HTMLButtonElement> = async ev => {
    if (!(ev.target instanceof HTMLButtonElement)) return;
    try {
      const options: SignInOptions = { callbackUrl: '/' };
      // const result = await sendAuthRequest(signIn(ev.target.dataset.provider, options));
      const result = await signIn(ev.target.dataset.provider, options);
      showLoader();
      console.table(result);
    } catch (err) {
      console.log(`${ev.target.dataset.provider} signin error: `, err);
    }
  };

  const isLoginAuthType = authType === 'login';

  if (!show) return <></>;
  return (
    <Modal
      show={show}
      onHide={close}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="p-4 py-4">
        <h1 className="text-center w-100">{stringUtils.toTitleCase(authType)}</h1>
      </Modal.Header>
      <Modal.Body className="p-5">
        {/* <div className="white-overlay"></div> */}
        {(authRequestLoading && <Spinner />) || null}
        <form action="" className={styles.auth} onSubmit={authWithCredentials} noValidate>
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
                placeholder={
                  isLoginAuthType ? 'Enter your password' : 'Create a password'
                }
                className="textfield"
                validationErrors={passwordErrors}
              />
            </div>
          </div>
          <LoadingButton
            type="submit"
            className="btn btn-pry"
            // isLoading={authRequestLoading}
            isLoading={false}
            disabled={authRequestLoading}
          >
            {`${isLoginAuthType ? 'Log in' : 'Sign up'}`}
          </LoadingButton>

          <small>or</small>

          <LoadingButton
            type="button"
            className={cls('btn btn-outline btn-outline-gray', styles.btnSocial)}
            data-provider="google"
            onClick={signInWith3rdParty}
            // isLoading={authRequestLoading}
            isLoading={false}
            disabled={authRequestLoading}
          >
            <GoogleIcon fontSize="large" />
            {`Sign ${isLoginAuthType ? 'in' : 'up'} with Google`}
          </LoadingButton>

          <LoadingButton
            type="button"
            className={cls('btn btn-outline btn-outline-gray', styles.btnSocial)}
            data-provider="facebook"
            onClick={signInWith3rdParty}
            // isLoading={authRequestLoading}
            isLoading={false}
            disabled={authRequestLoading}
          >
            <FacebookIcon fontSize="large" />
            {`Sign ${isLoginAuthType ? 'in' : 'up'} with Facebook`}
          </LoadingButton>

          <LoadingButton
            type="button"
            className={cls('btn btn-outline btn-outline-gray', styles.btnSocial)}
            data-provider="twitter"
            onClick={signInWith3rdParty}
            // isLoading={authRequestLoading}
            isLoading={false}
            disabled={authRequestLoading}
          >
            <TwitterIcon fontSize="large" />
            {`Sign ${isLoginAuthType ? 'in' : 'up'} with Twitter`}
          </LoadingButton>
          <small>
            <a href="" className={styles.link}>
              Forgot Password?
            </a>
          </small>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Auth;
