import { FC } from 'react';

import Image from 'next/image';
import dummyImgs from './dummy-imgs';
import { Icon } from '@iconify/react';
import styles from './Business.module.scss';

export interface BusinessProps {
  businessName: string;
  address: string;
  rating: number;
}

const Business: FC<BusinessProps> = function (props) {
  const rand = Math.floor(Math.random() * 9);
  const { businessName, address, rating } = props;

  return (
    <div className={styles.business} key={rand}>
      <figure>
        <Image
          src={dummyImgs[rand % 10] || dummyImgs[rand % 8]}
          alt=""
          layout="fill"
          objectFit="cover"
        />
      </figure>
      <figcaption className="details">
        <h6 className={styles.businessName}>{businessName}</h6>
        <address className="address">{address}</address>
        <div className={styles.rating}>
          <Icon icon="ant-design:star-filled" color="orange" />
          <Icon icon="ant-design:star-filled" color="orange" />
          <Icon icon="ant-design:star-filled" color="orange" />
          <Icon icon="ant-design:star-filled" color="#bababa" />
          <Icon icon="ant-design:star-filled" color="#bababa" />
        </div>
      </figcaption>
    </div>
  );
};

export default Business;
