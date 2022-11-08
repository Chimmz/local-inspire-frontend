import React from 'react';
import styles from './Spinner.module.scss';

interface Props {
  colors?: [string, string];
}

function Spinner({ colors }: Props) {
  return (
    <div className={styles.spinner}>
      <div
        className={styles.dot1}
        style={{ backgroundColor: colors?.[0] || '#000' }}
      ></div>
      <div
        className={styles.dot2}
        style={{ backgroundColor: colors?.[1] || '#000' }}
      ></div>
    </div>
  );
}

export default Spinner;
