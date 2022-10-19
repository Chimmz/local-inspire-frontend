import React, { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './Navbar.module.scss';
import ReactDOM, { createPortal } from 'react-dom';
import Modal from '../shared/modal/Modal';
import Auth from '../auth/Auth';

interface NavbarProps {
  bg?: string;
}
type AuthType = 'login' | 'register';

function Navbar({ bg }: NavbarProps) {
  const [userWantsToAuth, setUserWantsToAuth] = useState<{
    yes: boolean;
    authType: AuthType | null;
  }>({ yes: false, authType: null });

  const triggerAuthModal: React.MouseEventHandler<HTMLButtonElement> = ev => {
    if (!(ev.target instanceof HTMLButtonElement)) return;
    setUserWantsToAuth({
      yes: true,
      authType: ev.target.dataset.authType as AuthType,
    });
  };

  const closeAuthModal = () => setUserWantsToAuth({ yes: false, authType: null });

  return (
    <nav className={styles.nav} style={{ backgroundColor: bg }}>
      <a className={styles['nav-logo']} href="#">
        <img src="img/localinspire-logo-white.png" alt="" />
      </a>
      <div className={styles['nav-auth']}>
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
          Register
        </button>
      </div>
      <div className={styles['nav-breadcrumb']}>
        <MenuIcon />
      </div>
      <Auth
        show={userWantsToAuth.yes}
        authType={userWantsToAuth.authType!}
        close={closeAuthModal}
      />
    </nav>
  );
}

export default Navbar;
