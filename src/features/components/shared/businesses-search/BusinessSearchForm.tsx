import React, { useState, useCallback, useContext, useEffect, useRef, useMemo } from 'react';

import API from '../../../library/api';
import * as uuid from 'uuid';

import { useRouter } from 'next/router';
import useInput from '../../../hooks/useInput';
import useRequest from '../../../hooks/useRequest';
import useAPISearchResults from '../../../hooks/useAPISearchResults';
import useDelayActionUponTextInput from '../../../hooks/useDelayActionUponTextInput';

import cls from 'classnames';
import { Button, Spinner as BootstrapSpinner } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import SearchResults from '../search-results/SearchResults';
import styles from './BusinessSearchForm.module.scss';
import { UserLocationContext } from '../../../contexts/UserLocationContext';
import { AdminSearchKeyword } from '../../../types';
import api from '../../../library/api';
import Link from 'next/link';
import { getBusinessSearchResultsUrl } from '../../../utils/url-utils';

const MIN_CHARS_FOR_CATEGORY_SEARCH = 2;
const MIN_CHARS_FOR_CITY_SEARCH = 2;

interface BusinessSearchFormProps {
  promptUserInput: boolean;
  fontSize?: string;
  onSearch: (categ: string, city: string, ...others: any[]) => void;
  loading: boolean;
  defaultCategorySuggestions: string[];
}

