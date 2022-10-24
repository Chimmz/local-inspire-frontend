import React from 'react';
import Navbar from '../../layout/Navbar';
import cls from 'classnames';
import SearchIcon from '@mui/icons-material/Search';
import styles from './Header.module.scss';
import HeaderSearch from './HeaderSearch';
import HeaderServices from './HeaderServices';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles['header-content']}>
        <h1 className="fade-up">
          Where your inspired journey begins!
          <br />
          <span className="parag">
            Discover your next great adventure & inspire local businesses to be great.
          </span>
        </h1>
        <HeaderSearch />
      </div>
      <HeaderServices />
    </header>
  );
}

export default Header;
