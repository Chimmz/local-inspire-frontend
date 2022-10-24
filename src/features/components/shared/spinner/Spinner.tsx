import React from 'react';
import styles from './Spinner.module.scss';

function Spinner() {
  return (
    <div className={styles.spinner}>
      <div className={styles.dot1}></div>
      <div className={styles.dot2}></div>
    </div>
  );
}

export default Spinner;