function BusinessSearchForm(props: BusinessSearchFormProps) {
  const { fontSize } = props;
  const [keywords, setKeywords] = useState<AdminSearchKeyword[] | undefined>();
  const categoryInput = useRef<HTMLInputElement | null>(null);
  const cityInput = useRef<HTMLInputElement | null>(null);
  const [hasSelectedCategory, setHasSelectedCategory] = useState(false);
  const [hasSelectedCity, setHasSelectedCity] = useState(false);
  const { userLocation } = useContext(UserLocationContext);

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
    loading: isSearchingCategories,
    resultsShown: categoryResultsShown,
    showResults: showCategoryResults,
    hideResults: hideCategoryResults,
    resetResults: resetCategoryResults,
  } = useAPISearchResults({
    makeRequest: API.searchBusinessCategories.bind(API, categoryValue.trim()),
    responseDataField: 'categories',
  });

  const {
    search: searchCities,
    searchResults: cityResults,
    loading: isSearchingCities,
    resultsShown: cityResultsShown,
    showResults: showCityResults,
    hideResults: hideCityResults,
    resetResults: resetCityResults,
  } = useAPISearchResults({
    makeRequest: API.searchCities.bind(API, cityValue.trim()),
    responseDataField: 'cities',
  });

  const searchCategoriesDelayed = useDelayActionUponTextInput({
    action: searchCategories,
    delay: 100,
  });
  const searchCitiesDelayed = useDelayActionUponTextInput({ action: searchCities, delay: 250 });
  const { stopLoading: stopFindBusinessLoader } = useRequest({ autoStopLoading: false });

  const loadKeywords = useCallback(() => {
    api.getKeywords().then(res => res.status === 'SUCCESS' && setKeywords(res.keywords));
  }, []);

  useEffect(() => {
    loadKeywords();

    if (props.promptUserInput) categoryInput.current?.focus();
    hideCategoryResults();
    const clickHandler = (ev: MouseEvent) => {
      if ((ev.target as Element)?.closest('form')?.className.includes('search')) return;
      hideCategoryResults();
      hideCityResults();
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, []);

  useEffect(() => {
    setCityValue(userLocation?.city || '');
    hideCityResults();
  }, [userLocation?.city, setCityValue]);

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
        setHasSelectedCategory(true);
        hideCityResults();
        break;
      case 'city':
        setCityValue(value);
        hideCategoryResults();
        hideCityResults();
        setHasSelectedCity(true);
        break;
    }
  };

  const handleCategInputFocus: React.FocusEventHandler<HTMLInputElement> = function (ev) {
    ev.target.select();
    hideCityResults();
    showCategoryResults();
    if (!categoryValue) return resetCategoryResults();
    if (categoryResults.length) return;
    if (isSearchingCategories) return;
    if (categoryValue.length < MIN_CHARS_FOR_CATEGORY_SEARCH) return;
    searchCategories();
  };

  const handleCityInputFocus: React.FocusEventHandler<HTMLInputElement> = function (ev) {
    ev.target.select();
    hideCategoryResults();
    showCityResults();
    if (!cityValue) return resetCityResults();
    if (cityResults.length) return;
    if (isSearchingCities) return;
    if (cityValue.length < MIN_CHARS_FOR_CITY_SEARCH) return;
    if (ev.target.value === userLocation?.city) return; // Dont search when user selects current location
    searchCities();
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();
    const selectedKeyword = keywords?.find(kw => kw.name === categoryValue);
    props.onSearch(categoryValue.trim(), cityValue.trim(), selectedKeyword?.name);
  };

  const getCategoriesToRender = useCallback(() => {
    const resultsToShow = categoryResults.length ? categoryResults : keywords?.map(k => k.name);
    return resultsToShow?.map(text => ({ label: text, value: text })) || [];
  }, [categoryResults, keywords]);

  const locationSuggestions: Array<{ label: React.ReactNode; value: string }> = cityResults.map(
    city => ({ label: city, value: city }),
  );

  if (userLocation?.city?.length) {
    locationSuggestions.unshift({
      label: (
        <div className="d-flex align-items-center gap-2 text-pry">
          <Icon
            icon="material-symbols:location-on-outline"
            color="#0955a1"
            width="22"
            height="20"
          />
          Current Location
        </div>
      ),
      value: userLocation?.city,
    });
  }

  // const btnSearch = useMemo(() => {
  //   const content = props.loading ? (
  //     <BootstrapSpinner
  //       animation="border"
  //       size="sm"
  //       style={{ width: '1.2em', height: '1.2em', borderWidth: '2px' }}
  //       color="#e87525"
  //     />
  //   ) : (
  //     <Icon icon="akar-icons:search" color="#fff" />
  //   );

  //   if (!categoryValue || !cityValue || !userLocation?.stateCode || !keywords)
  //     return (
  //       <Button
  //         className={cls(styles.btn, 'btn btn-pry')}
  //         type="submit"
  //         disabled={props.loading}
  //       >
  //         {content}
  //       </Button>
  //     );
  //   const url = getBusinessSearchResultsUrl({
  //     category: categoryValue,
  //     city: cityValue.split(', ')[0],
  //     stateCode: cityValue.split(', ')[1],
  //     queryStr: `?keyword=${keywords.find(kw => kw.name === categoryValue)?.name}`,
  //   });
  //   return (
  //     <Link href={url} passHref>
  //       <a className={cls(styles.btn, 'btn btn-pry')}>{content}</a>
  //     </Link>
  //   );
  // }, [categoryValue, cityValue, userLocation, keywords]);

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
          onFocus={handleCategInputFocus}
          style={{ width: '20px', maxWidth: '20px' }}
          onKeyUp={ev => {
            const thisInput = categoryInput.current!;
            if (!thisInput.value.length) resetCategoryResults();

            setHasSelectedCategory(false);
            if (hasSelectedCategory) return hideCategoryResults();
            if (thisInput.value.length < MIN_CHARS_FOR_CATEGORY_SEARCH) return;
            searchCategoriesDelayed(ev);
          }}
        />
        <label htmlFor="category">Find:</label>

        <SearchResults
          show={categoryResultsShown}
          resultItems={getCategoriesToRender()}
          searchTerm={categoryValue}
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
          onFocus={handleCityInputFocus}
          onKeyUp={ev => {
            const thisInput = cityInput.current!;
            if (!thisInput.value.length) resetCityResults();
            setHasSelectedCity(false);
            if (hasSelectedCity) return hideCityResults();

            if (thisInput.value.length < MIN_CHARS_FOR_CITY_SEARCH) return;
            if (thisInput.value === userLocation?.city) return;
            searchCitiesDelayed(ev);
          }}
        />
        <label htmlFor="city">Near:</label>

        <SearchResults
          show={cityResultsShown}
          resultItems={locationSuggestions}
          searchTerm={cityValue}
          renderItem={city => (
            <li key={uuid.v4()}>
              <a href="#" data-field="city" data-value={city.value} onClick={handleSelectResult}>
                {city.label}
              </a>
            </li>
          )}
        />
      </div>

      {/* {btnSearch} */}

      <Button className={cls(styles.btn, 'btn btn-pry')} type="submit" disabled={props.loading}>
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
