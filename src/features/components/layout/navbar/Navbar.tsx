import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { useRouter } from 'next/router';
import useRequest from '../../../hooks/useRequest';
import { useAuthContext } from '../../../contexts/AuthContext';
import { NewRegistrationContextProvider } from '../../../contexts/NewRegistrationContext';

import * as urlUtils from '../../../utils/url-utils';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import { NavDropdown } from 'react-bootstrap';
import Auth from '../../auth/Auth';
import SignedInUser from './SignedInUser';
import MobileBusinessSearchForm from '../../shared/businesses-search/MobileBusinessSearchForm';
import BusinessSearchForm from '../../shared/businesses-search/BusinessSearchForm';
import styles from './Navbar.module.scss';

export interface NavbarProps {
  bg?: string;
  styleName?: string;
  position?: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';
  children?: React.ReactNode;
  lightLogo?: boolean;
  withSearchForm?: boolean;
  sticky?: boolean;
}
export type AuthType = 'login' | 'register';

function Navbar(props: NavbarProps) {
  const { bg = '#003366', position, lightLogo = true, withSearchForm = true, sticky } = props;

  const authData = useAuthContext();
  const [searchModalOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  const { data: authSession } = useSession({
    required: false,
    onUnauthenticated() {
      authData?.showAuthModal?.('login');
    },
  });

  const {
    startLoading: startNewSearchLoader,
    stopLoading: stopNewSearchLoader,
    loading: newSearchLoading,
  } = useRequest({ autoStopLoading: false });

  const {
    category: currentCategory,
    city: currentCity,
    stateCode: currentStateCode,
  } = router.query;

  const onSearchHandler = (categoryValue: string, locationValue: string) => {
    if (!categoryValue || !locationValue) return;

    let [cityValue, stateValue] = locationValue.split(',');
    [cityValue, stateValue] = [cityValue.trim(), stateValue.trim()];

    if (
      currentCategory === categoryValue.toLowerCase() &&
      currentCity === cityValue.trim().toLowerCase() &&
      currentStateCode === stateValue.trim()
    )
      return console.log('Same as current page query');

    startNewSearchLoader();

    const url = urlUtils.getBusinessSearchResultsUrl({
      category: categoryValue,
      city: cityValue,
      stateCode: stateValue,
    });
    console.log('To push: ', url);
    router.push(url);
  };

  useEffect(() => {
    stopNewSearchLoader();
  }, [router.asPath]);

  return (
    <nav
      className={cls(sticky && styles.sticky)}
      style={{ backgroundColor: bg, position: position || 'relative' }}
    >
      <div className={cls('container', styles.nav, props.styleName)}>
        <Link href="/">
          <div className={styles['nav-logo']}>
            <Image
              src={`/img/localinspire-logo${lightLogo ? '-white' : ''}.${
                lightLogo ? 'png' : 'jpeg'
              }`}
              // src="/img/localinspire-logo.jpeg"
              alt="Local Inspire Logo"
              width={170}
              height={32}
            />
          </div>
        </Link>

        {/* {children} */}
        {withSearchForm ? (
          <BusinessSearchForm
            promptUserInput={false}
            fontSize="13px"
            defaultCategorySuggestions={[
              'Hotels and motels',
              'Restaurants',
              'Cabins Rentals',
              'Vacation Rentals',
              'Things to do',
              'Cruises',
            ]}
            onSearch={onSearchHandler}
            loading={newSearchLoading}
          />
        ) : null}

        <div
          className={cls(styles.search, 'd-flex gap-2')}
          // style={{ marginLeft: 'auto' }}
          onClick={setSearchOpen.bind(null, !searchModalOpen)}
        >
          <Icon icon="akar-icons:search" color="#e87525" width={20} />
          <span>Search</span>
        </div>
        {searchModalOpen ? (
          <MobileBusinessSearchForm close={setSearchOpen.bind(null, false)} />
        ) : null}

        {/* <div className={styles.userIcon}>
        <Icon icon="mdi:user" color="white" width={25} />
      </div> */}

        {authSession ? (
          <div className={styles.icons}>
            <NavDropdown
              className={styles.notifToggler}
              color="white"
              title={<Icon icon="ic:baseline-notifications" color="#fff" width={22} />}
              // align="end"
            >
              <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, sequi!...
              </NavDropdown.Item>
              <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, sequi!...
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, sequi!...
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              className={styles.notifToggler}
              color="white"
              title={<Icon icon="ic:round-message" color="#fff" width={22} />}
              // align="end"
            >
              <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, sequi!...
              </NavDropdown.Item>
              <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, sequi!...
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, sequi!...
              </NavDropdown.Item>
            </NavDropdown>
          </div>
        ) : null}

        <div className={styles['nav-auth']}>
          {!authSession ? (
            <>
              <button
                className="btn btn-outline-transp btn--sm"
                onClick={authData?.showAuthModal?.bind(null, 'login')}
              >
                Login
              </button>
              <button
                className="btn btn-sec btn--sm"
                onClick={authData?.showAuthModal?.bind(null, 'register')}
              >
                Join
              </button>
            </>
          ) : null}
          {authSession ? <SignedInUser /> : null}
        </div>

        <div className={styles['nav-breadcrumb']}>
          <Icon icon="material-symbols:menu" width={15} color="#eee" />
        </div>

        {authData?.isAuthModalOpen ? (
          <NewRegistrationContextProvider>
            <Auth show authType={authData?.authType!} />
          </NewRegistrationContextProvider>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;
