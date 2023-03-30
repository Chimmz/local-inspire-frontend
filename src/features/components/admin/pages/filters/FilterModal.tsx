import React, { useEffect, useMemo, useState } from 'react';

import useInput from '../../../../hooks/useInput';
import useToggle from '../../../../hooks/useToggle';
import useRequest from '../../../../hooks/useRequest';
import useReactSelect from '../../../../hooks/useReactMultiselect';
import useSignedInUser from '../../../../hooks/useSignedInUser';

import { isRequired } from '../../../../utils/validators/inputValidators';
import makeAnimated from 'react-select/animated';
import api from '../../../../library/api';
import { formTypes, getSelectOptions, ReactSelectOption } from './config';

import { Form, Modal, Spinner } from 'react-bootstrap';
import LabelledCheckbox from '../../../shared/LabelledCheckbox';
import TextInput from '../../../shared/text-input/TextInput';
import LoadingButton from '../../../shared/button/Button';
import ReactSelect from 'react-select';
import { AdminFilter, AdminSearchKeyword } from '../../../../types';

interface Props {
  show: boolean;
  onAddFilter: Function;
  close: () => void;
  filterToEdit?: AdminFilter | null; // For edit
}

const FilterModal = function (props: Props) {
  const [searchKeywords, setSearchKeywords] = useState<AdminSearchKeyword[] | undefined>();
  const [sic2Categories, setSic2Categories] = useState<string[]>();
  const [sic4Categories, setSic4Categories] = useState<string[]>();
  const [sic8Categories, setSic8Categories] = useState<string[]>();

  const { chosenItems: industry, onSelect: handleChangeCategory } = useReactSelect();
  const { chosenItems: chosenSic2Categories, onSelect: handleChangeSic2 } = useReactSelect();
  const { chosenItems: chosenSic4Categories, onSelect: handleChangeSic4 } = useReactSelect();
  const { chosenItems: chosenSic8Categories, onSelect: handleChangeSic8 } = useReactSelect();
  const { chosenItems: keyword, onSelect: handleChangeKeyword } = useReactSelect();
  const { chosenItems: formType, onSelect: handleChangeFormType } = useReactSelect();

  const { accessToken } = useSignedInUser();
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

  const {
    inputValue: subcategory,
    handleChange: handleChangeSubcategory,
    setInputValue: setCategory,
    validationErrors: subcategoryValidationErrors,
    runValidators: runSubcategoryValidators,
    clearInput: clearSubcategory,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['Please select a subcategory'] }],
  });

  useEffect(() => {
    if (!props.filterToEdit) return;
    setName(props.filterToEdit.name);
    setTitle(props.filterToEdit.title);
    setDescription(props.filterToEdit.description);
    setShowForBusiness(props.filterToEdit.showForBusiness);
    setShowForFilter(props.filterToEdit.showForFilter);
    setKeyOrder(props.filterToEdit.keyOrder + '');
  }, [props.filterToEdit]);

  const handleSave = async () => {
    const validationResults = [
      runNameValidators(),
      runDescriptionValidators(),
      runFilterTitleValidators(),
    ];
    if (validationResults.some(result => result.errorExists)) return;
    const body = {
      name: filterName,
      title: filterTitle,
      description,
      isActive,
      showForBusiness,
      showForFilter,
      searchKeyword: (keyword as ReactSelectOption).value,
      category: (industry as ReactSelectOption).value,
      SIC2Categories: (chosenSic2Categories as ReactSelectOption[]).map(optn => optn.value),
      SIC4Categories: (chosenSic4Categories as ReactSelectOption[]).map(optn => optn.value),
      SIC8Categories: (chosenSic8Categories as ReactSelectOption[]).map(optn => optn.value),
      keyOrder: +keyOrder,
      formType: (formType as ReactSelectOption).value,
    };
    try {
      const req = props.filterToEdit
        ? api.editFilter(props.filterToEdit._id, body, accessToken!)
        : api.addFilter(body, accessToken!);

      const res = await sendSaveFilterReq(req);
      if (res.status !== 'SUCCESS') throw Error(res.msg || res.error);

      props.onAddFilter();
      clearName();
      clearDescription();
      clearFilterTitle();
      props.close();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const reqs = Promise.all([api.getKeywords(), api.getBusinessCategories('SIC2', '')]);
    const setters = [setSearchKeywords, setSic2Categories, setSic4Categories, setSic8Categories];

    reqs.then(responses => {
      responses.forEach((res, i) => {
        if (res.status !== 'SUCCESS') return;
        if (i === 0) setters[i](res.keywords);
        else setters[i](res.categories);
      });
    });
  }, []);

  useEffect(() => {
    const sic2Arr = chosenSic2Categories as ReactSelectOption[];
    if (!sic2Arr.length) return;

    const req = api.getBusinessCategories('SIC4', `sic2=${sic2Arr[0].value}`);
    req.then(res => {
      res.status === 'SUCCESS' && setSic4Categories(res.categories);
    });
  }, [chosenSic2Categories]);

  useEffect(() => {
    const sic4Arr = chosenSic4Categories as ReactSelectOption[];
    if (!sic4Arr.length) return;

    const req = sendGetSIC8(api.getBusinessCategories('SIC8', `sic4=${sic4Arr[0].value}`));
    req.then(res => res.status === 'SUCCESS' && setSic8Categories(res.categories));
  }, [chosenSic4Categories]);

  const keywordOptions = useMemo(() => {
    if (!searchKeywords) return;
    return getSelectOptions(searchKeywords.map(k => k.name));
  }, [searchKeywords]);

  const sic2Options = useMemo(() => getSelectOptions(sic2Categories), [sic2Categories]);
  const sic4Options = useMemo(() => getSelectOptions(sic4Categories), [sic4Categories]);
  const sic8Options = useMemo(() => getSelectOptions(sic8Categories), [sic8Categories]);
  const formTypeOptions = useMemo(() => getSelectOptions(formTypes), []);

  return (
    <Modal
      show={props.show}
      onHide={props.close}
      backdrop="static"
      centered
      size="lg"
      scrollable
    >
      <Modal.Header closeButton>
        <h2> New Filter</h2>
      </Modal.Header>
      <Modal.Body className="p-5">
        <div className="mb-5">
          <TextInput
            label="Name"
            value={filterName}
            onChange={handleChangeName}
            validationErrors={nameValidationErrors}
            autoFocus={!!!props.filterToEdit}
          />
        </div>

        {/* Active checkbox */}
        <LabelledCheckbox
          label="Active"
          checked={isActive}
          onChange={toggleIsActive}
          className="gap-3 w-max-content mb-5"
        />

        <div className="mb-5">
          <TextInput
            label="Title"
            value={filterTitle}
            onChange={handleChangeFilterTitle}
            validationErrors={filterTitleValidationErrors}
            autoFocus
          />
        </div>

        {/* Description input */}
        <div className="mb-5">
          <TextInput
            label="Description"
            value={description}
            onChange={handleChangeDescription}
            validationErrors={descriptionValidationErrors}
          />
        </div>

        {/* Show for business checkbox */}
        <LabelledCheckbox
          label="Show for business"
          checked={showForBusiness}
          onChange={toggleShowForBusiness}
          className="gap-3 w-max-content mb-5"
        />

        {/* Show for filter checkbox */}
        <LabelledCheckbox
          label="Show for filter"
          checked={showForFilter}
          onChange={toggleShowForFilter}
          className="gap-3 w-max-content mb-5"
        />

        {/* Search keyword */}
        <div className="mb-5">
          <label className="mb-2">Search keyword</label>
          <ReactSelect
            options={keywordOptions || []}
            onChange={handleChangeKeyword}
            components={useMemo(() => makeAnimated(), [])}
            closeMenuOnSelect
          />
        </div>

        {/* SIC2 Categories */}
        <div className="mb-5">
          <label className="mb-2">SIC2 Categories</label>
          <ReactSelect
            options={sic2Options}
            onChange={handleChangeSic2}
            isMulti
            components={useMemo(() => makeAnimated(), [])}
          />
        </div>

        {/* SIC4 Categories */}
        <div className="mb-5">
          <label className="mb-2">SIC4 Categories</label>
          <ReactSelect
            options={sic4Options}
            onChange={handleChangeSic4}
            isMulti
            components={useMemo(() => makeAnimated(), [])}
          />
        </div>

        {/* SIC8 Categories */}
        <div className="mb-5">
          <label className="mb-2">SIC8 Categories</label>
          <div className="d-flex align-items-center gap-3">
            <ReactSelect
              options={sic8Options}
              onChange={handleChangeSic8}
              isMulti
              className="flex-grow-1"
              // components={useMemo(() => makeAnimated(), [])}
            />
            <Spinner
              size="sm"
              animation="border"
              className={loadingSIC8Categories ? 'd-block' : 'd-none'}
              style={{ borderWidth: '1px' }}
            />
          </div>
        </div>

        {/* Key order */}
        <div className="mb-5">
          <TextInput
            label="Key Order"
            type="number"
            value={keyOrder}
            onChange={handleChangeKeyOrder}
            validationErrors={keyOrderValidationErrors}
          />
        </div>

        {/* Sub-categories */}
        {/* <div className="mb-5">
          <label className="mb-2">SIC4 Categories</label>
          <ReactSelect
            options={sic4Options}
            onChange={handleChangeSic4}
            isMulti
            components={useMemo(() => makeAnimated(), [])}
            
          />
        </div> */}

        {/* Form type */}
        <div className="mb-5">
          <label className="mb-2">Form Type</label>
          <ReactSelect
            options={formTypeOptions}
            onChange={handleChangeFormType}
            components={useMemo(() => makeAnimated(), [])}
          />
        </div>

        <LoadingButton
          isLoading={savingFilter}
          // withSpinner
          textWhileLoading="Saving..."
          className="btn btn-pry btn--lg"
          onClick={handleSave}
        >
          Save filter
        </LoadingButton>
      </Modal.Body>
    </Modal>
  );
};

export default FilterModal;
