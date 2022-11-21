import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import {
  getSession,
  useSession,
  UseSessionOptions,
  signOut,
  SignOutResponse,
} from 'next-auth/react';
import { Session } from 'next-auth';

import { useRouter } from 'next/router';
import useRequest from '../../hooks/useRequest';
import cls from 'classnames';

import Auth from '../auth/Auth';
import Modal from '../shared/modal/Modal';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LoadingButton from '../shared/button/Button';
import { Icon } from '@iconify/react';
import styles from './Navbar.module.scss';

interface NavbarProps {
  bg?: string;
  styleName?: string;
  position?: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';
  children?: React.ReactNode;
  lightLogo?: boolean;
}
type AuthType = 'login' | 'register';

function Navbar({ bg, styleName, position, lightLogo, children }: NavbarProps) {
  const [userWantsToAuth, setUserWantsToAuth] = useState<{
    yes: boolean;
    authType: AuthType | null;
  }>({ yes: false, authType: null });

  const router = useRouter();
  const { data: authSession, status: authStatus } = useSession({
    required: false,
    onUnauthenticated() {
      setUserWantsToAuth({ yes: false, authType: 'login' });
    },
  });
  const { send: sendLogooutRequest, loading: isLoggingOut } = useRequest({
    autoStopLoading: true,
  });

  const handleSignOut: React.MouseEventHandler<HTMLButtonElement> = async () => {
    await sendLogooutRequest(signOut({ redirect: false }));
  };

  const triggerAuthModal: React.MouseEventHandler<HTMLElement> = ev => {
    // if (!(ev.target instanceof HTMLButtonElement)) return;
    const btn = (ev.target as HTMLElement).closest('button')!;
    console.log(btn.dataset);
    setUserWantsToAuth({
      yes: true,
      authType: btn.dataset.authType as AuthType,
    });
  };

  const closeAuthModal = useCallback(() => {
    setUserWantsToAuth({ yes: false, authType: null });
  }, [setUserWantsToAuth]);

  return (
    <nav
      className={cls(styles.nav, styleName || '')}
      style={{ backgroundColor: bg, position: position || 'relative' }}
    >
      <Link href="/">
        <div className={styles['nav-logo']}>
          <Image
            src={`/img/localinspire-logo${lightLogo ? '-white' : ''}.${
              lightLogo ? 'png' : 'jpeg'
            }`}
            // src="/img/localinspire-logo.jpeg"
            alt="Local Inspire Logo"
            width={170}
            height={32}
          />
        </div>
      </Link>

      {children}

      <div
        className={cls(styles.iconTrigger, styles.searchIcon)}
        style={{ marginLeft: 'auto' }}
      >
        <Icon icon="akar-icons:search" color="#fff" width={20} />
      </div>

      {/* <div className={cls(styles.iconTrigger, styles.userIcon)}>
        <Icon icon="mdi:user" color="white" width={25} />
      </div> */}

      <div className={styles['nav-auth']}>
        {!authSession ? (
          <>
            {/* <button
              className="btn btn-outline-transp btn--sm"
              data-auth-type="login"
              onClick={triggerAuthModal}
            >
              Login
            </button> */}
            <button onClick={triggerAuthModal} data-auth-type="login">
              <div className={cls(styles.iconTrigger, styles.userIcon)}>
                <Icon icon="mdi:user" color="white" width={25} />
              </div>
            </button>
            <button
              className="btn btn-sec btn--sm"
              data-auth-type="register"
              onClick={triggerAuthModal}
            >
              Join
            </button>
          </>
        ) : null}
        {authSession ? (
          <>
            <div
              className={cls(
                styles.currentUser,
                'd-flex',
                'align-items-center',
                'flex-gap-1',
              )}
            >
              <PersonRoundedIcon htmlColor="white" fontSize="large" />
              {/* @ts-ignore */}
              {authSession?.user?.username}
            </div>
            <LoadingButton
              className="btn btn-outline-red"
              onClick={handleSignOut}
              style={{ color: '#949494' }}
              isLoading={isLoggingOut}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </LoadingButton>
            {/* <button
              className="btn btn-outline-red"
              onClick={handleSignOut}
              style={{ color: '#949494' }}
            >
              Logout
            </button> */}
          </>
        ) : null}
      </div>

      <div className={styles['nav-breadcrumb']}>
        <Icon icon="material-symbols:menu" width={15} color="#eee" />
      </div>
      {userWantsToAuth.yes ? (
        <Auth show authType={userWantsToAuth.authType!} close={closeAuthModal} />
      ) : null}
    </nav>
  );
}

export default Navbar;
