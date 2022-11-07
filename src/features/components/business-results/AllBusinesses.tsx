import cls from 'classnames';
import Image from 'next/image';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import dummyImgs from './dummy-imgs';
import Spinner from '../shared/spinner/Spinner';

interface BusinessesResultsProps {
  businesses: { [key: string]: any }[] | undefined;
  styles: { readonly [key: string]: string };
}

const AllBusinesses = (props: BusinessesResultsProps) => {
  const { businesses, styles } = props;

  if (!businesses?.length)
    return (
      <div className={cls(styles.businesses, styles.noResults)}>
        No results. Try searching for something else
      </div>
    );
  return (
    <div className={styles.businesses}>
      <small className={styles.totalResults}>{businesses?.length} results</small>
      {businesses?.map((b, i) => (
        <div className={styles.businessResult} key={i}>
          <figure>
            <Image
              src={dummyImgs[i % 10] || dummyImgs[i % 8]}
              alt=""
              layout="fill"
              objectFit="cover"
            />
          </figure>
          <figcaption className="details">
            <h6 className={styles.businessName}>{b.businessName}</h6>
            <address className="address">{b.address}</address>
            <div className={styles.rating}>
              <Icon icon="ant-design:star-filled" color="orange" />
              <Icon icon="ant-design:star-filled" color="orange" />
              <Icon icon="ant-design:star-filled" color="orange" />
              <Icon icon="ant-design:star-filled" color="#bababa" />
              <Icon icon="ant-design:star-filled" color="#bababa" />
            </div>
          </figcaption>
        </div>
      ))}
    </div>
  );
};

export default AllBusinesses;
