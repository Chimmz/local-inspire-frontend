import { FC } from 'react';
import Image from 'next/image';

import dummyImgs from './dummy-imgs';
import { v4 as uuid } from 'uuid';

import { Icon } from '@iconify/react';
import cls from 'classnames';
import styles from './Business.module.scss';

export interface BusinessProps {
  businessName: string;
  address: string;
  rating: number;
  featured?: boolean;
  SIC8Category?: string;
  SIC4Category: string;
  SIC2Category: string;
  [key: string]: any;
}
const RECOMM_QUESTION = 'Been here before? Would you recommend <business_name>';

const Business: FC<BusinessProps> = function (props) {
  const rand = Math.floor(Math.random() * 9);
  const { businessName, address, rating, featured = false } = props;
  const businessCategs = [props.SIC8Category, props.SIC4Category, props.SIC2Category];

  const genRecommendationQuestion = (businessName: string) => {
    return `${RECOMM_QUESTION.replace('<business_name>', businessName)}`;
  };

  return (
    <li className={cls(styles.business, featured ? styles.featured : '')} key={rand}>
      <figure>
        <Image
          src={dummyImgs[rand % 10] || dummyImgs[rand % 8]}
          alt={`${props.SIC8Category || ''} photo of ${businessName}`}
          layout="fill"
          objectFit="cover"
        />
      </figure>
      <figcaption className="details">
        <h6 className={styles.businessName}>{businessName}</h6>
        <address className="address">
          {address.replace('<br/>', '\n') || 'No address available'}
        </address>
        <div className={styles.rating}>
          <Icon icon="ant-design:star-filled" color="orange" />
          <Icon icon="ant-design:star-filled" color="orange" />
          <Icon icon="ant-design:star-filled" color="orange" />
          <Icon icon="ant-design:star-filled" color="#bababa" />
          <Icon icon="ant-design:star-filled" color="#bababa" />
          <small style={{ marginLeft: '5px' }}>(23)</small>
        </div>
        <ul className={cls(styles.categories, 'no-bullets')}>
          {businessCategs.map(categ => (
            <li key={uuid()}>
              <small>{categ}</small>
            </li>
          ))}
        </ul>
      </figcaption>

      {!featured ? (
        <div className={styles.question}>
          <p>{genRecommendationQuestion(businessName)}</p>
          <div className="d-flex align-items-center">
            <button className="btn btn-outline btn--sm">Yes</button>
            <button className="btn btn-outline btn--sm">No</button>
          </div>
        </div>
      ) : null}
    </li>
  );
};

export default Business;
