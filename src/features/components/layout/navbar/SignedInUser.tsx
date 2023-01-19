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

const SignedInUser: React.FC = function ({}) {
  const { data: session, status } = useSession();
  const { send: sendSignOutRequest, loading: isSigningOut } = useRequest({});

  const handleSignOut: React.MouseEventHandler<HTMLButtonElement> = async () => {
    await sendSignOutRequest(signOut({ redirect: false }));
  };

  if (!session) return <></>;
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
            <Image src={session?.user.imgUrl} width={30} height={30} objectFit="cover" />
            <span className={styles.userName}>{session?.user?.firstName || ''}</span>
          </>
        }
        align="end"
      >
        <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
          <PersonRoundedIcon fontSize="large" style={{ width: '20px', height: '20px' }} />
          View profile
        </NavDropdown.Item>
        <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
          <SettingsIcon fontSize="large" style={{ width: '20px', height: '20px' }} />
          Account information
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item
          className="fs-5 d-flex align-items-center gap-3"
          onClick={handleSignOut}
        >
          <LogoutIcon
            fontSize="large"
            style={{ color: 'red', width: '20px', height: '20px' }}
          />
          {isSigningOut && <Spinner animation="border" size="sm" />}
          {isSigningOut ? 'Logging out...' : 'Log out'}
        </NavDropdown.Item>
      </NavDropdown>
    </div>
  );
};

export default SignedInUser;
