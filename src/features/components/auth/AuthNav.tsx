import React from 'react';
import cls from 'classnames';
import styles from './Auth.module.scss';

interface Props {
  goBack?: () => any;
  goNext?: () => any;
  loading?: boolean;
}

const AuthNav: React.FC<Props> = ({ goBack, goNext, loading }) => {
  return (
    <div
      className={styles.authNav}
      style={{ visibility: loading ? 'hidden' : 'visible' }}
    >
      <button className={cls(styles.btnAuthNav, 'btn btn--sm')} onClick={goBack}>
        {(goBack && (
          <span className="d-flex gap-2">
            <span>&larr;</span>Back
          </span>
        )) ||
          null}
      </button>
      <button className={cls(styles.btnAuthNav, 'btn btn--sm')} onClick={goNext}>
        {goNext ? (
          <span className="d-flex gap-2">
            <span>Next</span>&rarr;
          </span>
        ) : null}
      </button>
    </div>
  );
};

export default AuthNav;
