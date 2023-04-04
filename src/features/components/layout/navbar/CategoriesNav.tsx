import { FC, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { useUserLocationContext } from '../../../contexts/UserLocationContext';

import * as urlUtils from '../../../utils/url-utils';
import cls from 'classnames';

import styles from './CategoriesNav.module.scss';
import useRequest from '../../../hooks/useRequest';
import api from '../../../library/api';
import { AdminSearchKeyword } from '../../../types';

interface CategoriesNavProps {
  searchParams: { category: string; city: string; stateCode: string };
  showLoader?: () => void;
}

const CategoriesNav: FC<CategoriesNavProps> = function (props) {
  const [keywords, setKeywords] = useState<AdminSearchKeyword[] | undefined>();
  const { userLocation } = useUserLocationContext();
  const { send: sendKeywordReq, loading: loadingKeywords } = useRequest();

  useEffect(() => {
    const req = api.getKeywords();
    sendKeywordReq(req).then(res => res.status === 'SUCCESS' && setKeywords(res.keywords));
  }, []);

  const popularCategories = useMemo(
    () => [
      'Hotels and motels',
      'Restaurants',
      'Cabins Rentals',
      'Vacation Rentals',
      'Things to do',
      'Cruises',
    ],
    [],
  );

  const navLinksUI = useMemo(() => {
    return keywords?.map(kw => {
      const href = urlUtils.getBusinessSearchResultsUrl({
        category: kw.name,
        city: userLocation?.cityName || '',
        stateCode: userLocation?.stateCode || '',
      });
      return (
        <li key={kw.name}>
          <Link href={href} passHref>
            <a onClick={props.showLoader} className="w-max-content d-block">
              {kw.name}
            </a>
          </Link>
        </li>
      );
    });
  }, [keywords]);

  return (
    <nav className={cls(styles.categoriesNav)}>
      <div className="container">
        <ul className={cls(styles.categories, 'no-bullets')}>
          {navLinksUI}

          {/* {popularCategories.map(categ => {
            const href = urlUtils.getBusinessSearchResultsUrl({
              category: categ,
              city: userLocation?.cityName || '',
              stateCode: userLocation?.stateCode || '',
            });
            return (
              <li key={categ}>
                <Link href={href} passHref>
                  <a onClick={props.showLoader} className="w-max-content d-block">
                    {categ}
                  </a>
                </Link>
              </li>
            );
          })} */}
        </ul>
      </div>
    </nav>
  );
};

export default CategoriesNav;
