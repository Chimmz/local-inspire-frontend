import React, { useState, useEffect, useMemo } from 'react';
// Types
import { City } from '../../../../types';

// Hooks
import useSignedInUser from '../../../../hooks/useSignedInUser';
import useConfirmation from '../../../../hooks/useConfirmationMiddleware';
import useInput from '../../../../hooks/useInput';
import useDelayActionUponTextInput from '../../../../hooks/useDelayActionUponTextInput';
import useAPISearch from '../../../../hooks/useAPISearch';
import useRequest from '../../../../hooks/useRequest';

// Utils
import DataTable from 'react-data-table-component';
import api from '../../../../library/api';
import cls from 'classnames';
import { citiesColumns, genCitiesTableData } from './config';

// Components
import Spinner from '../../../shared/spinner/Spinner';
import DeleteConfirmModal from '../../../shared/DeleteConfirmModal';
import EditCityModal from './EditCityModal';
import TextInput from '../../../shared/text-input/TextInput';

interface Props {
  cities: City[] | undefined;
  totalCities: number | undefined;
  stateNames: string[] | undefined;
  getStyle: (className: string) => string;
}

const ROWS_PER_PAGE = 10;
const TOTAL_PAGES_TO_PRELOAD = 6;

const CitiesMain = (props: Props) => {
  const { getStyle } = props;

  const [cities, setCities] = useState(props.cities);
  const [citiesTotal, setCitiesTotal] = useState(props.totalCities);
  const [cityToEdit, setCityToEdit] = useState<City | undefined>();

  const { send: sendCitiesReq, loading: citiesLoading } = useRequest();
  const { send: sendDeleteReq, loading: deleting } = useRequest();
  const {
    withConfirmation,
    confirmationShown: deleteConfirmationShown,
    confirm: confirmDelete,
    closeConfirmation: closeDeleteConfirmation,
  } = useConfirmation();

  const {
    inputValue: searchText,
    onChange: handleChangeSearchText,
    clearInput: clearSearchText,
  } = useInput({ init: '' });

  const {
    search: searchCities,
    loading: isSearching,
    searchResults,
    resetResults: resetSearchResults,
  } = useAPISearch<City>({
    makeRequest: api.searchCities.bind(api, searchText, true),
    //  searchText.length
    //   ? api.searchCities.bind(api, searchText, true)
    //   : async () => {},
    responseDataField: 'cities',
  });

  const searchCitiesDelayed = useDelayActionUponTextInput({ action: searchCities });

  const loadCities = async (args?: { page: number; limit: number }, refresh = false) => {
    try {
      const req = refresh ? sendCitiesReq(api.getCities(args)) : api.getCities(args);
      const res = await req;
      if (res.status !== 'SUCCESS') return;
      if (!refresh) return setCities(prevCities => prevCities!.concat(res.cities));
      setCities(res.cities);
      setCitiesTotal(res.total);
    } catch (err) {
      console.log(err);
    }
  };

  const refreshCities = () => {
    loadCities(
      { page: 1, limit: cities?.length || TOTAL_PAGES_TO_PRELOAD * ROWS_PER_PAGE },
      true,
    );
  };

  const deleteCity = () => {};

  const handlePageChange = (pageNumber: number) => {
    // If search results are being displayed, return. Dont preload for search.
    if (searchText && searchResults.length) return;

    const totalPagesLoaded = cities!.length / ROWS_PER_PAGE;
    const is3rdPageBeforeLastPage = pageNumber === totalPagesLoaded - 2;
    const isLastLoadedPage = pageNumber === cities!.length / ROWS_PER_PAGE; // If user navig to last page

    // Preload these pages now: pageNumber+3, pageNumber+4, ..., TOTAL_PAGES_TO_PRELOAD
    if (is3rdPageBeforeLastPage)
      return loadCities({ page: pageNumber + 3, limit: TOTAL_PAGES_TO_PRELOAD * ROWS_PER_PAGE });

    // Preload the next page (and few other consecutive pages) after the last loaded page
    if (isLastLoadedPage)
      return loadCities({ page: pageNumber + 1, limit: TOTAL_PAGES_TO_PRELOAD * ROWS_PER_PAGE });
  };

  const tableData = useMemo(() => {
    const rowConfig = {
      onEdit: setCityToEdit,
      onDelete: (id: string) => withConfirmation(deleteCity.bind(null, id)),
    };

    // If there's no results for current search term
    if (searchText && !searchResults.length) return [];

    // If there are search results for current search term
    if (searchText && searchResults.length) {
      setCitiesTotal(searchResults.length);
      return genCitiesTableData(searchResults, rowConfig);
    }

    setCitiesTotal(props.totalCities);
    return genCitiesTableData(cities, rowConfig);
  }, [cities, searchResults]);

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
                <div
                  className={cls(
                    getStyle('card-title mb-0'),
                    'd-flex justify-content-between align-items-center',
                  )}
                >
                  <h4> All Cities</h4>
                  <div className="d-flex align-items-center gap-3">
                    <TextInput
                      value={searchText}
                      onChange={handleChangeSearchText}
                      // style={{ maxWidth: '200px' }}
                      label={<small className="d-block fs-5">Search:</small>}
                      className="d-flex align-items-center gap-2 textfield-sm"
                      onKeyUp={searchCitiesDelayed}
                    />
                  </div>
                </div>
              </div>

              <div className={getStyle('card-body py-3 mt-5')}>
                <DataTable
                  columns={citiesColumns}
                  data={tableData}
                  dense
                  fixedHeader
                  pagination
                  onChangePage={handlePageChange}
                  paginationTotalRows={citiesTotal}
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
        city={cityToEdit}
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
