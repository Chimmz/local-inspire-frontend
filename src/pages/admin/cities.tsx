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
import { SSRProvider } from 'react-bootstrap';

interface Props {
  cities?: { cities: City[] | undefined; total: number; status: 'SUCCESS' | 'FAIL' | 'ERROR' };
  usaStates: {
    stateNames: string[] | undefined;
    status: 'SUCCESS' | 'FAIL' | 'ERROR';
  };
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
    <SSRProvider>
      <div className={getStyle('wrapper')}>
        <AdminSidebar show={sidebarOpened} getStyle={getStyle} />

        <div className={getStyle('main')}>
          <AdminNavbar getStyle={getStyle} toggleSidebar={toggleSidebar} />
          <CitiesMain
            getStyle={getStyle}
            cities={props.cities?.cities}
            totalCities={props.cities?.total}
            stateNames={props.usaStates.stateNames}
          />
          <AdminFooter getStyle={getStyle} />
        </div>
      </div>
    </SSRProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const initialLimit = 60;
    const responses = await Promise.allSettled([
      api.getCities({ page: 1, limit: initialLimit }),
      api.getUsaStates(),
    ]);

    const [cities, usaStates] = responses
      .filter(res => res.status === 'fulfilled' && res.value)
      .map(res => res.status === 'fulfilled' && res.value);

    if ([cities, usaStates].some(resp => ['FAIL', 'ERROR'].includes(resp.status)))
      throw Error(cities.msg);

    res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=100');

    return { props: { cities, usaStates } };
  } catch (err) {
    return {
      props: { error: (err as Error).message },
    };
  }
};

export default AdminCitiesPage;
