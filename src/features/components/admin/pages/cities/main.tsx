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

interface Props {
  cities: City[] | undefined;
  getStyle: (className: string) => string;
}

const CitiesMain = (props: Props) => {
  const { getStyle } = props;
  const [cities, setCities] = useState(props.cities);
  const currentUser = useSignedInUser();

  const {
    withConfirmation,
    confirmationShown: deleteConfirmationShown,
    confirm: confirmDelete,
    closeConfirmation: closeDeleteConfirmation,
  } = useConfirmation();

  const { send: sendCitiesReq, loading: citiesLoading } = useRequest();
  const { send: sendDeleteReq, loading: deleting } = useRequest();

  const loadCities = () => {
    const req = api.getAllCities();
    sendCitiesReq(req).then(res => res.status === 'SUCCESS' && setCities(res.cities));
  };

  const deleteCity = async (cityId: string) => {
    try {
      console.log('Hi bro');
      // const req = sendDeleteReq(api.deleteKeyword(cityId, currentUser.accessToken!));
      // const res = await req;
      // if (res.status !== 'SUCCESS') return;

      closeDeleteConfirmation();
      // loadCities();
    } catch (err) {
      console.error(err);
    }
  };

  const editCity = (cityId: string) => {};

  const toggleCityFeatured = (cityId: string, optns: { onSuccess: () => void }) => {
    const req = api.toggleCityFeatured(cityId, currentUser.accessToken!);
    req.then(res => res.status === 'SUCCESS' && optns.onSuccess());
  };

  const tableData = useMemo(() => {
    const rowConfig = {
      onEdit: editCity,
      onDelete: (id: string) => withConfirmation(deleteCity.bind(null, id)),
    };
    return genCitiesTableData(props.cities, rowConfig);
  }, [props.cities]);

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
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Spinner show={citiesLoading || deleting} pageWide />

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
