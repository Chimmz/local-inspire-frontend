import cls from 'classnames';
import Spinner from '../shared/spinner/Spinner';
import Business, { BusinessProps } from './Business';
import styles from './AllBusinesses.module.scss';

interface Props {
  data: { sponsored?: BusinessProps; [key: string]: any };
  allResults?: number;
  type?: string;
}

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
    <ul className={cls(styles.businesses, 'no-bullets')} id="all-businesses">
      <small className={styles.totalResults}>{props.allResults} results</small>
      {(props.data.businesses as BusinessProps[])?.map(b => (
        <Business {...b} key={b.businessName} featured={false} />
      ))}
    </ul>
  );
}

export default AllBusinesses;
