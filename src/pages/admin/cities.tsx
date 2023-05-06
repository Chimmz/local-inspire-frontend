import React, { useEffect, useCallback } from 'react';
import styles from '../../styles/sass/pages/AdminPage.module.css';
import cls from 'classnames';
import useToggle from '../../features/hooks/useToggle';
import AdminSidebar from '../../features/components/admin/sidebar/AdminSidebar';
import AdminNavbar from '../../features/components/admin/AdminNavbar';
import AdminFooter from '../../features/components/admin/AdminFooter';
import CitiesMain from '../../features/components/admin/pages/cities/main';
import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import api from '../../features/library/api';
import { useRouter } from 'next/router';
import useSignedInUser from '../../features/hooks/useSignedInUser';
import { City } from '../../features/types';

interface Props {
  status: 'SUCCESS' | 'FAIL' | 'ERROR';
  cities?: City[];
}

const AdminCitiesPage: NextPage<Props> = function (props) {
  const { state: sidebarOpened, toggle: toggleSidebar } = useToggle();
  const router = useRouter();
  const currentUser = useSignedInUser();

  useEffect(() => {
    if (!currentUser.isSignedIn) return;
    if (currentUser.role !== 'MAIN_ADMIN') router.back();
  }, [currentUser.isSignedIn]);

  const getStyle = useCallback((className: string) => {
    return cls(...className.split(' ').map(word => styles[word]));
  }, []);

  return (
    <div className={getStyle('wrapper')}>
      <AdminSidebar show={sidebarOpened} getStyle={getStyle} />

      <div className={getStyle('main')}>
        <AdminNavbar getStyle={getStyle} toggleSidebar={toggleSidebar} />
        <CitiesMain getStyle={getStyle} cities={props.cities} />
        <AdminFooter getStyle={getStyle} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async context => {
  try {
    const cities = await api.getAllCities();
    if (['FAIL', 'ERROR'].includes(cities.status)) throw Error(cities.msg);

    // res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=999');

    return { props: cities, revalidate: 59 };
  } catch (err) {
    return {
      props: { error: (err as Error).message },
    };
  }
};

export default AdminCitiesPage;
