import React from 'react';
import styles from './Spinner.module.scss';

interface Props {
  show?: boolean;
  colors?: [string, string];
}

function Spinner({ show = true, colors = ['#0084ff', '#e87525'] }: Props) {
  if (!show) return <></>;
  return (
    <div className={styles.spinner}>
      <div className={styles.dot1} style={{ backgroundColor: colors[0] }}></div>
      <div className={styles.dot2} style={{ backgroundColor: colors[1] }}></div>
    </div>
  );
}

export default Spinner;
