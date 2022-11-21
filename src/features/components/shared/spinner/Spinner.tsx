import React from 'react';
import styles from './Spinner.module.scss';

interface Props {
  colors?: [string, string];
}

function Spinner({ colors = ['#0084ff', '#e87525'] }: Props) {
  return (
    <div className={styles.spinner}>
      <div className={styles.dot1} style={{ backgroundColor: colors[0] }}></div>
      <div className={styles.dot2} style={{ backgroundColor: colors[1] }}></div>
    </div>
  );
}

export default Spinner;
