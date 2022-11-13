import { FC } from 'react';
import * as stringUtils from '../../utils/string-utils';

import cls from 'classnames';
import Business, { BusinessProps } from './Business';
import otherStyles from './AllBusinesses.module.scss';
import styles from './BusinessesGroup.module.scss';

interface Props {
  groupName: string;
  businesses: BusinessProps[];
}

const BusinessesGroup: FC<Props> = props => {
  return (
    <>
      <h3 className="text-sec mb-3">{stringUtils.toTitleCase(props.groupName)}</h3>
      <div
        className={cls(styles.businessGroup, otherStyles.businesses)}
        id="all-businesses"
      >
        {props.businesses.map(b => (
          <Business {...b} />
        ))}
      </div>
    </>
  );
};

export default BusinessesGroup;
