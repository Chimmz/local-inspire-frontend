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
import useRequest from '../../../hooks/useRequest';
import cls from 'classnames';

import Auth from '../../auth/Auth';
import Modal from '../../shared/modal/Modal';
import LoadingButton from '../../shared/button/Button';
import { Icon } from '@iconify/react';
import styles from './Navbar.module.scss';
import SignedInUser from './SignedInUser';
import { AuthContextProvider } from '../../../contexts/AuthContext';
import MobileBusinessSearchForm from '../../shared/businesses-search/MobileBusinessSearchForm';
import { NavDropdown } from 'react-bootstrap';

interface NavbarProps {
  bg?: string;
  styleName?: string;
  position?: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';
  children?: React.ReactNode;
  lightLogo?: boolean;
}
export type AuthType = 'login' | 'register';

function Navbar({ bg, styleName, position, lightLogo, children }: NavbarProps) {
  const [userWantsToAuth, setUserWantsToAuth] = useState<{
    yes: boolean;
    authType: AuthType | null;
  }>({ yes: false, authType: null });

  const [searchModalOpen, setSearchOpen] = useState(false);

  const router = useRouter();
  const { data: authSession, status: authStatus } = useSession({
    required: false,
    onUnauthenticated() {
      setUserWantsToAuth({ yes: false, authType: 'login' });
    },
  });
  const { send: sendLogoutRequest, loading: isLoggingOut } = useRequest({
    autoStopLoading: true,
  });

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
        className={cls(styles.search, 'd-flex gap-2')}
        // style={{ marginLeft: 'auto' }}
        onClick={setSearchOpen.bind(null, !searchModalOpen)}
      >
        <Icon icon="akar-icons:search" color="#e87525" width={20} />
        <span>Search</span>
      </div>
      {searchModalOpen ? (
        <MobileBusinessSearchForm close={setSearchOpen.bind(null, false)} />
      ) : null}

      {/* <div className={styles.userIcon}>
        <Icon icon="mdi:user" color="white" width={25} />
      </div> */}

      {authSession ? (
        <div className={styles.icons}>
          <NavDropdown
            className={styles.notifToggler}
            color="white"
            title={<Icon icon="ic:baseline-notifications" color="#fff" width={22} />}
            // align="end"
          >
            <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, sequi!...
            </NavDropdown.Item>
            <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, sequi!...
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, sequi!...
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown
            className={styles.notifToggler}
            color="white"
            title={<Icon icon="ic:round-message" color="#fff" width={22} />}
            // align="end"
          >
            <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, sequi!...
            </NavDropdown.Item>
            <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, sequi!...
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, sequi!...
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      ) : null}

      <div className={styles['nav-auth']}>
        {!authSession ? (
          <>
            <button
              className="btn btn-outline-transp btn--sm"
              data-auth-type="login"
              onClick={triggerAuthModal}
            >
              Login
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
        {authSession ? <SignedInUser /> : null}
      </div>

      <div className={styles['nav-breadcrumb']}>
        <Icon icon="material-symbols:menu" width={15} color="#eee" />
      </div>

      {userWantsToAuth.yes ? (
        <AuthContextProvider>
          <Auth show authType={userWantsToAuth.authType!} close={closeAuthModal} />
        </AuthContextProvider>
      ) : null}
    </nav>
  );
}

export default Navbar;
