import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useRequest from '../../../hooks/useRequest';

import { toLowerSnakeCase } from '../../../utils/string-utils';

// import HeaderSearch from './HeaderSearch';
import HeaderServices from './HeaderServices';
import BusinessSearchForm from '../../shared/businesses-search/BusinessSearchForm';
import styles from './Header.module.scss';
import * as utlUtils from '../../../utils/url-utils';

interface HeaderProps {
  defaultCategorySuggestions: string[];
}

function Header({ defaultCategorySuggestions }: HeaderProps) {
  const router = useRouter();

  const {
    startLoading: startSearchLoader,
    stopLoading: stopSearchLoader,
    loading: searchLoading,
  } = useRequest({ autoStopLoading: false });

  const handleClickSearch = (category: string, location: string) => {
    if (!category || !location) return;
    console.log({ category, location });
    const [city, stateCode] = location.split(', ');

    startSearchLoader();
    const url = utlUtils.getBusinessSearchResultsUrl({ category, city, stateCode });
    console.log({ url });
    router.push(url);
  };

  useEffect(() => stopSearchLoader, []);

  return (
    <header className={styles.header}>
      <div className={styles['header-content']}>
        <h1 className="fade-up">
          Where your inspired journey begins!
          <br />
          <span className="parag">
            Discover your next great adventure & inspire local businesses to be great.
          </span>
        </h1>
        {/* <HeaderSearch fontSize="1.4rem" /> */}
        <BusinessSearchForm
          promptUserInput
          fontSize="1.4rem"
          onSearch={handleClickSearch}
          loading={searchLoading}
          defaultCategorySuggestions={defaultCategorySuggestions}
        />
      </div>
      <HeaderServices />
    </header>
  );
}

export default Header;
