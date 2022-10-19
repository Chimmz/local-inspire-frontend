import React, { useState } from 'react';
import styles from './Modal.module.scss';

interface ModalProps {
  show: boolean;
  children: React.ReactNode;
  backdrop?: boolean;
  closable?: boolean;
  closeByBackdrop?: boolean;
  close: Function;
}

function Modal(props: ModalProps) {
  const { show, children, backdrop, closable, closeByBackdrop, close } = props;

  if (!show) return <></>;
  return (
    <>
      <div className={styles.modal}>
        {children}

        {closable ? (
          <span className={styles.close} onClick={() => close()}>
            ×
          </span>
        ) : null}
      </div>
      {backdrop ? (
        <div className={styles.backdrop} onClick={() => closeByBackdrop && close()}></div>
      ) : null}
    </>
  );
}

export default Modal;
