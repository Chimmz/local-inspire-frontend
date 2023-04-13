import React, { useState, useEffect, useMemo } from 'react';
// Types
import { AdminFilter } from '../../../../types';
// Hooks
import useRequest from '../../../../hooks/useRequest';
import useSignedInUser from '../../../../hooks/useSignedInUser';
// Utils
import api from '../../../../library/api';
// Components
import DataTable from 'react-data-table-component';
import FilterModal from './FilterModal';
import Spinner from '../../../shared/spinner/Spinner';
import { genFilterTableData, tableColumns } from './config';
import { Icon } from '@iconify/react';
import cls from 'classnames';
import useConfirmation from '../../../../hooks/useConfirmationMiddleware';
import DeleteConfirmModal from '../../../shared/DeleteConfirmModal';

interface Props {
  pageTitle: string;
  getStyle: (className: string) => string;
}

const FiltersPage = (props: Props) => {
  const { getStyle } = props;

  const [filters, setFilters] = useState<AdminFilter[]>();
  const [showNewFilterModal, setShowAddFilterModal] = useState(false);
  const [filterToEdit, setFilterToEdit] = useState<AdminFilter | null>(null);
  const adminUser = useSignedInUser();

  const {
    withConfirmation,
    confirmationShown: deleteConfirmationShown,
    confirm: proceedToDelete,
    closeConfirmation: closeDeleteConfirmation,
  } = useConfirmation();

  const { send: sendFiltersRequest, loading: filtersLoading } = useRequest();
  const { send: sendDeleteReq, loading: deletingFilter } = useRequest();

  const loadFilters = () => {
    const req = sendFiltersRequest(api.getFilters());
    req.then(res => res.status === 'SUCCESS' && setFilters(res.filters));
  };

  const deleteFilter = async (filterId: string) => {
    const req = sendDeleteReq(api.deleteFilter(filterId, adminUser.accessToken!));
    req.then(res => {
      if (res.status !== 'SUCCESS') return;
      closeDeleteConfirmation();
      loadFilters();
    });
    req.catch(err => {});
  };

  useEffect(() => {
    if (adminUser?.accessToken) loadFilters();
  }, [adminUser.accessToken]);

  const tableData = useMemo(() => {
    const rowOptions = {
      onEdit: setFilterToEdit,
      onDelete: (f: AdminFilter) => withConfirmation(deleteFilter.bind(null, f._id)),
    };
    return genFilterTableData(filters, rowOptions);
  }, [filters]);

  return (
    <>
      <Spinner show={filtersLoading} pageWide />
      <DeleteConfirmModal
        show={deleteConfirmationShown}
        onChooseDelete={proceedToDelete}
        loading={deletingFilter}
        close={closeDeleteConfirmation}
        msg="Are you sure you want to delete this filter?"
      />
      {/* For add new filter modal */}
      <FilterModal
        show={showNewFilterModal}
        close={setShowAddFilterModal.bind(null, false)}
        onSavedFilter={loadFilters}
      />
      {/* For edit filter modal */}
      <FilterModal
        show={!!filterToEdit}
        close={setFilterToEdit.bind(null, null)}
        onSavedFilter={loadFilters}
        filterToEdit={filterToEdit}
      />

      <div className={getStyle('header')}>
        <h1 className={getStyle('header-title fs-1')}>{props.pageTitle}</h1>
        <p className={getStyle('header-subtitle fs-4')}>
          {/* You have {quantitize(props.messages?.length || 0, ['new message', 'new messages'])} */}
        </p>
      </div>
      <div className={getStyle('container-fluid')}>
        <div className={getStyle('row')}>
          <div className={getStyle('col-12')}>
            <div className={getStyle('card flex-fill w-100 px-2 py-4')}>
              <div className={getStyle('card-header')}>
                <div
                  className={cls(
                    getStyle('card-title'),
                    'd-flex justify-content-between align-items-center',
                  )}
                >
                  <h4> Search filters</h4>
                  <button
                    className="btn btn-pry btn-rounded"
                    onClick={setShowAddFilterModal.bind(null, true)}
                  >
                    <Icon icon="ic:baseline-plus" height={20} /> New filter
                  </button>
                </div>
              </div>
              <div className={getStyle('card-body mt-5 py-3')}>
                <DataTable
                  columns={tableColumns}
                  data={tableData || []}
                  dense
                  fixedHeader
                  pagination
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FiltersPage;
