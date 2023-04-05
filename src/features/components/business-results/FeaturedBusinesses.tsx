import { FC, useMemo } from 'react';
import * as stringUtils from '../../utils/string-utils';

import { v4 as uuid } from 'uuid';
import cls from 'classnames';
import Business, { BusinessProps } from './Business';
import otherStyles from './AllBusinesses.module.scss';
import styles from './FeaturedBusinesses.module.scss';

interface Props {
  title: string;
  businesses: Partial<BusinessProps>[];
  className?: string;
}

const FeaturedBusinesses: FC<Props> = props => {
  const id = useMemo(() => uuid(), []);

  if (!props.businesses?.length) return <></>;
  return (
    <section className={cls(styles.businessGroup, 'no-bullets', props.className)}>
      <h3 className={cls(styles.groupName, 'mb-4')}>{stringUtils.toTitleCase(props.title)}</h3>
      <div className={cls(styles.featuredBusinesses, otherStyles.businesses)}>
        {props.businesses.map(b => (
          <Business featured {...b} key={id} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
