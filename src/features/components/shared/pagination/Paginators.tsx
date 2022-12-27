import ReactPaginate from 'react-paginate';
import { Icon } from '@iconify/react';
import styles from './Paginators.module.scss';

interface Props {
  pageCount: number;
  onPageChange(selectedItem: { selected: number }): any;
  currentPage: number;
}

const Paginators = function (props: Props) {
  const { pageCount, onPageChange: pageChangeHandler, currentPage } = props;

  const showPreviousLabel = currentPage > 1;
  const showNextLabel = currentPage < pageCount;

  return (
    <ReactPaginate
      breakLabel="..."
      onPageChange={pageChangeHandler}
      // pageRangeDisplayed={10}
      pageCount={pageCount}
      previousLabel={
        <Icon
          icon="material-symbols:chevron-left-rounded"
          width={22}
          color="gray"
          style={{ opacity: showPreviousLabel ? 1 : '0.2' }}
        />
      }
      nextLabel={
        <Icon
          icon="material-symbols:chevron-right-rounded"
          color="gray"
          width={22}
          style={{ opacity: showNextLabel ? 1 : '0.2' }}
        />
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
