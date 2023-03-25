import Link from 'next/link';
import React from 'react';

interface Props {
  getStyle: (classStr: string) => string;
}

const AdminFooter = (props: Props) => {
  const { getStyle } = props;

  return (
    <footer className={getStyle('footer')}>
      <div className={getStyle('container-fluid')}>
        <div className={getStyle('row text-muted')}>
          <div className={getStyle('col-8 text-start')}>
            <ul className={getStyle('list-inline')}>
              <li className={getStyle('list-inline-item')}>
                <a className={getStyle('text-muted')} href="#">
                  Support
                </a>
              </li>
              <li className={getStyle('list-inline-item')}>
                <a className={getStyle('text-muted')} href="#">
                  Privacy
                </a>
              </li>
              <li className={getStyle('list-inline-item')}>
                <a className={getStyle('text-muted')} href="#">
                  Terms of Service
                </a>
              </li>
              <li className={getStyle('list-inline-item')}>
                <a className={getStyle('text-muted')} href="#">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className={getStyle('col-4 text-end')}>
            <p className={getStyle('mb-0')}>
              &copy; 2022 -{' '}
              <Link href="/" className={getStyle('text-muted')}>
                Localinspire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
