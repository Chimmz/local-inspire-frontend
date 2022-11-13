import cls from 'classnames';
import Image from 'next/image';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import dummyImgs from './dummy-imgs';
import Spinner from '../shared/spinner/Spinner';
import * as stringUtils from '../../utils/string-utils';
import Business from './Business';
import styles from './AllBusinesses.module.scss';

interface BusinessObj {
  businessName: string;
  address: string;
  rating: number;
}

interface Props {
  data: { sponsored?: BusinessObj; [key: string]: any };
  allResults?: number;
  type?: string;
}

console.log(styles);

function AllBusinesses(props: Props) {
  const error = props.data?.status !== 'SUCCESS';

  if (!props.data)
    return (
      <div className={cls(styles.businesses, styles.noResults)}>
        <Spinner colors={['#0084ff', '#e87525']} />
      </div>
    );

  if (error)
    return (
      <div className={cls(styles.businesses, styles.noResults)}>
        Sorry, something wrong happened
      </div>
    );

  if (!props.data.businesses.length)
    return (
      <div className={cls(styles.businesses, styles.noResults)}>
        No results. Try searching for something else
      </div>
    );

  return (
    <div className={styles.businesses} id="all-businesses">
      <small className={styles.totalResults}>{props.allResults} results</small>
      {(props.data.businesses as BusinessObj[])?.map(b => (
        <Business {...b} />
      ))}
    </div>
  );
}

export default AllBusinesses;
