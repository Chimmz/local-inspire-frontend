import React, { useState, useEffect } from 'react';
import { signIn, SignInOptions, SignInResponse } from 'next-auth/react';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';

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
import useRequest from '../../hooks/useRequest';
import { useAuthModalContext } from '../../contexts/AuthContext';

export interface AuthOptionsProps {
  authType: AuthType;
  goToLogin(): void;
  goToSignup(): void;
  closeModal(): void;
}

const AuthOptions: React.FC<AuthOptionsProps> = function (props) {
  const isLoginAuthType = props.authType === 'login';
  const [fbAccessToken, setFbAccessToken] = useState<string | null>(null);
  const [fbProfile, setFbProfile] = useState<null | object>(null);
  const { authTitle, authSubtitle } = useAuthModalContext();

  const {
    send: sendGoogleSignInRequest,
    loading: googleSignInRequestLoading,
    startLoading: startGoogleAuthLoader,
    stopLoading: stopGoogleAuthLoader,
  } = useRequest({ autoStopLoading: true });

  const {
    send: sendFacebookSignInRequest,
    loading: facebookSignInRequestLoading,
    startLoading: startFacebookAuthLoader,
    stopLoading: stopFacebookAuthLoader,
  } = useRequest({ autoStopLoading: true });

  const googleSignIn = useGoogleLogin({
    onSuccess: async response => {
      console.log(response);
      const { access_token } = response;

      const options: SignInOptions = { access_token, redirect: false };
      const result = await sendGoogleSignInRequest(signIn('google-custom', options));
      console.table(result);

      if (result.ok) return props.closeModal();
      if (result.error) return stopGoogleAuthLoader();
    },
    onError: errorResponse => console.log(errorResponse),
  });

  const facebookSignIn = async function () {
    console.log('Profile success', fbProfile);

    const options: SignInOptions = {
      access_token: fbAccessToken,
      profile: JSON.stringify(fbProfile),
      redirect: false,
    };
    const result: SignInResponse = await sendFacebookSignInRequest(
      signIn('facebook-custom', options),
    );
    console.log('FB Result: ', result);

    if (result.ok) return props.closeModal();
    if (result.error) return stopFacebookAuthLoader();
  };

  useEffect(() => {
    if (!fbAccessToken || !fbProfile) return;
    facebookSignIn();
  }, [fbAccessToken, fbProfile]);

  return (
    <AuthContentWrapper contentTitle={authTitle || 'Welcome!'} subtitle={authSubtitle}>
      <FacebookLogin
        appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!}
        onSuccess={resp => setFbAccessToken(resp!.accessToken)}
        onFail={err => console.log('Failed: ', err)}
        onProfileSuccess={setFbProfile as (res: any) => void}
        render={({ onClick: initFacebookOAuth }) => (
          <LoadingButton
            type="button"
            className={cls('btn btn-outline btn-outline-gray', styles.btnSocial)}
            data-provider="facebook"
            onClick={() => {
              startFacebookAuthLoader();
              initFacebookOAuth!();
            }}
            isLoading={facebookSignInRequestLoading}
            disabled={googleSignInRequestLoading || facebookSignInRequestLoading}
          >
            <FacebookIcon fontSize="large" />
            <span className="text">Continue with Facebook</span>
            <Spinner
              animation="border"
              size="sm"
              style={{ width: '20px', height: '20px', display: 'none', color: '#0955a1' }}
            />
          </LoadingButton>
        )}
      />

      <LoadingButton
        type="button"
        className={cls('btn btn-outline btn-outline-gray', styles.btnSocial)}
        onClick={() => {
          startGoogleAuthLoader();
          googleSignIn();
        }}
        isLoading={googleSignInRequestLoading}
        disabled={googleSignInRequestLoading || facebookSignInRequestLoading}
      >
        <GoogleIcon fontSize="large" />
        <span className="text">Continue with Google</span>
        <Spinner
          animation="border"
          size="sm"
          style={{ width: '20px', height: '20px', display: 'none', color: '#0955a1' }}
        />
      </LoadingButton>

      <small>Or</small>

      {/* Email & Password auth trigger button */}
      <button
        type="button"
        onClick={isLoginAuthType ? props.goToLogin : props.goToSignup}
        className={cls(
          styles.btnSocial,
          'btn btn-outline btn-outline-gray d-flex align-items-center',
        )}
        disabled={googleSignInRequestLoading || facebookSignInRequestLoading}
      >
        <MailLockIcon fontSize="large" />
        <span className="text">Continue with email and password</span>
      </button>
    </AuthContentWrapper>
  );
};

export default AuthOptions;
