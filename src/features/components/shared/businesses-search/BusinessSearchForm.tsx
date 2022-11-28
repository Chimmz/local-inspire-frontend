import React, { useEffect, useRef, useState } from 'react';

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
  const [categorySelected, setCategorySelected] = useState(false);
  const [citySelected, setCitySelected] = useState(false);

  const currentLocation = useCurrentLocation();
  // console.log(currentLocation);
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
  } = useInput({ init: currentLocation.state });

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
    setCityValue(currentLocation.state);
    hideCityResults();
  }, [currentLocation.state, setCityValue]);

  useEffect(() => {
    if (!categoryValue.length) resetCategoryResults();
    setCategorySelected(false);
    if (categorySelected) return hideCategoryResults();

    categoryValue.length >= MIN_CHARS_FOR_CATEGORY_SEARCH && searchCategories();
  }, [categoryValue]);

  useEffect(() => {
    if (!cityValue.length) resetCityResults();
    setCitySelected(false);
    if (citySelected) return hideCityResults();

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
        // setTimeout(hideCategoryResults, 20);
        hideCityResults();
        setCategorySelected(true);
        break;

      case 'city':
        setCityValue(value);
        // setTimeout(hideCityResults, 20);
        hideCategoryResults();
        setCitySelected(true);
        break;
    }
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

  const locationSuggestions: Array<{ label: React.ReactNode; value: string }> =
    cityResults.map(city => ({ label: city, value: city }));

  if (currentLocation.state.length) {
    locationSuggestions.unshift({
      label: (
        <>
          <Icon
            icon="material-symbols:location-on"
            color="#0955a1"
            width="22"
            height="20"
          />{' '}
          {currentLocation.state}
        </>
      ),
      value: currentLocation.state,
    });
  }

  // console.log({ locationSuggestions });

  // console.log({ categoriesToShow: getCategoriesToShow() }); // Check this re-evaluation later

  return (
    <form className={styles.search} onSubmit={handleSubmit} style={{}}>
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
          onFocus={function (ev) {
            ev.target.select();
            hideCityResults();
            showCategoryResults();
            if (!categoryValue) return resetCategoryResults();
            if (categoryResults.length) return;
            if (categoryValue.length >= MIN_CHARS_FOR_CATEGORY_SEARCH) searchCategories();
          }}
          style={{ width: '20px', maxWidth: '20px' }}
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
          onFocus={function (ev) {
            ev.target.select();
            hideCategoryResults();
            showCityResults();
            if (!cityValue) return resetCityResults();
            if (cityResults.length) return;
            if (cityValue.length >= MIN_CHARS_FOR_CITY_SEARCH) searchCities();
          }}
        />
        <label htmlFor="city">Near:</label>

        <SearchResults
          show={cityResultsShown}
          resultItems={locationSuggestions}
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
            color="#e87525"
          />
        ) : (
          <Icon icon="akar-icons:search" color="#fff" />
        )}
      </Button>
    </form>
  );
}

export default BusinessSearchForm;
