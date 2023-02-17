import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Icon } from '@iconify/react';
import Modal from 'react-bootstrap/Modal';
import AuthOptions from './AuthOptions';
import LoginForm from './LoginForm';
import SignupForm from './signup/SignupForm';
import MoreSignupDetails from './signup/MoreSignupDetails';
import ForgotPassword from './ForgotPassword';
import styles from './Auth.module.scss';
import { useAuthModalContext } from '../../contexts/AuthContext';

interface AuthProps {
  show: boolean;
  authType: 'login' | 'register';
  onExit?: () => any;
}

const enum ContentTypes {
  authOptions = 'Login strategies content',
  loginForm = 'Credentials form content',
  signupForm = 'Signup content',
  forgotPassword = 'Forgot password content',
  moreSignupDetails = 'More signup details content',
}

type Content =
  | ContentTypes.authOptions
  | ContentTypes.loginForm
  | ContentTypes.forgotPassword
  | ContentTypes.signupForm
  | ContentTypes.moreSignupDetails;

const Auth: React.FC<AuthProps> = function ({ show, authType, onExit }) {
  const authData = useAuthModalContext();
  const [content, setContent] = useState<Content>(ContentTypes.authOptions);

  const switchToAuthOptions = () => setContent(ContentTypes.authOptions);
  const switchToLogin = () => setContent(ContentTypes.loginForm);
  const switchToSignup = () => setContent(ContentTypes.signupForm);
  const switchToMoreSignupDetails = () => setContent(ContentTypes.moreSignupDetails);
  const switchToForgotPassword = () => setContent(ContentTypes.forgotPassword);

  const getBodyContent = function () {
    switch (content) {
      case ContentTypes.authOptions:
        return (
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
            <AuthOptions
              authType={authType}
              goToSignup={switchToSignup}
              goToLogin={switchToLogin}
              closeModal={authData?.closeAuthModal!}
            />
          </GoogleOAuthProvider>
        );

      case ContentTypes.loginForm:
        return (
          <LoginForm
            show
            goBack={switchToAuthOptions}
            goToSignup={switchToSignup}
            goToForgotPassword={switchToForgotPassword}
            closeModal={authData?.closeAuthModal!}
          />
        );

      case ContentTypes.forgotPassword:
        return <ForgotPassword goBack={switchToLogin} />;

      case ContentTypes.signupForm:
        return (
          <SignupForm
            goBack={switchToAuthOptions}
            goNext={switchToMoreSignupDetails}
            goToLogin={switchToLogin}
          />
        );

      case ContentTypes.moreSignupDetails:
        return (
          <MoreSignupDetails closeModal={authData?.closeAuthModal!} goBack={switchToSignup} />
        );
    }
  };

  return (
    <Modal
      show={show}
      onHide={authData?.closeAuthModal}
      onExit={onExit}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
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

      <Modal.Body className="modal-body p-5 text-center">{getBodyContent()}</Modal.Body>

      <Modal.Footer className="text-center" style={{ fontSize: '13px' }}>
        <small style={{ margin: '0 auto', maxWidth: '60ch' }}>
          By proceeding, you agree to our Terms of Use and confirm you have read our Privacy
          Policy.
        </small>
      </Modal.Footer>
    </Modal>
  );
};

export default Auth;
