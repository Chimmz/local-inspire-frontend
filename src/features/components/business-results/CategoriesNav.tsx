import { Dispatch, FC, SetStateAction } from 'react';
import Link from 'next/link';

import * as urlUtils from '../../utils/url-utils';
import cls from 'classnames';
import styles from './CategoriesNav.module.scss';
import useCurrentLocation from '../../hooks/useCurrentLocation';

interface CategoriesNavProps {
  searchParams: { category: string; city: string; stateCode: string };
  setPageLoading?: Dispatch<SetStateAction<boolean>>;
}

const CategoriesNav: FC<CategoriesNavProps> = function (props) {
  const currentLocation = useCurrentLocation();

  const {
    city: currentCity = currentLocation?.state?.split(', ')?.[0],
    stateCode: currentStateCode = currentLocation.state?.split(', ')?.[1],
  } = props.searchParams;

  const popularCategories = [
    'Hotels and motels',
    'Restaurants',
    'Cabins Rentals',
    'Vacation Rentals',
    'Things to do',
    'Cruises',
  ];

  const uniqueItems = Array.from(new Set(popularCategories));

  return (
    <nav className={cls(styles.categoriesNav, 'no-bullets')}>
      <ul className={styles.categories}>
        {uniqueItems.map(categ => {
          const href = urlUtils.getBusinessSearchResultsUrl({
            category: categ,
            city: currentCity,
            stateCode: currentStateCode,
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
