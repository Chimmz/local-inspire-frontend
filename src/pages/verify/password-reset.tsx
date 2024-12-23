import React, { useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';

import { useRouter } from 'next/router';
import useInput from '../../features/hooks/useInput';
import useRequest from '../../features/hooks/useRequest';

import cls from 'classnames';
import API from '../../features/library/api';
import {
  isRequired,
  minLength,
  mustBeSameAs,
} from '../../features/utils/validators/inputValidators';

import Layout from '../../features/components/layout';
import Navbar from '../../features/components/layout/navbar/Navbar';
import Spinner from '../../features/components/shared/spinner/Spinner';
import SuccessFeedback from '../../features/components/shared/success/SuccessFeedback';
import TextInput from '../../features/components/shared/text-input/TextInput';
import styles from '../../styles/sass/pages/PasswordReset.module.scss';

const PasswordReset: NextPage = function () {
  const { send: sendPasswordResetRequest, loading: isVerifying } = useRequest({
    autoStopLoading: true,
  });
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [response, setResponse] = useState<{
    status: 'SUCCESS' | 'FAIL' | 'INVALID_CODE' | null;
  }>({ status: null });

  const router = useRouter();
  console.log(router.query);

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
      // { isStrongPassword: ['Enter a strong password'] },
    ],
  });

  const {
    inputValue: passwordConfirm,
    handleChange: handleChangePasswordConfirm,
    setValidationErrors: setConfirmPasswordValidationErrors,
    runValidators: runConfirmPasswordValidators,
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

  const resetPassword = async (verificationCode?: string) => {
    // const spin5s = () => new Promise((resolve, reject) => setTimeout(resolve, 5000));
    // const result = await sendChangePasswordRequest(spin5s());
    const res = await sendPasswordResetRequest(
      API.resetPassword(router.query.code as string, password),
    );
    console.log('Change password response: ', res);

    switch (res.status) {
      case 'SUCCESS':
        setResponse(res as { status: 'SUCCESS' });
      case 'FAIL':
        if (res.reason === 'INVALID_CODE') {
          setResponse({ ...res, status: 'INVALID_CODE' });
        }
        break;
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();
    const outcomes = [runPasswordValidators(), runConfirmPasswordValidators()];
    if (outcomes.some(result => result.errorExists)) return;
    resetPassword();
  };

  return (
    <Layout>
      <Navbar bg="#003366" lightLogo />
      <main className={styles.main}>
        {response.status === 'SUCCESS' ? (
          <SuccessFeedback title="Password Changed!" description="You can now exit this page" />
        ) : response.status === 'INVALID_CODE' ? (
          'Invalid URL'
        ) : (
          <form noValidate onSubmit={handleSubmit} className={styles.form}>
            <Image src="/img/localinspire-logo.jpeg" alt="" width={150} height={30} />
            <Spinner show={isVerifying} />
            {/* <h2 className="mt-5 fs-1">Hi, Chima.</h2> */}
            <p
              style={{ fontSize: '14px', color: '#777', maxWidth: '40ch' }}
              className="mt-4 mb-5 mx-auto"
            >
              Create a new password.{' '}
              <span className="d-block">We recommend using a strong password.</span>
            </p>
            <div className={cls(styles.authField, 'mb-4')}>
              <TextInput
                type="password"
                value={password}
                onChange={handleChangePassword}
                label="New password"
                className="textfield"
                placeholder="Enter a new password"
                validationErrors={passwordErrors}
                id="password"
              />
            </div>
            <div className={cls(styles.authField, 'mb-4')}>
              <TextInput
                type="password"
                value={passwordConfirm}
                label="Password confirm"
                onChange={handleChangePasswordConfirm}
                className="textfield"
                placeholder="Confirm your new password"
                validationErrors={passwordConfirmErrors}
                id="passwordConfirm"
              />
            </div>
            <button
              className="btn btn-pry mt-5 px-5 py-3 mx-auto d-block w-100 mt-3"
              type="submit"
              disabled={!!passwordErrors.length || !!passwordConfirmErrors.length || isVerifying}
            >
              Continue
            </button>
          </form>
        )}
      </main>
    </Layout>
  );
};

export default PasswordReset;
