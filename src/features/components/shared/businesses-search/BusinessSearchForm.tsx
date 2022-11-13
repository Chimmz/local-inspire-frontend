import React, { useEffect, useRef } from 'react';

import API from '../../../library/api';
import * as uuid from 'uuid';
import cls from 'classnames';
import { useRouter } from 'next/router';

import useInput from '../../../hooks/useInput';
import useRequest from '../../../hooks/useRequest';
import useCurrentLocation from '../../../hooks/useCurrentLocation';
import useAPISearchResults from '../../../hooks/useAPISearchResults';
import * as stringUtils from '../../../utils/string-utils';

import SearchResults from '../search-results/SearchResults';
import { Button, Spinner as BootstrapSpinner } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import styles from './BusinessSearchForm.module.scss';

const MIN_CHARS_FOR_CATEGORY_SEARCH = 3;
const MIN_CHARS_FOR_CITY_SEARCH = 2;

interface BusinessSearchFormProps {
  promptUserInput: boolean;
  fontSize?: string;
  onSearch: (categ: string, city: string) => void;
  loading: boolean;
  defaultCategorySuggestions: string[];
}

function BusinessSearchForm(props: BusinessSearchFormProps) {
  const { fontSize, defaultCategorySuggestions } = props;

  const categoryInput = useRef<HTMLInputElement | null>(null);
  const cityInput = useRef<HTMLInputElement | null>(null);
  const currentLocation = useCurrentLocation();
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
    if (!categoryValue.length) resetCategoryResults();
    categoryValue.length >= MIN_CHARS_FOR_CATEGORY_SEARCH && searchCategories();
  }, [categoryValue]);

  useEffect(() => {
    if (!cityValue.length) resetCityResults();
    cityValue.length >= MIN_CHARS_FOR_CITY_SEARCH && searchCities();
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
        setTimeout(hideCategoryResults, 20);
        hideCityResults();
        if (!cityValue) {
          // cityInput.current!.focus();
          // showCityResults();
        }
        break;

      case 'city':
        setCityValue(value);
        setTimeout(hideCityResults, 20);
        hideCategoryResults();
        break;
    }
    console.table({ field, value });
  };

  useEffect(() => {
    if (props.promptUserInput) categoryInput.current?.focus();
    hideCategoryResults();

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

  const getCategoriesToShow = () => {
    const toShow = !categoryResults.length ? defaultCategorySuggestions : categoryResults;
    return toShow.map(text => ({
      label: text,
      value: text,
    }));
  };

  const allLocationSuggestions = [
    {
      label: (
        <>
          <Icon icon="material-symbols:location-on" width="22" height="20" /> Your
          location
        </>
      ),
      value: 'Your location',
    },
    ...cityResults.map(city => ({ label: city, value: city })),
  ];

  // console.log({ allLocationSuggestions });

  // console.log({ categoriesToShow: getCategoriesToShow() }); // Check this re-evaluation later

  return (
    <form className={styles.search} onSubmit={handleSubmit}>
      <div className={styles['search-field']} style={{ fontSize }}>
        <input
          ref={categoryInput}
          type="text"
          onChange={handleChangeCategory}
          value={categoryValue}
          className="textfield"
          id="category"
          placeholder="Ex: hotel, restaurant..."
          autoComplete="off"
          onFocus={() => {
            hideCityResults();
            showCategoryResults();
            if (categoryValue.length >= MIN_CHARS_FOR_CATEGORY_SEARCH) searchCategories();
          }}
        />
        <label htmlFor="category">Find:</label>

        <SearchResults
          show={categoryResultsShown}
          resultItems={getCategoriesToShow()}
          renderItem={categ => (
            <li key={uuid.v4()}>
              <a
                href="#"
                data-field="category"
                data-value={categ.value}
                onClick={handleSelectResult}
              >
                {categ.label}
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
          id="city"
          autoComplete="off"
          onFocus={() => {
            hideCategoryResults();
            showCityResults();
            if (!cityValue.length) return;
            if (categoryValue.length >= MIN_CHARS_FOR_CITY_SEARCH) searchCities();
          }}
        />
        <label htmlFor="city">Near:</label>

        <SearchResults
          show={cityResultsShown}
          resultItems={allLocationSuggestions}
          renderItem={city => (
            <li key={uuid.v4()}>
              <a
                href="#"
                data-field="city"
                data-value={city.value}
                onClick={handleSelectResult}
              >
                {city.label}
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
            style={{ width: '1.2em', height: '1.2em', borderWidth: '2px' }}
          />
        ) : (
          <Icon icon="akar-icons:search" />
        )}
      </Button>
    </form>
  );
}

export default BusinessSearchForm;
