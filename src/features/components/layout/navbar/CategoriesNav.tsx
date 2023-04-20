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
  showLoader?: () => void;
  claimButton?: boolean;
}

const CategoriesNav: FC<CategoriesNavProps> = function (props) {
  const [keywords, setKeywords] = useState<AdminSearchKeyword[] | undefined>();

  const { userLocation } = useUserLocationContext();
  const { send: sendKeywordReq, loading: loadingKeywords } = useRequest();

  useEffect(() => {
    const req = api.getKeywords();
    sendKeywordReq(req).then(res => res.status === 'SUCCESS' && setKeywords(res.keywords));
  }, []);

  const navLinksUI = useMemo(() => {
    if (!keywords?.length) return <></>;
    return keywords
      .filter(k => k.showOnNavbar)
      .map(kwd => {
        const href = urlUtils.getBusinessSearchResultsUrl({
          category: kwd.name,
          city: userLocation?.cityName || '',
          stateCode: userLocation?.stateCode || '',
        });
        return (
          <li key={kwd.name}>
            <Link href={href} passHref>
              <a onClick={props.showLoader} className="w-max-content d-block">
                {kwd.name}
              </a>
            </Link>
          </li>
        );
      });
  }, [keywords, userLocation]);

  return (
    <nav className={cls(styles.categoriesNav)}>
      <div className="container d-flex justify-content-between">
        <ul className={cls(styles.categories, 'no-bullets')}>{navLinksUI}</ul>
        <button className={cls("btn btn-sec", !props.claimButton && 'd-none')}>Claim</button>
      </div>
    </nav>
  );
};

export default CategoriesNav;
