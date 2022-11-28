import React from 'react';
import AuthContentWrapper from '../AuthContentWrapper';

import useInput from '../../../hooks/useInput';
import { useAuthContext } from '../../../contexts/AuthContext';

import cls from 'classnames';
import { Spinner } from 'react-bootstrap';
import AuthNav from '../AuthNav';
import TextInput from '../../shared/text-input/TextInput';
import styles from '../Auth.module.scss';

interface Props {
  goBack: () => void;
  goNext: () => void;
  goToLogin: () => void;
}

const SignupForm: React.FC<Props> = props => {
  const authData = useAuthContext();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (ev): void => {
    ev.preventDefault()
    
    const allErrors = [
      authData!.newRegistration.runFirstNameValidators(),
      authData!.newRegistration.runLastNameValidators(),
      authData!.newRegistration.runEmailValidators(),
      authData!.newRegistration.runPasswordValidators(),
    ];

    if (!allErrors.flat().length) return props.goNext();

    const errorSetters = [
      authData!.newRegistration.setFirstNameValidationErrors,
      authData!.newRegistration.setLastNameValidationErrors,
      authData!.newRegistration.setEmailValidationErrors,
      authData!.newRegistration.setPasswordValidationErrors,
    ];
    errorSetters.forEach((set, i) => set(allErrors[i]));
  };

  return (
    <AuthContentWrapper
      contentTitle="Hey, traveler!"
      subtitle="Localinspire is a place for people to get new ideas
    and find great things to do in any city. Join now ─ it's free"
    >
      <form
        onSubmit={handleSubmit}
        className={cls(styles.signupForm)}
        noValidate
        autoComplete="off"
      >
        <div className={cls(styles.authField, styles.firstNameField)}>
          <TextInput
            type="text"
            value={authData?.newRegistration.firstName || ''}
            onChange={authData?.newRegistration.handleChangeFirstName}
            className="textfield"
            placeholder="Your first name"
            validationErrors={authData?.newRegistration.firstNameErrors}
          />
        </div>

        <div className={cls(styles.authField, styles.lastNameField)}>
          <TextInput
            type="text"
            value={authData?.newRegistration.lastName || ''}
            onChange={authData?.newRegistration.handleChangeLastName as () => any}
            className="textfield"
            placeholder="Your last name"
            validationErrors={authData?.newRegistration.lastNameErrors}
          />
        </div>

        {/* <Spinner show={isAuthenticating} /> */}

        <div className={styles.authField}>
          <div className={styles.inputGroup}>
            <TextInput
              type="email"
              value={authData?.newRegistration.email || ''}
              onChange={authData?.newRegistration.handleChangeEmail}
              className="textfield"
              placeholder="Enter your email"
              validationErrors={authData?.newRegistration.emailErrors}
            />
          </div>
        </div>

        <div className={styles.authField}>
          <div className={styles.inputGroup}>
            <TextInput
              type="password"
              value={authData?.newRegistration.password || ''}
              onChange={authData?.newRegistration.handleChangePassword}
              placeholder="Password"
              className="textfield"
              validationErrors={authData?.newRegistration.passwordErrors}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-pry d-flex align-items-center justify-content-center gap-4"
          // disabled={isAuthenticating}
        >
          <span className="text">Next</span>
        </button>

        <small
          // onClick={isAuthenticating ? () => {} : props.goToForgotPassword}
          className="d-flex gap-2 mx-auto"
        >
          Already have an account?
          <a
            href="#"
            className={styles.link}
            style={{ fontSize: '13px' }}
            onClick={props.goToLogin}
          >
            Login
          </a>
        </small>
      </form>
      <AuthNav
        goBack={props.goBack}
        // loading={isAuthenticating}
      />
    </AuthContentWrapper>
  );
};
export default SignupForm;
