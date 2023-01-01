import React, { useRef, useState } from 'react';

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
import CreatePassword from './CreatePassword';
import { isEmail, isRequired } from '../../utils/validators/inputValidators';

interface Props {
  goBack: () => void;
}

const ForgotPassword: React.FC<Props> = props => {
  const { goBack } = props;
  const [resendEmailHandler, setResendEmailHandler] = useState<(() => any) | null>(null);

  const { send: sendChangePasswordRequest, loading } = useRequest({
    autoStopLoading: true,
  });

  const [emailVerificationData, setEmailVerificationData] = useState<{
    shown: boolean;
    promptMsg: string;
    errorMsg: string;
    successMsg: string;
  }>({ shown: false, promptMsg: '', errorMsg: '', successMsg: '' });

  const [pageTitle, setPageTitle] = useState({
    title: 'Forgot Password',
    subtitle:
      "Please enter your email address below and we'll send you instructions on how to reset your password",
  });

  const showPageTitle = (name: string, newText: string) =>
    setPageTitle(titles => ({
      ...titles,
      title: 'Forgot Password',
      subtitle:
        "Please enter your email address below and we'll send you instructions on how to reset your password",
    }));

  const changePageTitle = (name: 'title' | 'subtitle', newText: string) =>
    setPageTitle(titles => ({ ...titles, [name]: newText }));

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
    setValidationErrors: setEmailValidationErrors,
    pushValidationError: pushEmailValidationError,
    clearInput: clearEmail,
    clearValidationErrors: clearEmailErrors,
  } = useInput({
    init: '',
    validators: [
      { fn: isRequired, params: ['Your email is required'] },
      { fn: isEmail, params: [] },
    ],
  });

  const sendEmail = async () => {
    const res = await sendChangePasswordRequest(API.forgotPassword(email));
    console.log(res);
    return res;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async ev => {
    ev.preventDefault();
    const { errorExists } = runEmailValidators();
    if (errorExists) return;

    // const spin5s = () => new Promise((resolve, reject) => setTimeout(resolve, 5000));
    // const result = await sendChangePasswordRequest(spin5s());
    const res = await sendEmail();

    switch (res?.status) {
      case 'SUCCESS':
        changePageTitle('title', 'Check your Email');
        changePageTitle('subtitle', res.fullMsg);
        setResendEmailHandler(sendEmail);
        showEmailVerification();
        break;
      case 'FAIL':
        if (res.reason === 'INVALID_EMAIL') pushEmailValidationError(res.msg);
        break;
    }
  };

  return (
    <>
      <Spinner show={loading} />
      <AuthContentWrapper
        contentTitle={pageTitle.title}
        subtitle={pageTitle.subtitle}
        className={emailVerificationData.successMsg ? 'align-items-center' : ''}
      >
        {emailVerificationData.shown && (
          <EmailVerification
            resendEmail={resendEmailHandler}
            loading={loading}
            goBack={closeEmailVerification}
            promptMsg={emailVerificationData.promptMsg}
          />
        )}
        {(!emailVerificationData.shown && (
          <form noValidate onSubmit={handleSubmit} className="text-center">
            <div className={cls(styles.authField, 'text-center')}>
              <div className={styles.inputGroup}>
                <TextInput
                  type="email"
                  value={email}
                  onChange={handleChangeEmail}
                  className="textfield text-center"
                  placeholder="Enter your email"
                  validationErrors={emailErrors}
                  autoFocus
                  id="email"
                />
              </div>
            </div>

            <button
              className="btn btn-pry mt-3 py-3 px-5 fs-5"
              type="submit"
              disabled={loading}
            >
              Recover your password
            </button>
          </form>
        )) ||
          null}

        {!emailVerificationData.shown ? (
          <AuthNav goBack={goBack} loading={loading} />
        ) : null}
      </AuthContentWrapper>
    </>
  );
};

export default ForgotPassword;
