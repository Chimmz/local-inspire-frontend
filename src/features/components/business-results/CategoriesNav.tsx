import { Dispatch, FC, SetStateAction } from 'react';
import Link from 'next/link';

import { useUserLocationContext } from '../../contexts/UserLocationContext';

import * as urlUtils from '../../utils/url-utils';
import cls from 'classnames';

import styles from './CategoriesNav.module.scss';

interface CategoriesNavProps {
  searchParams: { category: string; city: string; stateCode: string };
  setPageLoading?: Dispatch<SetStateAction<boolean>>;
}

const CategoriesNav: FC<CategoriesNavProps> = function (props) {
  const { userLocation } = useUserLocationContext();

  const {
    city: currentCity = userLocation?.cityName,
    stateCode: currentStateCode = userLocation?.stateCode,
  } = props.searchParams;

  const popularCategories = [
    'Hotels and motels',
    'Restaurants',
    'Cabins Rentals',
    'Vacation Rentals',
    'Things to do',
    'Cruises',
  ];

  return (
    <nav className={cls(styles.categoriesNav, 'no-bullets')}>
      <ul className={cls(styles.categories, 'container')}>
        {popularCategories.map(categ => {
          const href = urlUtils.getBusinessSearchResultsUrl({
            category: categ,
            city: currentCity || '',
            stateCode: currentStateCode || '',
          });
          return (
            <li key={categ}>
              <Link href={href} passHref>
                <a onClick={props.setPageLoading?.bind(null, true)}>{categ}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CategoriesNav;
