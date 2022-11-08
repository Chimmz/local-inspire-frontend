import cls from 'classnames';
import Image from 'next/image';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import dummyImgs from './dummy-imgs';
import Spinner from '../shared/spinner/Spinner';

interface Props {
  data: { [key: string]: any };
  allResults: number;
  styles: { readonly [key: string]: string };
}
interface Business {
  businessName: string;
  address: string;
}

const AllBusinesses = (props: Props) => {
  const { styles } = props;
  const error = props.data?.status !== 'SUCCESS';

  // if (props.showLoader) {
  //   return (
  //     <Spinner />
  //     // <div className={styles.businesses}>
  //     //   <Spinner />
  //     // </div>
  //   );
  // }

  if (!props.data)
    return (
      <div className={cls(styles.businesses, styles.noResults)}>
        <Spinner />
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
    <div className={styles.businesses}>
      <small className={styles.totalResults}>{props.allResults} results</small>
      {props.data.businesses?.map((b: Business, i: number) => (
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
