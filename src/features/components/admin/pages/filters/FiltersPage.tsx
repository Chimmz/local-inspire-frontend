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
import { tableColumns } from './config';
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
  // const [showEditFilterModal, setShowEditFilterModal] = useState(false);
  const [filterToEdit, setFilterToEdit] = useState<AdminFilter | null>(null);

  const {
    withConfirmation,
    confirmationShown: deleteConfirmationShown,
    confirm: proceedToDelete,
    closeConfirmation: closeDeleteConfirmation,
  } = useConfirmation();

  const adminUser = useSignedInUser();
  const { send: sendFiltersRequest, loading: filtersLoading } = useRequest();
  const { send: sendDeleteReq, loading: deletingFilter } = useRequest();

  const loadFilters = () => {
    const req = sendFiltersRequest(api.getFilters(adminUser.accessToken!));
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
    return filters?.map(f => ({
      ...f,
      id: f._id,
      title: f.title || '-',
      showForBusiness: f.showForBusiness ? 'Yes' : 'No',
      showForFilter: f.showForFilter ? 'Yes' : 'No',
      isActive: f.isActive ? 'Yes' : 'No',
      SIC2Categories: f.SIC2Categories?.join(', ') || '-',
      SIC4Categories: f.SIC4Categories?.join(', ') || '-',
      SIC8Categories: f.SIC8Categories?.join(', ') || '-',
      searchKeyword: f?.searchKeyword || '-',
      actions: (
        <div className="d-flex align-items-center gap-2 ">
          <Icon
            onClick={setFilterToEdit.bind(null, f)}
            icon="material-symbols:edit-outline-rounded"
            width={18}
            className="cursor-pointer"
            color="#555"
          />
          <Icon
            onClick={withConfirmation.bind(null, deleteFilter.bind(null, f._id))}
            icon="material-symbols:delete-outline"
            className="cursor-pointer"
            width={18}
            color="#555"
          />
        </div>
      ),
    }));
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
        onAddFilter={loadFilters}
      />
      {/* For edit filter modal */}
      <FilterModal
        show={!!filterToEdit}
        close={setFilterToEdit.bind(null, null)}
        onAddFilter={loadFilters}
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
                {/* Card actions */}
                {/* <div className={getStyle('card-actions float-end')}>
                  <a href="#" className={getStyle('me-1')}>
                    <i className={getStyle('align-middle')} data-feather="refresh-cw"></i>
                  </a>
                  <div className={getStyle('d-inline-block dropdown show')}>
                    <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                      <i className={getStyle('align-middle')} data-feather="more-vertical"></i>
                    </a>

                    <div className={getStyle('dropdown-menu dropdown-menu-end')}>
                      <a className={getStyle('dropdown-item')} href="#">
                        Action
                      </a>
                      <a className={getStyle('dropdown-item')} href="#">
                        Another action
                      </a>
                      <a className={getStyle('dropdown-item')} href="#">
                        Something else here
                      </a>
                    </div>
                  </div>
                </div> */}

                <div
                  className={cls(
                    getStyle('card-title mb-0'),
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
              <div className={getStyle('card-body py-3')}>
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
