import React from 'react';
import Modal from '../shared/modal/Modal';

import cls from 'classnames';

import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import styles from './Auth.module.scss';
import * as stringUtils from '../../utils/string-utils';
console.log(styles);

interface AuthProps {
  show: boolean;
  authType: 'login' | 'register';
  close: Function;
}

function Auth({ show, authType, close }: AuthProps) {
  const isLoginAuthType = authType === 'login';

  if (!show) return <></>;
  return (
    <Modal show={show} closable backdrop close={close}>
      <h2>{stringUtils.toTitleCase(authType)}</h2>

      <form action="" className={styles.auth}>
        {!isLoginAuthType ? (
          <>
            <label htmlFor="">Username</label>
            <input type="text" className="textfield" />
          </>
        ) : null}

        <label htmlFor="">Email</label>
        <input type="text" className="textfield" />

        <label htmlFor="">Password</label>
        <input type="password" className="textfield" />

        <button type="submit" className="btn btn-pry">
          {`${isLoginAuthType ? 'Log in' : 'Sign up'}`}
        </button>

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
          <TwitterIcon fontSize="large" />{' '}
          {`Sign ${isLoginAuthType ? 'in' : 'up'} with Twitter`}
        </button>
        <small>
          <a href="" className={styles.link}>
            Forgot Password?
          </a>
        </small>
      </form>
    </Modal>
  );
}

export default Auth;
