import React, { useEffect, useMemo, useState } from 'react';
import { AdminFilter, AdminSearchKeyword } from '../../../../types';

import useInput from '../../../../hooks/useInput';
import useToggle from '../../../../hooks/useToggle';
import useRequest from '../../../../hooks/useRequest';
import useReactSelect from '../../../../hooks/useReactMultiselect';
import useSignedInUser from '../../../../hooks/useSignedInUser';

import { isRequired } from '../../../../utils/validators/inputValidators';
import makeAnimated from 'react-select/animated';
import api from '../../../../library/api';
import { formTypes, getSelectOptions, ReactSelectOption } from './config';
import cls from 'classnames';

import ReactSelect from 'react-select';
import { Form, Modal } from 'react-bootstrap';
import LabelledCheckbox from '../../../shared/LabelledCheckbox';
import TextInput from '../../../shared/text-input/TextInput';
import LoadingButton from '../../../shared/button/Button';

interface Props {
  show: boolean;
  onSavedFilter: Function;
  close: () => void;
  filterToEdit?: AdminFilter | null; // For edit
}

const FilterModal = function (props: Props) {
  const [keywords, setKeywords] = useState<AdminSearchKeyword[] | undefined>();
  const [sic2Categories, setSic2Categories] = useState<string[]>();
  const [sic4Categories, setSic4Categories] = useState<string[]>();
  const [sic8Categories, setSic8Categories] = useState<string[]>();

  const {
    selectedItems: selectedSic2Categories,
    onSelect: handleChangeSic2,
    setSelectedItems: setSelectedSIC2Value,
  } = useReactSelect();
  const {
    selectedItems: sic4CategoriesValue,
    onSelect: handleChangeSic4,
    setSelectedItems: setSelectedSIC4Value,
  } = useReactSelect();
  const {
    selectedItems: sic8CategoriesValue,
    onSelect: handleChangeSic8,
    setSelectedItems: setSelectedSIC8Value,
  } = useReactSelect();
  const {
    selectedItems: keywordsValue,
    onSelect: handleChangeKeyword,
    setSelectedItems: setKeywordsValue,
  } = useReactSelect();
  const {
    selectedItems: formTypeValue,
    onSelect: handleChangeFormType,
    setSelectedItems: setFormTypeValue,
  } = useReactSelect();

  const { accessToken } = useSignedInUser();
  const { send: sendGetSIC4, loading: loadingSIC4Categories } = useRequest();
  const { send: sendGetSIC8, loading: loadingSIC8Categories } = useRequest();
  const { send: sendSaveFilterReq, loading: savingFilter } = useRequest();

  const {
    inputValue: filterName,
    handleChange: handleChangeName,
    setInputValue: setName,
    validationErrors: nameValidationErrors,
    runValidators: runNameValidators,
    clearInput: clearName,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['Please enter a name for this filter'] }],
  });

  const { state: isActive, toggle: toggleIsActive } = useToggle(true);

  const {
    inputValue: filterTitle,
    handleChange: handleChangeFilterTitle,
    setInputValue: setTitle,
    validationErrors: filterTitleValidationErrors,
    runValidators: runFilterTitleValidators,
    clearInput: clearFilterTitle,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['Please write a title for this filter'] }],
  });

  const {
    inputValue: description,
    handleChange: handleChangeDescription,
    setInputValue: setDescription,
    validationErrors: descriptionValidationErrors,
    runValidators: runDescriptionValidators,
    clearInput: clearDescription,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['Please enter a description for this filter'] }],
  });

  const {
    state: showDescriptionForFilter,
    toggle: toggleShowDescriptionForFilter,
    setState: setShowDescriptionForFilter,
  } = useToggle(true);
  const {
    state: showDescriptionForBusiness,
    toggle: toggleShowDescriptionForBusiness,
    setState: setShowDescriptionForBusiness,
  } = useToggle(false);
  const {
    state: showForBusiness,
    toggle: toggleShowForBusiness,
    setState: setShowForBusiness,
  } = useToggle(false);
  const {
    state: showForFilter,
    toggle: toggleShowForFilter,
    setState: setShowForFilter,
  } = useToggle(true);

  const {
    inputValue: tagsValue,
    handleChange: handleChangeTags,
    setInputValue: setTagsValue,
    validationErrors: tagsValidationErrors,
    runValidators: runTagsValidators,
    clearInput: clearTagsValue,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['No tag is specified for this filter'] }],
  });

  const {
    inputValue: keyOrder,
    handleChange: handleChangeKeyOrder,
    setInputValue: setKeyOrder,
    validationErrors: keyOrderValidationErrors,
    runValidators: runKeyOrderValidators,
    clearInput: clearKeyOrder,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['A key order is required'] }],
  });

  // In edit mode, fill all fields with the filter-to-edit's values as default values
  useEffect(() => {
    if (!props.filterToEdit) return; // If not in edit mode
    setName(props.filterToEdit.name);
    setTitle(props.filterToEdit.title);
    setDescription(props.filterToEdit.description.text);
    setShowDescriptionForBusiness(props.filterToEdit.description.showInAddEditBusinessPage);
    setShowDescriptionForFilter(props.filterToEdit.description.showInSearchResultsPage);
    setSelectedSIC2Value(getSelectOptions(props.filterToEdit.SIC2Categories));
    setSelectedSIC4Value(getSelectOptions(props.filterToEdit.SIC4Categories));
    setSelectedSIC8Value(getSelectOptions(props.filterToEdit.SIC8Categories));
    setKeywordsValue(getSelectOptions(props.filterToEdit.keywords));
    setFormTypeValue(getSelectOptions([props.filterToEdit.formType]));
    setShowForBusiness(props.filterToEdit.showForBusiness);
    setShowForFilter(props.filterToEdit.showForFilter);
    setTagsValue(props.filterToEdit.tags.join(', '));
    setKeyOrder(props.filterToEdit.keyOrder.toString());
  }, [props.filterToEdit]);

  // API request to save (add or edit) filter
  const saveFilter = async (body: object) => {
    try {
      const req = props.filterToEdit
        ? api.editFilter(props.filterToEdit._id, body, accessToken!)
        : api.addFilter(body, accessToken!);

      const res = await sendSaveFilterReq(req);
      if (res.status !== 'SUCCESS') throw Error(res.msg || res.error);

      props.onSavedFilter();
      clearName();
      clearDescription();
      clearFilterTitle();
      props.close();
    } catch (err) {
      console.log(err);
    }
  };

  // Form submit handler
  const handleSubmit: React.FormEventHandler = ev => {
    ev.preventDefault();
    // Run all configured validators
    const validations = [
      runNameValidators(),
      runDescriptionValidators(),
      runFilterTitleValidators(),
      runTagsValidators(),
      runKeyOrderValidators(),
    ];
    if (validations.some(result => result.errorExists)) return;

    // Structure the req body
    const body = {
      name: filterName,
      title: filterTitle,
      description: {
        text: description,
        showInSearchResultsPage: showDescriptionForFilter,
        showInAddEditBusinessPage: showDescriptionForBusiness,
      },
      isActive,
      showForBusiness,
      showForFilter,
      keywords: (keywordsValue as ReactSelectOption[]).map(item => item.value),
      SIC2Categories: (selectedSic2Categories as ReactSelectOption[]).map(optn => optn.value),
      SIC4Categories: (sic4CategoriesValue as ReactSelectOption[]).map(optn => optn.value),
      SIC8Categories: (sic8CategoriesValue as ReactSelectOption[]).map(optn => optn.value),
      keyOrder: +keyOrder,
      // prettier-ignore
      tags: tagsValue.split(',').map(t => t.trim()).filter(t => !!t),
      formType: (formTypeValue as ReactSelectOption).value,
    };
    console.log('Body: ', body);
    saveFilter(body);
  };

  // COMPONENT STARTS: Load all keyword and SIC2 options
  useEffect(() => {
    const reqs = Promise.all([api.getKeywords(), api.getBusinessCategories('SIC2', '')]);
    const setters = [setKeywords, setSic2Categories, setSic4Categories, setSic8Categories];
    reqs.then(responses => {
      responses.forEach((res, i) => {
        if (res.status !== 'SUCCESS') return;
        if (i === 0) setters[i](res.keywords);
        else setters[i](res.categories);
      });
    });
  }, []);

  // When SIC2 is changed, load SIC4 options
  useEffect(() => {
    const sic2Arr = selectedSic2Categories as ReactSelectOption[];
    if (!sic2Arr.length) return;
    const req = sendGetSIC4(api.getBusinessCategories('SIC4', `sic2=${sic2Arr[0].value}`));
    req.then(res => {
      res.status === 'SUCCESS' && setSic4Categories(res.categories);
    });
  }, [selectedSic2Categories]);

  // When SIC2 is changed, load SIC4 options
  useEffect(() => {
    const sic4Arr = sic4CategoriesValue as ReactSelectOption[];
    if (!sic4Arr.length) return;
    const req = sendGetSIC8(api.getBusinessCategories('SIC8', `sic4=${sic4Arr[0].value}`));
    req.then(res => res.status === 'SUCCESS' && setSic8Categories(res.categories));
  }, [sic4CategoriesValue]);

  const sic2Options = useMemo(() => getSelectOptions(sic2Categories), [sic2Categories]);
  const sic4Options = useMemo(() => getSelectOptions(sic4Categories), [sic4Categories]);
  const sic8Options = useMemo(() => getSelectOptions(sic8Categories), [sic8Categories]);
  const formTypeOptions = useMemo(() => getSelectOptions(formTypes), []);
  const keywordOptions = useMemo(() => getSelectOptions(keywords?.map(k => k.name)), [keywords]);

  return (
    <Modal
      show={props.show}
      onHide={props.close}
      backdrop="static"
      centered
      size="lg"
      scrollable
    >
      <Modal.Header closeButton className="ms-4">
        <h2> {props.filterToEdit ? filterName : 'New Filter'}</h2>
      </Modal.Header>
      <Modal.Body className="p-5">
        <div className="mb-5">
          <TextInput
            label="Name"
            value={filterName}
            onChange={handleChangeName}
            validationErrors={nameValidationErrors}
            autoFocus={!props.filterToEdit}
          />
        </div>

        {/* Active checkbox */}
        <LabelledCheckbox
          label="Active"
          checked={isActive}
          onChange={toggleIsActive}
          className="w-max-content mb-5"
        />

        {/* Title input */}
        <div className="mb-5">
          <TextInput
            label="Title"
            value={filterTitle}
            onChange={handleChangeFilterTitle}
            validationErrors={filterTitleValidationErrors}
          />
        </div>

        {/* Description input */}
        <div className="mb-1">
          <TextInput
            label="Description"
            value={description}
            onChange={handleChangeDescription}
            validationErrors={descriptionValidationErrors}
          />
        </div>
        <div
          className={`${!!description.length ? 'd-flex' : 'd-none'} align-items-center gap-5`}
        >
          {/* Show description for business checkbox */}
          <LabelledCheckbox
            label="Show this for business"
            checked={showDescriptionForBusiness}
            onChange={toggleShowDescriptionForBusiness}
            className="w-max-content"
          />
          {/* Show description for filter checkbox */}
          <LabelledCheckbox
            label="Show this for filter"
            checked={showDescriptionForFilter}
            onChange={toggleShowDescriptionForFilter}
            className="w-max-content"
          />
        </div>

        {/* Search keywords */}
        <div className="my-5">
          <label className="mb-2">Search keywords</label>
          <ReactSelect
            value={keywordsValue}
            options={keywordOptions || []}
            onChange={handleChangeKeyword}
            components={useMemo(() => makeAnimated(), [])}
            closeMenuOnSelect
            isMulti
            className="mb-1"
          />
        </div>

        {/* SIC2 Categories */}
        <div className="mb-5">
          <label className="mb-2">SIC2 Categories</label>
          <ReactSelect
            value={selectedSic2Categories}
            options={sic2Options}
            onChange={handleChangeSic2}
            isMulti
            closeMenuOnSelect={false}
            components={useMemo(() => makeAnimated(), [])}
          />
        </div>

        {/* SIC4 Categories */}
        <div className="mb-5">
          <label className="mb-2">
            <span>SIC4 Categories</span>
          </label>
          <ReactSelect
            value={sic4CategoriesValue}
            options={sic4Options}
            onChange={handleChangeSic4}
            isMulti
            isLoading={loadingSIC4Categories}
            closeMenuOnSelect={false}
            components={useMemo(() => makeAnimated(), [])}
          />
        </div>

        {/* SIC8 Categories */}
        <div className="mb-5">
          <div className="d-flex align-items-center mb-1">
            <label className="flex-grow-1">SIC8 Categories</label>
            <button
              className="btn btn--sm btn-bg-none w-max-content text-pry"
              style={{
                display: (sic8CategoriesValue as []).length === sic8Options.length ? 'none' : '',
              }}
              onClick={setSelectedSIC8Value.bind(null, sic8Options)}
            >
              Select all
            </button>
          </div>

          <ReactSelect
            value={sic8CategoriesValue}
            options={sic8Options}
            onChange={handleChangeSic8}
            isMulti
            className="flex-grow-1"
            closeMenuOnSelect={false}
            components={useMemo(() => makeAnimated(), [])}
            isLoading={loadingSIC8Categories}
          />
        </div>

        {/* Key order */}
        <div className="mb-5">
          <TextInput
            label="Key Order"
            type="number"
            min={1}
            value={keyOrder}
            onChange={handleChangeKeyOrder}
            validationErrors={keyOrderValidationErrors}
          />
        </div>

        {/* Tags */}
        <div className="mb-5">
          <TextInput
            as="textarea"
            label="Filters"
            value={tagsValue}
            onChange={handleChangeTags}
            validationErrors={tagsValidationErrors}
          />
        </div>

        {/* Form type */}
        <div className="mb-5">
          <label className="mb-2">Form Type</label>
          <ReactSelect
            value={formTypeValue}
            options={formTypeOptions}
            onChange={handleChangeFormType}
            components={useMemo(() => makeAnimated(), [])}
          />
        </div>

        <div className="d-flex align-items-center flex-wrap gap-5 mb-5">
          {/* Show filter for business checkbox */}
          <LabelledCheckbox
            label="Show filter for business"
            checked={showForBusiness}
            onChange={toggleShowForBusiness}
            className="w-max-content"
          />
          {/* Show filter for filter checkbox */}
          <LabelledCheckbox
            label="Show filter in search results"
            checked={showForFilter}
            onChange={toggleShowForFilter}
            className="w-max-content"
          />
        </div>

        <LoadingButton
          isLoading={savingFilter}
          textWhileLoading="Saving..."
          className="btn btn-pry btn--lg"
          onClick={handleSubmit}
        >
          Save filter
        </LoadingButton>
      </Modal.Body>
    </Modal>
  );
};

export default FilterModal;
