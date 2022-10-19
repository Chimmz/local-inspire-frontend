import React from 'react';
import { Icon } from '@iconify/react';
import cls from 'classnames';
import styles from './Header.module.scss';

function HeaderSearch() {
  return (
    <form action="" className={styles['header-search']}>
      <div className={styles['header-search-field']}>
        <input
          type="text"
          className="textfield"
          placeholder="Ex: hotel, restaurant..."
        />
        <label htmlFor="">Find:</label>
      </div>
      <div className={styles['header-search-field']}>
        <input type="text" className="textfield" placeholder="Your city" />
        <label htmlFor="">Near:</label>
      </div>
      <button className={cls(styles.btn, 'btn btn-pry')} type="submit">
        <Icon icon="akar-icons:search" />
      </button>
    </form>
  );
}

export default HeaderSearch;
