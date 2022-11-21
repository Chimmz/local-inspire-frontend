import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import TextInput from '../shared/text-input/TextInput';
import LoadingButton from '../shared/button/Button';
// import Spinner from '../shared/spinner/Spinner';
import Spinner from 'react-bootstrap/Spinner';
import styles from './Auth.module.scss';
import { useRouter } from 'next/router';

interface AuthProps {
  show: boolean;
  authType: 'login' | 'register';
  close: () => void;
}

const Auth: React.FC<AuthProps> = function ({ show, authType, close: closeModal }) {
  // const usernameRef = useRef<HTMLInputElement | null>(null);
  // const emailRef = useRef<HTMLInputElement | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

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
    ev.preventDefault();
    if (isAuthenticating) return;
    validateFields();

    const btnSubmit = (ev.target as Element).querySelector('[type="submit"]');
    const span = btnSubmit?.querySelector('span.text')!;
    const spinner = btnSubmit?.querySelector('.spinner-border') as HTMLElement;
    console.log({ spinner });

    span && (span.textContent = 'Loading...');
    spinner.style.display = 'inline-block';

    if (!email || !password || (isLoginAuthType ? false : !username)) {
      return;
    }
    const options: SignInOptions = { email, password, redirect: false };
    if (authType === 'register') options.username = username;

    try {
      setIsAuthenticating(true);
      const result = await sendAuthRequest(signIn(authType, options));
      if (!result) return;
      console.log('Signin result: ', result);
      const { ok, error, status, url } = result;
      if (ok) {
        closeModal();
      }
      console.table({ ok, error, status, url });
    } catch (err) {
      console.log('Credential signin Error: ', err);
    } finally {
      // btnSubmit!.textContent = 'Log in';
    }
  };

  const signInWith3rdParty: React.MouseEventHandler<HTMLButtonElement> = async ev => {
    if (isAuthenticating) return;

    const btn = (ev.target as HTMLElement).closest('button')!;
    const span = btn.querySelector('span.text')!;
    const spinner = btn.querySelector('.spinner-border') as HTMLElement;

    span && (span.textContent = 'Loading...');
    spinner.style.display = 'inline-block';

    const provider = btn.dataset.provider;
    try {
      setIsAuthenticating(true);
      const options: SignInOptions = { callbackUrl: window.location.href };
      const result = await signIn(provider, options);
      console.table(result);
    } catch (err) {
      console.log(`${provider} signin error: `, err);
    } finally {
      // btn.textContent = btn.dataset.actionText!;
    }
  };

  const isLoginAuthType = authType === 'login';

  useEffect(() => {
    if (show) {
      clearEmail();
      clearPassword();
      clearUsername();
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={closeModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
    >
      <Modal.Header closeButton className="p-4 py-4">
        <h1 className="text-center w-100">{stringUtils.toTitleCase(authType)}</h1>
      </Modal.Header>
      <Modal.Body className="modal-body p-5">
        {/* {(authRequestLoading && <Spinner />) || null} */}

        <form
          action=""
          className={cls(styles.auth, styles.loading)}
          onSubmit={authWithCredentials}
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
          <button
            type="submit"
            className="btn btn-pry d-flex align-items-center justify-content-center gap-4"
            // isLoading={authRequestLoading}
            // disabled={authRequestLoading}
          >
            <span className="text">{`${isLoginAuthType ? 'Log in' : 'Sign up'}`}</span>
            <Spinner
              animation="border"
              size="sm"
              style={{
                width: '20px',
                height: '20px',
                display: 'none',
                color: '#e87525',
              }}
            />
          </button>

          <small>or</small>

          <LoadingButton
            type="button"
            className={cls('btn btn-outline btn-outline-gray', styles.btnSocial)}
            data-provider="google"
            data-action-text={`Sign ${isLoginAuthType ? 'in' : 'up'} with Google`}
            onClick={signInWith3rdParty}
            // isLoading={authRequestLoading}
            isLoading={false}
            disabled={authRequestLoading}
          >
            <GoogleIcon fontSize="large" />
            <span className="text">{`Sign ${
              isLoginAuthType ? 'in' : 'up'
            } with Google`}</span>
            <Spinner
              animation="border"
              size="sm"
              style={{
                width: '20px',
                height: '20px',
                display: 'none',
                color: '#0955a1',
              }}
            />
          </LoadingButton>

          <LoadingButton
            type="button"
            className={cls('btn btn-outline btn-outline-gray', styles.btnSocial)}
            data-provider="facebook"
            onClick={signInWith3rdParty}
            // isLoading={authRequestLoading}
            data-action-text={`Sign ${isLoginAuthType ? 'in' : 'up'} with Facebook`}
            isLoading={false}
            disabled={authRequestLoading}
          >
            <FacebookIcon fontSize="large" />
            <span className="text">{`Sign ${
              isLoginAuthType ? 'in' : 'up'
            } with Facebook`}</span>
            <Spinner
              animation="border"
              size="sm"
              style={{
                width: '20px',
                height: '20px',
                display: 'none',
                color: '#0955a1',
              }}
            />
          </LoadingButton>

          <LoadingButton
            type="button"
            className={cls('btn btn-outline btn-outline-gray', styles.btnSocial)}
            data-provider="twitter"
            onClick={signInWith3rdParty}
            // isLoading={authRequestLoading}
            data-action-text={`Sign ${isLoginAuthType ? 'in' : 'up'} with Twitter`}
            isLoading={false}
            disabled={authRequestLoading}
          >
            <TwitterIcon fontSize="large" />
            <span className="text">{`Sign ${
              isLoginAuthType ? 'in' : 'up'
            } with Twitter`}</span>
            <Spinner
              animation="border"
              size="sm"
              style={{
                width: '20px',
                height: '20px',
                display: 'none',
                color: '#0955a1',
              }}
            />
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
