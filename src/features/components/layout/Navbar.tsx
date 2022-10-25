import React, { useCallback, useEffect, useState } from 'react';
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

import Auth from '../auth/Auth';
import Modal from '../shared/modal/Modal';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import cls from 'classnames';
import styles from './Navbar.module.scss';
import Image from 'next/image';

interface NavbarProps {
  bg?: string;
}
type AuthType = 'login' | 'register';

function Navbar({ bg }: NavbarProps) {
  const [userWantsToAuth, setUserWantsToAuth] = useState<{
    yes: boolean;
    authType: AuthType | null;
  }>({ yes: false, authType: null });

  const router = useRouter();

  const { data: authSession, status: authStatus } = useSession();

  const handleSignOut: React.MouseEventHandler<HTMLButtonElement> = async () => {
    await signOut({ redirect: false });
  };

  const triggerAuthModal: React.MouseEventHandler<HTMLButtonElement> = ev => {
    if (!(ev.target instanceof HTMLButtonElement)) return;
    setUserWantsToAuth({
      yes: true,
      authType: ev.target.dataset.authType as AuthType,
    });
  };

  const closeAuthModal = useCallback(() => {
    setUserWantsToAuth({ yes: false, authType: null });
  }, []);

  return (
    <nav className={styles.nav} style={{ backgroundColor: bg }}>
      <a className={styles['nav-logo']} href="#">
        <Image
          src="/img/localinspire-logo-white.png"
          alt="Local Inspire"
          width={150}
          height={30}
        />
      </a>
      <div className={styles['nav-auth']}>
        {!authSession ? (
          <>
            <button
              className="btn btn-outline-white"
              data-auth-type="login"
              onClick={triggerAuthModal}
            >
              Login
            </button>
            <button
              className="btn btn-pry"
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
              {authSession?.user?.username || authSession?.user?.name}
            </div>
            <button
              className="btn btn-outline-red"
              onClick={handleSignOut}
              style={{ color: '#949494' }}
            >
              Logout
            </button>
          </>
        ) : null}
      </div>
      <div className={styles['nav-breadcrumb']}>
        <MenuIcon />
      </div>
      {userWantsToAuth.yes ? (
        <Auth show authType={userWantsToAuth.authType!} close={closeAuthModal} />
      ) : null}
    </nav>
  );
}

export default Navbar;
