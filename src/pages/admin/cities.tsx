import React, { useEffect, useCallback } from 'react';
import styles from '../../styles/sass/pages/AdminPage.module.css';
import cls from 'classnames';
import useToggle from '../../features/hooks/useToggle';
import AdminSidebar from '../../features/components/admin/sidebar/AdminSidebar';
import AdminNavbar from '../../features/components/admin/AdminNavbar';
import AdminFooter from '../../features/components/admin/AdminFooter';
import CitiesMain from '../../features/components/admin/pages/cities/main';
import { GetStaticProps } from 'next';
import api from '../../features/library/api';
import { useRouter } from 'next/router';
import useSignedInUser from '../../features/hooks/useSignedInUser';

const AdminCitiesPage = function () {
  const { state: sidebarOpened, toggle: toggleSidebar } = useToggle();
  const router = useRouter();
  const currentUser = useSignedInUser();

  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role !== 'MAIN_ADMIN') router.back();
  }, [currentUser]);

  const getStyle = useCallback((className: string) => {
    return cls(...className.split(' ').map(word => styles[word]));
  }, []);

  return (
    <div className={getStyle('wrapper')}>
      <AdminSidebar show={sidebarOpened} getStyle={getStyle} />

      <div className={getStyle('main')}>
        <AdminNavbar getStyle={getStyle} toggleSidebar={toggleSidebar} />
        <CitiesMain getStyle={getStyle} />
        <AdminFooter getStyle={getStyle} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async context => {
  try {
    const res = await api.getAllCities();
    if (['FAIL', 'ERROR'].includes(res.status)) throw Error(res.msg);

    return { props: res };
  } catch (err) {
    return {
      props: { error: (err as Error).message },
    };
  }
};

export default AdminCitiesPage;
