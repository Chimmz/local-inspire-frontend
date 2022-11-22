import cls from 'classnames';
import Spinner from '../shared/spinner/Spinner';
import Business, { BusinessProps } from './Business';
import styles from './AllBusinesses.module.scss';
import { v4 as uuid } from 'uuid';

interface Props {
  data: { [key: string]: any };
  page: number;
  allResults?: number;
  type?: string;
}

function AllBusinesses(props: Props) {
  const { data, allResults, page } = props;
  const error = data?.status !== 'SUCCESS';

  if (!data)
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

  if (!data.businesses.length)
    return (
      <div className={cls(styles.businesses, styles.noResults)}>
        No results. Try searching for something else
      </div>
    );

  const getBusinessSerialNumber = (i: number) => (page - 1) * 20 + i + 1;

  return (
    <ul className={cls(styles.businesses, 'no-bullets')} id="all-businesses">
      <small className={styles.totalResults}>{allResults} results</small>
      {(data.businesses as BusinessProps[])?.map((b, i) => (
        <Business
          {...b}
          key={uuid()}
          featured={false}
          index={getBusinessSerialNumber(i)}
        />
      ))}
    </ul>
  );
}

export default AllBusinesses;
