import React from 'react';
import cls from 'classnames';
import styles from './Auth.module.scss';

interface Props {
  contentTitle?: string;
  loading?: boolean;
  subtitle?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const AuthContentWrapper: React.FC<Props> = props => {
  const { contentTitle, subtitle, children, loading } = props;

  return (
    <div className={(loading && styles.requesting) || ''}>
      {contentTitle && (
        <h1 className="text-center w-100 mb-5" style={{ color: '#000' }}>
          <span>{contentTitle || 'Welcome!'}</span>
          <p
            className="parag fs-5 mt-3 mx-auto"
            style={{ maxWidth: '50ch', fontSize: '34px' }}
          >
            {subtitle}
          </p>
        </h1>
      )}
      <div className={cls(styles.authContent, props.className)}>{children}</div>
    </div>
  );
};

export default AuthContentWrapper;
