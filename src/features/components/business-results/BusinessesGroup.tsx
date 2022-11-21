import { FC } from 'react';
import * as stringUtils from '../../utils/string-utils';

import { v4 as uuid } from 'uuid';
import cls from 'classnames';
import Business, { BusinessProps } from './Business';
import otherStyles from './AllBusinesses.module.scss';
import styles from './BusinessesGroup.module.scss';

interface Props {
  groupName: string;
  businesses: BusinessProps[];
}

const BusinessesGroup: FC<Props> = props => {
  if (!props.businesses?.length) return <></>;
  return (
    <ul className={cls(styles.businessGroup, 'no-bullets')}>
      <h3 className={cls(styles.groupName, 'mb-4')}>
        {stringUtils.toTitleCase(props.groupName)}
      </h3>
      <div
        className={cls(styles.featuredBusinesses, otherStyles.businesses)}
        id="all-businesses"
      >
        {props.businesses.map(b => (
          <Business {...b} key={uuid()} featured />
        ))}
      </div>
    </ul>
  );
};

export default BusinessesGroup;
