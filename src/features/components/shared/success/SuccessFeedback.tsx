import { Icon } from '@iconify/react';
import cls from 'classnames';
import React from 'react';
import styles from './SuccessFeedback.module.scss';

interface Props {
  title?: string | number;
  description?: string;
  className?: string;
  showSuccessIcon?: boolean;
}

function SuccessFeedback({ className, showSuccessIcon = true, title, description }: Props) {
  return (
    <div className={cls(styles.success, className)}>
      {showSuccessIcon ? (
        <div className={cls(styles.successIcon, 'mb-4')}>
          <Icon icon="mdi:success" color="#008500" width="50" height="50" />
        </div>
      ) : null}
      <h1 className="mb-4">{title || 'Successful!'}</h1>
      <small className="text-center mx-auto fs-4">{description}</small>
    </div>
  );
}

export default SuccessFeedback;
