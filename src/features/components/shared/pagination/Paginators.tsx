import ReactPaginate from 'react-paginate';
import { Icon } from '@iconify/react';
import styles from './Paginators.module.scss';

interface Props {
  pageCount: number;
  onPageChange(selectedItem: { selected: number }): any;
}

const Paginators = function ({ pageCount, onPageChange: pageChangeHandler }: Props) {
  return (
    <ReactPaginate
      breakLabel="..."
      onPageChange={pageChangeHandler}
      // pageRangeDisplayed={10}
      pageCount={pageCount}
      previousLabel={
        <Icon icon="material-symbols:chevron-left-rounded" width={22} color="gray" />
      }
      nextLabel={
        <Icon icon="material-symbols:chevron-right-rounded" color="gray" width={22} />
      }
      renderOnZeroPageCount={() => {}}
      className={styles.paginators}
      pageLinkClassName={styles.pageLink}
      activeLinkClassName={styles.activePagelink}
      nextLinkClassName={styles.pageLink}
      previousLinkClassName={styles.pageLink}
    />
  );
};

export default Paginators;
