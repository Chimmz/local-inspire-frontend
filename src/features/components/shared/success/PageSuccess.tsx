import { Icon } from '@iconify/react';
import cls from 'classnames';
import React from 'react';
import styles from './PageSuccess.module.scss';

interface Props {
  title?: string | number;
  description?: string;
  className?: string;
}

function PageSuccess(props: Props) {
  return (
    <div className={cls(styles.success, props.className)}>
      <div className={cls(styles.successIcon, 'mb-5')}>
        <Icon icon="mdi:success" color="#008500" width="50" height="50" />
      </div>
      <h1 className="mb-4">{props.title || 'Successful!'}</h1>
      <small className="text-center mx-auto fs-4">{props.description}</small>
    </div>
  );
}

export default PageSuccess;
