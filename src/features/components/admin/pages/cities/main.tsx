import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import cls from 'classnames';
import DataTable from 'react-data-table-component';
import api from '../../../../library/api';
import useRequest from '../../../../hooks/useRequest';

interface Props {
  getStyle: (className: string) => string;
}

const CitiesMain = (props: Props) => {
  const [cities, setCities] = useState([]);
  const { send: sendCitiesReq, loading: citiesLoading } = useRequest();
  const { getStyle } = props;

  const loadCities = () => {
    const req = api.getAllCities();
    sendCitiesReq(req).then(res => res.status === 'SUCCESS' && setCities(res.cities));
  };

  useEffect(() => {
    // loadCities();
  }, []);

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
                <DataTable columns={[]} data={[]} dense fixedHeader pagination />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CitiesMain;
