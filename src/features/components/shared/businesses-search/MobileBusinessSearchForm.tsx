import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import useRequest from '../../../hooks/useRequest';
import * as urlUtils from '../../../utils/url-utils';
import BusinessSearchForm from './BusinessSearchForm';

interface Props {
  close: () => void;
}

function MobileBusinessSearchForm(props: Props) {
  const {
    loading: searchingBusinesses,
    startLoading,
    stopLoading,
  } = useRequest({ autoStopLoading: false });
  const router = useRouter();

  const onSearchHandler = (categoryValue: string, locationValue: string) => {
    if (!categoryValue || !locationValue) return;

    let [cityValue, stateValue] = locationValue.split(',');
    [cityValue, stateValue] = [cityValue.trim(), stateValue.trim()];

    console.log({ cityValue: cityValue.trim(), stateValue: stateValue.trim() });

    startLoading();
    const url = urlUtils.getBusinessSearchResultsUrl({
      category: categoryValue,
      city: cityValue,
      stateCode: stateValue,
    });
    console.log('To push: ', url);
    router.push(url);
  };

  useEffect(() => {
    stopLoading();
  }, [router.asPath]);

  useEffect(() => {
    if (searchingBusinesses) setTimeout(props.close, 800);
  }, [searchingBusinesses]);

  return (
    <Modal
      size="lg"
      show
      onHide={props.close}
      aria-labelledby="example-modal-sizes-title-sm"
    >
      <Modal.Header closeButton style={{ backgroundColor: '' }}>
        <Modal.Title className="example-modal-sizes-title-sm">Search</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BusinessSearchForm
          fontSize="13px"
          promptUserInput={false}
          onSearch={onSearchHandler}
          loading={searchingBusinesses}
          defaultCategorySuggestions={[
            'Hotels and motels',
            'Restaurants',
            'Cabins Rentals',
            'Vacation Rentals',
            'Things to do',
            'Cruises',
          ]}
        />
      </Modal.Body>
    </Modal>
  );
}

export default MobileBusinessSearchForm;
