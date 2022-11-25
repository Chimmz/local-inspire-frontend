import React from 'react';
import { Icon } from '@iconify/react';
import styles from './Auth.module.scss';
import cls from 'classnames';

interface SuccessProps {
  children: string;
}

const AuthSuccess: React.FC<SuccessProps> = props => {
  return (
    <div className={styles.authSuccess}>
      <div className={cls(styles.successIcon, 'mb-5')}>
        <Icon icon="mdi:success" color="#008500" width="50" height="50" />
      </div>
      {props.children}
    </div>
  );
};

export default AuthSuccess;
