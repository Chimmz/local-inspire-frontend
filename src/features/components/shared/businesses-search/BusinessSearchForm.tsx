import React, { useEffect, useRef } from 'react';
import useInput from '../../../hooks/useInput';
import useAPISearchResults from '../../../hooks/useAPISearch';

import API from '../../../utils/api-utils';
import * as uuid from 'uuid';
import cls from 'classnames';
import useRequest from '../../../hooks/useRequest';
import { useRouter } from 'next/router';

import SearchResults from '../search-results/SearchResults';
import { Button, Spinner as BootstrapSpinner } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import * as stringUtils from '../../../utils/string-utils';
import styles from './BusinessSearchForm.module.scss';

interface BusinessSearchFormProps {
  fontSize?: string;
  onSearch: (categ: string, city: string) => void;
  loading: boolean;
}
const MIN_CHARS_FOR_CATEGORY_SEARCH = 3;
const MIN_CHARS_FOR_CITY_SEARCH = 2;

function BusinessSearchForm(props: BusinessSearchFormProps) {
  const { fontSize } = props;

  // const { startLoading: showLoader, stopLoading, loading: isSearchingNewBusinesses } = useRequest({ autoStopLoading: false})

  const categoryInput = useRef<HTMLInputElement | null>(null);
  const cityInput = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const {
    inputValue: categoryValue,
    handleChange: handleChangeCategory,
    setInputValue: setCategoryValue,
  } = useInput({ init: '' });
  const {
    inputValue: cityValue,
    handleChange: handleChangeCity,
    setInputValue: setCityValue,
  } = useInput({ init: '' });

  const {
    search: searchCategories,
    searchResults: categoryResults,
    loading: categoryResultsLoading,
    resultsShown: categoryResultsShown,
    showResults: showCategoryResults,
    hideResults: hideCategoryResults,
    resetResults: resetCategoryResults,
  } = useAPISearchResults({
    makeRequest: () => API.searchBusinessCategories(categoryValue),
    responseDataField: 'categories',
  });

  const {
    search: searchCities,
    searchResults: cityResults,
    loading: cityResultsLoading,
    resultsShown: cityResultsShown,
    showResults: showCityResults,
    hideResults: hideCityResults,
    resetResults: resetCityResults,
  } = useAPISearchResults({
    makeRequest: () => API.searchCities(cityValue),
    responseDataField: 'cities',
  });

  const {
    startLoading: startFindBusinessLoader,
    stopLoading: stopFindBusinessLoader,
    loading: findBusinessesLoading,
  } = useRequest({ autoStopLoading: false });

  useEffect(() => {
    categoryValue.length >= MIN_CHARS_FOR_CATEGORY_SEARCH && searchCategories();
    if (!categoryValue.length) resetCategoryResults();
  }, [categoryValue]);

  useEffect(() => {
    cityValue.length >= MIN_CHARS_FOR_CITY_SEARCH && searchCities();
    if (!cityValue.length) resetCityResults();
  }, [cityValue]);

  useEffect(() => stopFindBusinessLoader, []);

  const handleSelectResult: React.MouseEventHandler<HTMLAnchorElement> = ev => {
    ev.preventDefault();
    const { field, value } = (ev.target as Element).closest('a')?.dataset as {
      field: string;
      value: string;
    };

    switch (field) {
      case 'category':
        setCategoryValue(value);
        hideCategoryResults();
        if (!cityValue) cityInput.current!.focus();
        break;

      case 'city':
        setCityValue(value);
        hideCityResults();
        if (!categoryValue) categoryInput.current!.focus();
        break;
    }
    console.table({ field, value });
  };

  useEffect(() => {
    categoryInput.current?.focus();

    const clickHandler = (ev: MouseEvent) => {
      const clickedOn = ev.target as Element;
      // console.log((ev.target as Element)?.closest('form'));
      if (clickedOn?.closest('form')?.className.includes('search')) return;

      hideCategoryResults();
      hideCityResults();
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();
    props.onSearch(categoryValue.trim(), cityValue.trim());
  };

  return (
    <form className={styles.search} onSubmit={handleSubmit}>
      <div className={styles['search-field']} style={{ fontSize }}>
        <input
          type="text"
          onChange={handleChangeCategory}
          value={categoryValue}
          className="textfield"
          placeholder="Ex: hotel, restaurant..."
          ref={categoryInput}
          onFocus={() => {
            hideCityResults();
            if (!categoryValue.length) return;
            categoryResults.length ? showCategoryResults() : searchCategories();
          }}
        />
        <label htmlFor="">Find:</label>
        <SearchResults
          show={categoryResultsShown && !!categoryResults.length}
          resultItems={categoryResults}
          renderItem={categ => (
            <li key={uuid.v4()}>
              <a
                href="#"
                data-field="category"
                data-value={categ}
                onClick={handleSelectResult}
              >
                <span>{categ as unknown as React.ReactNode}</span>
              </a>
            </li>
          )}
        />
      </div>
      <div className={styles['search-field']} style={{ fontSize }}>
        <input
          type="text"
          onChange={handleChangeCity}
          value={cityValue}
          ref={cityInput}
          className="textfield"
          placeholder="Your city"
          onFocus={() => {
            hideCategoryResults();
            if (!cityValue.length) return;
            cityResults.length ? showCityResults() : searchCities();
          }}
        />
        <label htmlFor="">Near:</label>
        <SearchResults
          show={cityResultsShown && !!cityResults.length}
          resultItems={cityResults}
          renderItem={city => (
            <li key={uuid.v4()}>
              <a
                href="#"
                data-field="city"
                data-value={city}
                onClick={handleSelectResult}
              >
                <span>{city as unknown as React.ReactNode}</span>
              </a>
            </li>
          )}
        />
      </div>
      <Button
        className={cls(styles.btn, 'btn btn-pry')}
        type="submit"
        disabled={props.loading}
      >
        {props.loading ? (
          <BootstrapSpinner
            animation="border"
            size="sm"
            style={{ width: '15px', height: '15px' }}
          />
        ) : (
          <Icon icon="akar-icons:search" />
        )}
      </Button>
    </form>
  );
}

export default BusinessSearchForm;
