import React, { useState, useEffect, useRef, useMemo } from 'react';
import useRequest from '../../hooks/useRequest';

import cls from 'classnames';
import Modal from 'react-bootstrap/Modal';
import { Icon } from '@iconify/react';
import AuthOptions, { AuthOptionsProps } from './AuthOptions';
import ForgotPassword from './ForgotPassword';
import CredentialsForm from './CredentialsForm';
import styles from './Auth.module.scss';

interface AuthProps {
  show: boolean;
  authType: 'login' | 'register';
  close: () => void;
}

const enum PossibleContent {
  authOptions = 'Login strategies content',
  credentialsForm = 'Credentials form content',
  forgotPassword = 'Forgot password content',
}
type Content =
  | PossibleContent.authOptions
  | PossibleContent.credentialsForm
  | PossibleContent.forgotPassword;

const Auth: React.FC<AuthProps> = function ({ show, authType, close: closeModal }) {
  const [content, setContent] = useState<Content>(PossibleContent.authOptions);

  const {
    send: sendAuthRequest,
    loading: authRequestLoading,
    startLoading: showLoader,
    stopLoading: stopAuthRequestLoading,
  } = useRequest({
    autoStopLoading: false,
  });

  const switchToAuthOptions = () => setContent(PossibleContent.authOptions);
  const switchToCredentialsForm = () => setContent(PossibleContent.credentialsForm);
  const switchToForgotPassword = () => setContent(PossibleContent.forgotPassword);

  const getContent = () => {
    switch (content) {
      case PossibleContent.authOptions:
        console.log('Current page: ', PossibleContent.authOptions);
        return (
          <AuthOptions
            authType={authType}
            authRequestLoading={authRequestLoading}
            goToCredentialsForm={switchToCredentialsForm}
          />
        );
      case PossibleContent.credentialsForm:
        return (
          <CredentialsForm
            show
            authType={authType}
            goBack={switchToAuthOptions}
            goToForgotPassword={switchToForgotPassword}
            closeModal={closeModal}
          />
        );
      case PossibleContent.forgotPassword:
        return <ForgotPassword goBack={switchToCredentialsForm} />;
    }
  };

  return (
    <Modal
      show={show}
      onHide={closeModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
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

// const btn = (ev.target as HTMLElement).closest('button')!;
// const span = btn.querySelector('span.text')!;
// const spinner = btn.querySelector('.spinner-border') as HTMLElement;

// span && (span.textContent = 'Loading...');
// spinner.style.display = 'inline-block';

// const provider = btn.dataset.provider;
