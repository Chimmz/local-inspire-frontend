import { FC } from 'react';
import cls from 'classnames';
import styles from './CategoriesNav.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toLowerSnakeCase } from '../../utils/string-utils';

console.log({ styles });

interface CategoriesNavProps {
  popularCategories: string[];
}

const CategoriesNav: FC<CategoriesNavProps> = function (props) {
  const { popularCategories } = props;
  const { query } = useRouter();
  const [_, currentCity, currentStateCode] = (query.businessSearchParams as string).split(
    ',',
  );
  console.log({ currentCity });

  return (
    <nav className={cls(styles.categoriesNav, 'no-bullets')}>
      <ul className={styles.categories}>
        {popularCategories.map(categ => {
          const href = `/search/${toLowerSnakeCase(categ)},${toLowerSnakeCase(
            currentCity,
          )},${currentStateCode}`;

          return (
            <li>
              <Link href={href}>{categ}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CategoriesNav;
