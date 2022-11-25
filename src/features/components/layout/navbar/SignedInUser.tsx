import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import NavDropdown from 'react-bootstrap/NavDropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import cls from 'classnames';
import Image from 'next/image';
import styles from './Navbar.module.scss';
import { signOut, useSession } from 'next-auth/react';
import { Spinner } from 'react-bootstrap';
import useRequest from '../../../hooks/useRequest';

interface Props {
  session: { [key: string]: any };
}

const SignedInUser: React.FC<Props> = function ({}) {
  const { data: session, status } = useSession();
  const { send: sendSignOutRequest, loading: isSigningOut } = useRequest({});

  const handleSignOut: React.MouseEventHandler<HTMLButtonElement> = async () => {
    await sendSignOutRequest(signOut({ redirect: false }));
  };

  return (
    <div
      className={cls(
        styles.currentUser,
        styles.signedInUser,
        'd-flex',
        'align-items-center',
        'flex-gap-1',
      )}
    >
      <NavDropdown
        className={styles.dropdownToggler}
        color="white"
        title={
          <>
            <Image src="/img/default-profile-pic.jpeg" width={50} height={50} />
            <span className={styles.userName}>{(session as any)?.user?.username}</span>
          </>
        }
        align="end"
      >
        <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
          <PersonRoundedIcon fontSize="large" />
          View profile
        </NavDropdown.Item>
        <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
          <SettingsIcon fontSize="large" />
          Account information
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item
          className="fs-5 d-flex align-items-center gap-3"
          onClick={handleSignOut}
        >
          <LogoutIcon fontSize="large" style={{ color: 'red' }} />
          {isSigningOut && <Spinner animation="border" size="sm" />}
          {isSigningOut ? 'Logging out...' : 'Log out'}
        </NavDropdown.Item>
      </NavDropdown>
    </div>
  );
};

export default SignedInUser;
