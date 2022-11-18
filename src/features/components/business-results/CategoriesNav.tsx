import { FC } from 'react';
import Link from 'next/link';

import * as urlUtils from '../../utils/url-utils';
import cls from 'classnames';
import styles from './CategoriesNav.module.scss';

interface CategoriesNavProps {
  popularCategories: string[];
  searchParams: { category: string; city: string; stateCode: string };
}

const CategoriesNav: FC<CategoriesNavProps> = function (props) {
  const { popularCategories } = props;
  const { city: currentCity, stateCode: currentStateCode } = props.searchParams;

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
              <Link href={href}>{categ}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CategoriesNav;
