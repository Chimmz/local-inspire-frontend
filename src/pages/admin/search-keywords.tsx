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
import AdminFooter from '../../features/components/admin/AdminFooter';
import KeywordsBody from '../../features/components/admin/pages/keywords/main';

interface KeywordsPageProps {}

const KeywordsPage: NextPage<KeywordsPageProps> = function (props) {
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
          <KeywordsBody getStyle={getStyle} />
        </main>
        <AdminFooter getStyle={getStyle} />
      </div>
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = async function ({ req, res }) {
//   const session = await unstable_getServerSession(req, res, authOptions as NextAuthOptions);

//   if (!session || session.user.role !== 'MAIN_ADMIN')
//     return { redirect: { destination: '/', permanent: true } };

//   const newMessages = await api.getUnreadMsgs(session.user.accessToken);

//   return { props: { ...newMessages } };
// };

export default KeywordsPage;
