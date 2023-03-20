import React, { useCallback } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { NextAuthOptions, unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import Link from 'next/link';
import { PrivateMessage } from '../../features/types';

import useToggle from '../../features/hooks/useToggle';
import useSignedInUser from '../../features/hooks/useSignedInUser';
import api from '../../features/library/api';
import cls from 'classnames';

import AdminSidebar from '../../features/components/admin/sidebar/AdminSidebar';
import AdminNavbar from '../../features/components/admin/AdminNavbar';
import FiltersPage from '../../features/components/admin/pages/filters/FiltersPage';
import styles from '../../styles/sass/pages/AdminPage.module.css';

interface AdminPageProps {
  messages: PrivateMessage[] | undefined;
}

const AdminPage: NextPage<AdminPageProps> = function (props) {
  const { state: sidebarOpened, toggle: toggleSidebar } = useToggle();
  const adminUser = useSignedInUser();

  const getStyle = useCallback((className: string) => {
    return cls(...className.split(' ').map(word => styles[word]));
  }, []);

  return (
    <div className={getStyle('wrapper')}>
      <AdminSidebar show={sidebarOpened} getStyle={getStyle} />

      <div className={getStyle('main')}>
        <AdminNavbar getStyle={getStyle} toggleSidebar={toggleSidebar} />

        <main className={getStyle('content')}>
          {/* <div className={getStyle('header')}>
            <h1 className={getStyle('header-title fs-1')}>
              Welcome back, {adminUser.firstName}!
            </h1>
            <p className={getStyle('header-subtitle fs-4')}>
              You have {quantitize(props.messages?.length || 0, ['new message', 'new messages'])}
              .
            </p>
          </div> */}
          <FiltersPage getStyle={getStyle} pageTitle="Filters" />
        </main>
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
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async function ({ req, res }) {
  const session = await unstable_getServerSession(req, res, authOptions as NextAuthOptions);

  if (!session || session.user.role !== 'MAIN_ADMIN')
    return { redirect: { destination: '/', permanent: true } };

  const newMessages = await api.getUnreadMsgs(session.user.accessToken);

  return { props: { ...newMessages } };
};

export default AdminPage;
