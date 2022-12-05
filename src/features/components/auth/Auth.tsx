import React, { useState } from 'react';
import useRequest from '../../hooks/useRequest';

import { Icon } from '@iconify/react';
import Modal from 'react-bootstrap/Modal';
import AuthOptions from './AuthOptions';
import LoginForm from './LoginForm';
import SignupForm from './signup/SignupForm';
import MoreSignupDetails from './signup/MoreSignupDetails';
import ForgotPassword from './ForgotPassword';
import styles from './Auth.module.scss';

interface AuthProps {
  show: boolean;
  authType: 'login' | 'register';
  close: () => void;
}

const enum PossibleContent {
  authOptions = 'Login strategies content',
  loginForm = 'Credentials form content',
  signupForm = 'Signup content',
  forgotPassword = 'Forgot password content',
  moreSignupDetails = 'More signup details content',
  // emailVerification = 'Email verification content',
}

type Content =
  | PossibleContent.authOptions
  | PossibleContent.loginForm
  | PossibleContent.forgotPassword
  | PossibleContent.signupForm
  | PossibleContent.moreSignupDetails;
// | PossibleContent.emailVerification;

const Auth: React.FC<AuthProps> = function ({ show, authType, close: closeModal }) {
  const [content, setContent] = useState<Content>(PossibleContent.authOptions);

  const switchToAuthOptions = () => setContent(PossibleContent.authOptions);
  const switchToLogin = () => setContent(PossibleContent.loginForm);
  const switchToSignup = () => setContent(PossibleContent.signupForm);
  const switchToMoreSignupDetails = () => setContent(PossibleContent.moreSignupDetails);
  const switchToForgotPassword = () => setContent(PossibleContent.forgotPassword);

  const getContent = function () {
    switch (content) {
      case PossibleContent.authOptions:
        return (
          <AuthOptions
            authType={authType}
            goToSignup={switchToSignup}
            goToLogin={switchToLogin}
          />
        );

      case PossibleContent.loginForm:
        return (
          <LoginForm
            show
            goBack={switchToAuthOptions}
            goToSignup={switchToSignup}
            goToForgotPassword={switchToForgotPassword}
            closeModal={closeModal}
          />
        );

      case PossibleContent.forgotPassword:
        return <ForgotPassword goBack={switchToLogin} />;

      case PossibleContent.signupForm:
        return (
          <SignupForm
            goBack={switchToAuthOptions}
            goNext={switchToMoreSignupDetails}
            goToLogin={switchToLogin}
          />
        );

      case PossibleContent.moreSignupDetails:
        return <MoreSignupDetails closeModal={closeModal} goBack={switchToSignup} />;
    }
  };

  return (
    <Modal
      show={show}
      onHide={closeModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      // scrollable
    >
      <Modal.Header
        closeButton
        className="p-4 py-3"
        style={{ backgroundColor: '#f8f9fa ', position: 'relative', padding: '5rem' }}
      >
        <div className={styles.modalIconHeader}>
          <Icon icon="mdi:user-circle" color="#024180" width={50} />
        </div>
      </Modal.Header>

      <Modal.Body className="modal-body p-5 text-center">{getContent()}</Modal.Body>

      <Modal.Footer className="text-center" style={{ fontSize: '13px' }}>
        <small style={{ margin: '0 auto', maxWidth: '60ch' }}>
          By proceeding, you agree to our Terms of Use and confirm you have read our
          Privacy Policy.
        </small>
      </Modal.Footer>
    </Modal>
  );
};

export default Auth;
