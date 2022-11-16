import { FC } from 'react';
import cls from 'classnames';
import styles from './CategoriesNav.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toLowerSnakeCase } from '../../utils/string-utils';

console.log({ styles });

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
          const category = categ.toLowerCase().split(' ').join('-');
          const href = `/reviews/find=${category}&location=${currentCity}-${currentStateCode}`;

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