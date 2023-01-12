import { FC } from 'react';
import * as stringUtils from '../../utils/string-utils';

import { v4 as uuid } from 'uuid';
import cls from 'classnames';
import Business, { BusinessProps } from './Business';
import otherStyles from './AllBusinesses.module.scss';
import styles from './FeaturedBusinesses.module.scss';

interface Props {
  groupName: string;
  businesses: Partial<BusinessProps & { rating: number }>[];
  className?: string;
}

const FeaturedBusinesses: FC<Props> = props => {
  if (!props.businesses?.length) return <></>;
  return (
    <section className={cls(styles.businessGroup, 'no-bullets', props.className)}>
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
    </section>
  );
};

export default FeaturedBusinesses;
