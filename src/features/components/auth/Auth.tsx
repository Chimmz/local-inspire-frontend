import React, { useEffect } from 'react';
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
  const { send: sendAuthRequest, loading: authRequestLoading } = useRequest();
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

  const validateFields = () => {
    const results = [runEmailValidators(), runPasswordValidators()];
    if (authType === 'register') results.unshift(runUsernameValidators());
    console.log(results);
  };

  const loginOrRegister: React.FormEventHandler<HTMLFormElement> = async ev => {
    ev.preventDefault();
    validateFields();

    if (!email || !password || (isLoginAuthType ? false : !username)) {
      return;
    }
    const options: SignInOptions = { email, password, redirect: false };
    if (authType === 'register') options.username = username;

    // console.log(authType);
    const result = await sendAuthRequest(signIn(authType, options));
    if (!result) return;

    const { ok, error, status, url } = result;
    if (ok) {
      close();
    }
    console.table({ ok, error, status, url });
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
        {/* <div className="white-overlay"></div>
        <Spinner /> */}
        <form action="" className={styles.auth} onSubmit={loginOrRegister} noValidate>
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
            isLoading={authRequestLoading}
          >
            {`${isLoginAuthType ? 'Log in' : 'Sign up'}`}
          </LoadingButton>

          <small>or</small>

          <button
            type="button"
            className={cls('btn btn-outline btn-outline-gray', styles.btnSocial)}
          >
            <GoogleIcon fontSize="large" />
            {`Sign ${isLoginAuthType ? 'in' : 'up'} with Google`}
          </button>
          <button
            type="button"
            className={cls('btn btn-outline btn-outline-gray', styles.btnSocial)}
          >
            <FacebookIcon fontSize="large" />
            {`Sign ${isLoginAuthType ? 'in' : 'up'} with Facebook`}
          </button>
          <button
            type="button"
            className={cls('btn btn-outline btn-outline-gray', styles.btnSocial)}
          >
            <TwitterIcon fontSize="large" />
            {`Sign ${isLoginAuthType ? 'in' : 'up'} with Twitter`}
          </button>
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
