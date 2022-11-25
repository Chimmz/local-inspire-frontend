import React, { useState } from 'react';
import { signIn, SignInOptions, SignInResponse } from 'next-auth/react';

import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import MailLockIcon from '@mui/icons-material/MailLock';
import LoadingButton from '../shared/button/Button';
import cls from 'classnames';
import styles from './Auth.module.scss';
import { AuthType } from '../layout/navbar/Navbar';
import { Spinner } from 'react-bootstrap';
import AuthContentWrapper from './AuthContentWrapper';

export interface AuthOptionsProps {
  authType: AuthType;
  authRequestLoading: boolean;
  goToCredentialsForm: () => void;
}

const AuthOptions: React.FC<AuthOptionsProps> = function (props) {
  const { authType, authRequestLoading } = props;
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const isLoginAuthType = authType === 'login';

  const oAuthenticate: React.MouseEventHandler<HTMLButtonElement> = async ev => {
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

  return (
    <AuthContentWrapper contentTitle="Welcome!">
      <LoadingButton
        type="button"
        className={cls('btn btn-outline btn-outline-gray', styles.btnSocial)}
        data-provider="facebook"
        onClick={oAuthenticate}
        // isLoading={authRequestLoading}
        data-action-text={`Continue with Facebook`}
        isLoading={false}
        disabled={authRequestLoading}
      >
        <FacebookIcon fontSize="large" />
        <span className="text">{`Continue with Facebook`}</span>
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
        data-provider="google"
        data-action-text={`Sign ${isLoginAuthType ? 'in' : 'up'} with Google`}
        onClick={oAuthenticate}
        // isLoading={authRequestLoading}
        isLoading={false}
        disabled={authRequestLoading}
      >
        <GoogleIcon fontSize="large" />
        <span className="text">{`Continue with Google`}</span>
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
      {/* Email & Password auth trigger button */}
      <button
        type="button"
        onClick={() => {
          console.log('Clicked Continue with email and password');
          props.goToCredentialsForm();
        }}
        className={cls(
          'btn btn-outline btn-outline-gray d-flex align-items-center',
          styles.btnSocial,
        )}
      >
        <MailLockIcon fontSize="large" />
        <span className="text">Continue with email and password</span>
      </button>
      {/* <LoadingButton
        type="button"
        className={cls('btn btn-outline btn-outline-gray', styles.btnSocial)}
        data-provider="twitter"
        onClick={signInWith3rdParty}
        // isLoading={authRequestLoading}
        data-action-text="Continue with Twitter"
        isLoading={false}
        disabled={authRequestLoading}
      >
        <TwitterIcon fontSize="large" />
        <span className="text">Continue with Twitter</span>
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
      </LoadingButton> */}
    </AuthContentWrapper>
  );
};

export default AuthOptions;
