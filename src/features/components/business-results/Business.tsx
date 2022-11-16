import { FC } from 'react';

import Image from 'next/image';
import dummyImgs from './dummy-imgs';
import { Icon } from '@iconify/react';
import styles from './Business.module.scss';
import cls from 'classnames';

export interface BusinessProps {
  businessName: string;
  address: string;
  rating: number;
  featured: boolean;
  [key: string]: any;
}

const Business: FC<BusinessProps> = function (props) {
  const rand = Math.floor(Math.random() * 9);
  const { businessName, address, rating, featured } = props;

  return (
    <li className={cls(styles.business, featured ? styles.featured : '')} key={rand}>
      <figure>
        {/* <div style={{ width: '50%' }}> */}
        <Image
          src={dummyImgs[rand % 10] || dummyImgs[rand % 8]}
          alt=""
          layout="fill"
          objectFit="cover"
          // width={200}
          // height={200}
        />
        {/* </div> */}
      </figure>
      <figcaption className="details">
        <h6 className={styles.businessName}>{businessName}</h6>
        <address className="address">{address || 'No address available'}</address>
        <div className={styles.rating}>
          <Icon icon="ant-design:star-filled" color="orange" />
          <Icon icon="ant-design:star-filled" color="orange" />
          <Icon icon="ant-design:star-filled" color="orange" />
          <Icon icon="ant-design:star-filled" color="#bababa" />
          <Icon icon="ant-design:star-filled" color="#bababa" />
          <small>(23)</small>
        </div>
      </figcaption>
      {!featured ? (
        <div className={styles.question}>
          <p>{`Been here before? Would you recommend ${businessName}`}</p>
          <button className="btn btn-outline btn--sm">Yes</button>
          <button className="btn btn-outline btn--sm">No</button>
        </div>
      ) : null}
    </li>
  );
};

export default Business;
