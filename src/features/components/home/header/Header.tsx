import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useRequest from '../../../hooks/useRequest';

import { toLowerSnakeCase } from '../../../utils/string-utils';

// import HeaderSearch from './HeaderSearch';
import HeaderServices from './HeaderServices';
import BusinessSearchForm from '../../shared/businesses-search/BusinessSearchForm';
import styles from './Header.module.scss';

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

  const handleClickSearch = (categoryValue: string, cityValue: string) => {
    if (!categoryValue || !cityValue) return;

    startSearchLoader();
    const [categParam, cityParam, stateParam] = [
      toLowerSnakeCase(categoryValue),
      toLowerSnakeCase(cityValue),
      'AK',
    ];
    router.push(`/reviews/find=${categParam}&location=${cityParam}-${stateParam}`);
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
