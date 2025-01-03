import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import styles from './Spinner.module.scss';

interface Props {
  show?: boolean;
  colors?: [string, string];
  pageWide?: boolean;
}

function Spinner({ show = true, colors = ['#0084ff', '#e87525'], pageWide }: Props) {
  useEffect(() => {
    // if (!pageWide) return; // There'll not be a dialog if pageWide is false
    // const dialog = document.querySelector('.spinner-modal');
    // const descendantsExceptSpinner = dialog!.querySelectorAll(
    //   "*:not([class*='Spinner'])",
    // );
    // descendantsExceptSpinner?.forEach(
    //   elem => ((elem as HTMLElement).style.backgroundColor = 'rgba(0, 0, 0, 0.1)'),
    // );
  }, []);

  if (!show) return <></>;

  if (pageWide) {
    return <div className={styles.loadingModal}></div>;
  }
  return (
    <div className={styles.spinner}>
      <div className={styles.dot1} style={{ backgroundColor: colors[0] }}></div>
      <div className={styles.dot2} style={{ backgroundColor: colors[1] }}></div>
    </div>
  );
}

export default Spinner;
