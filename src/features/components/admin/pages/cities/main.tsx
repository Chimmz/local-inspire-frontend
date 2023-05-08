import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import cls from 'classnames';
import DataTable from 'react-data-table-component';
import api from '../../../../library/api';
import useRequest from '../../../../hooks/useRequest';
import { citiesColumns, genCitiesTableData } from './config';
import { City } from '../../../../types';
import useSignedInUser from '../../../../hooks/useSignedInUser';
import useConfirmation from '../../../../hooks/useConfirmationMiddleware';
import Spinner from '../../../shared/spinner/Spinner';
import DeleteConfirmModal from '../../../shared/DeleteConfirmModal';
import EditCityModal from './EditCityModal';

interface Props {
  cities: City[] | undefined;
  totalCities: number | undefined;
  stateNames: string[] | undefined;
  getStyle: (className: string) => string;
}

const ROWS_PER_PAGE = 10;
const TOTAL_PAGES_TO_PRELOAD = 6;

const CitiesMain = (props: Props) => {
  const [cities, setCities] = useState(props.cities);
  const [cityToEdit, setCityToEdit] = useState<[c: City, index: number] | undefined>();
  const currentUser = useSignedInUser();
  const { getStyle } = props;

  const {
    withConfirmation,
    confirmationShown: deleteConfirmationShown,
    confirm: confirmDelete,
    closeConfirmation: closeDeleteConfirmation,
  } = useConfirmation();

  const { send: sendCitiesReq, loading: citiesLoading } = useRequest();
  const { send: sendDeleteReq, loading: deleting } = useRequest();

  const loadCities = (args?: { page: number; limit: number }, refresh = false) => {
    const req = sendCitiesReq(api.getCities(args));
    req.then(res => {
      if (res.status !== 'SUCCESS') return;
      if (!refresh) return setCities(prevCities => prevCities!.concat(res.cities));
      setCities(res.cities);
    });
  };

  const deleteCity = async (cityId: string) => {};

  const tableData = useMemo(() => {
    const rowConfig = {
      onEdit: (c: City, index: number) => setCityToEdit([c, index]),
      onDelete: (id: string) => withConfirmation(deleteCity.bind(null, id)),
    };
    return genCitiesTableData(cities, rowConfig);
  }, [cities]);

  const refreshCities = () => {
    loadCities(
      { page: 1, limit: cities?.length || TOTAL_PAGES_TO_PRELOAD * ROWS_PER_PAGE },
      true,
    );
  };

  const handlePageChange = (pageNumber: number) => {
    const totalPagesLoaded = cities!.length / ROWS_PER_PAGE;
    const is3rdPageBeforeLastPage = pageNumber === totalPagesLoaded - 2; // SecondPageBeforeLastPage
    if (!is3rdPageBeforeLastPage) return;

    // Preload these pages now: pageNumber+3, pageNumber+4, ..., TOTAL_PAGES_TO_PRELOAD
    loadCities({ page: pageNumber + 3, limit: TOTAL_PAGES_TO_PRELOAD * ROWS_PER_PAGE });
  };

  return (
    <main className={getStyle('content')}>
      <div className={getStyle('header')}>
        <h1 className={getStyle('header-title fs-1')}>Cities</h1>
        <p className={getStyle('header-subtitle fs-4')}>
          {/* You have {quantitize(props.messages?.length || 0, ['new message', 'new messages'])} */}
        </p>
      </div>
      <div className={getStyle('container-fluid')}>
        <div className={getStyle('row')}>
          <div className={getStyle('col-12')}>
            <div className={getStyle('card flex-fill w-100 px-2 py-4')}>
              <div className={getStyle('card-header')}>
                <div className={cls(getStyle('card-title mb-0'), 'd-flex align-items-center')}>
                  <h4> All Cities</h4>
                </div>
              </div>

              <div className={getStyle('card-body py-3')}>
                <DataTable
                  columns={citiesColumns}
                  data={tableData}
                  dense
                  fixedHeader
                  pagination
                  onChangePage={handlePageChange}
                  paginationTotalRows={props.totalCities}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Spinner show={citiesLoading || deleting} pageWide />

      <EditCityModal
        show={!!cityToEdit}
        stateNames={props.stateNames}
        close={setCityToEdit.bind(null, undefined)}
        city={cityToEdit?.[0]}
        cityIndex={cityToEdit?.[1]}
        onUpdate={refreshCities}
      />

      <DeleteConfirmModal
        show={deleteConfirmationShown}
        onChooseDelete={confirmDelete}
        loading={deleting}
        close={closeDeleteConfirmation}
      />
    </main>
  );
};

export default CitiesMain;
