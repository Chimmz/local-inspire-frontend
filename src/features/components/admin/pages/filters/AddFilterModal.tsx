import React, { useEffect, useMemo, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import useInput from '../../../../hooks/useInput';
import useToggle from '../../../../hooks/useToggle';
import { isRequired } from '../../../../utils/validators/inputValidators';
import ReactSelect from 'react-select';
import ReactSelectAsync from 'react-select/async';
import makeAnimated from 'react-select/animated';
import LabelledCheckbox from '../../../shared/LabelledCheckbox';
import TextInput from '../../../shared/text-input/TextInput';
import api from '../../../../library/api';
import { formTypes, getSelectOptions, ReactSelectOption, searchKeywords } from './config';
import LoadingButton from '../../../shared/button/Button';
import useRequest from '../../../../hooks/useRequest';
import useReactSelect from '../../../../hooks/useReactMultiselect';
import useSignedInUser from '../../../../hooks/useSignedInUser';

interface Props {
  show: boolean;
  onAddFilter: Function;
  close: () => void;
}

const AddFilterModal = function (props: Props) {
  const [sic2Categories, setSic2Categories] = useState<string[]>();
  const [sic4Categories, setSic4Categories] = useState<string[]>();
  const [sic8Categories, setSic8Categories] = useState<string[]>();
  const [industries, setIndustries] = useState<string[]>();

  const { accessToken } = useSignedInUser();
  const { send: sendGetCategories, loading: gettingCategories } = useRequest();
  const { send: sendSaveFilterReq, loading: savingFilter } = useRequest();

  const { chosenItems: industry, onSelect: handleChangeCategory } = useReactSelect();
  const { chosenItems: chosenSic2Categories, onSelect: handleChangeSic2 } = useReactSelect();
  const { chosenItems: chosenSic4Categories, onSelect: handleChangeSic4 } = useReactSelect();
  const { chosenItems: chosenSic8Categories, onSelect: handleChangeSic8 } = useReactSelect();
  const { chosenItems: keyword, onSelect: handleChangeKeyword } = useReactSelect();
  const { chosenItems: formType, onSelect: handleChangeFormType } = useReactSelect();

  const {
    inputValue: filterName,
    handleChange: handleChangeName,
    validationErrors: nameValidationErrors,
    runValidators: runNameValidators,
    clearInput: clearName,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['Please enter a name for this filter'] }],
  });

  const { state: isActive, toggle: toggleIsActive } = useToggle(true);

  const {
    inputValue: description,
    handleChange: handleChangeDescription,
    validationErrors: descriptionValidationErrors,
    runValidators: runDescriptionValidators,
    clearInput: clearDescription,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['Please enter a description for this filter'] }],
  });

  const { state: showForBusiness, toggle: toggleShowForBusiness } = useToggle(false);
  const { state: showForFilter, toggle: toggleShowForFilter } = useToggle(true);

  const {
    inputValue: keyOrder,
    handleChange: handleChangeKeyOrder,
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

  // const {
  //   inputValue: formType,
  //   handleChange: handleChangeFormType,
  //   validationErrors: formTypeValidationErrors,
  //   runValidators: runFormTypeValidators,
  //   clearInput: clearFormType,
  // } = useInput({
  //   init: '',
  //   validators: [{ fn: isRequired, params: ['Please select a form type'] }],
  // });

  useEffect(() => {
    const reqs = Promise.all([
      api.getAllBusinessCategories('SIC2'),
      api.getAllBusinessCategories('SIC4'),
      api.getAllBusinessCategories('SIC8'),
      api.getAllBusinessCategories('industry'),
    ]);
    const setters = [setSic2Categories, setSic4Categories, setSic8Categories, setIndustries];

    reqs.then(responses => {
      responses.forEach((res, i) => res.status === 'SUCCESS' && setters[i](res.categories));
    });
  }, []);

  const keywordOptions = useMemo(() => getSelectOptions(searchKeywords), []);
  const sic2Options = useMemo(() => getSelectOptions(sic2Categories), [sic2Categories]);
  const sic4Options = useMemo(() => getSelectOptions(sic4Categories), [sic4Categories]);
  const sic8Options = useMemo(() => getSelectOptions(sic8Categories), [sic8Categories]);
  const industryOptions = useMemo(() => getSelectOptions(industries), [industries]);
  const formTypeOptions = useMemo(() => getSelectOptions(formTypes), []);

  const handleSave = async () => {
    const validationResults = [runNameValidators(), runDescriptionValidators()];
    if (validationResults.some(result => result.errorExists)) return;
    const body = {
      name: filterName,
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
      const res = await sendSaveFilterReq(api.addFilter(body, accessToken!));
      if (res.status !== 'SUCCESS') throw Error(res.msg || res.error);
      props.onAddFilter();
      clearName();
      clearDescription();
      props.close();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal show={props.show} onHide={props.close} centered size="lg" scrollable>
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
            autoFocus
          />
        </div>

        {/* Active checkbox */}
        <LabelledCheckbox
          label="Active"
          checked={isActive}
          onChange={toggleIsActive}
          className="gap-3 w-max-content mb-5"
        />

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

        {/* Category select */}
        <div>
          <label className="mb-2">Category</label>
          <ReactSelect
            options={industryOptions}
            onChange={handleChangeCategory}
            className="mb-5"
            components={useMemo(() => makeAnimated(), [])}
          />
        </div>

        {/* Search keyword */}
        <div className="mb-5">
          <label className="mb-2">Search keyword</label>
          <ReactSelect
            options={keywordOptions}
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
          <ReactSelect
            options={sic8Options}
            onChange={handleChangeSic8}
            isMulti
            // components={useMemo(() => makeAnimated(), [])}
          />
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

export default AddFilterModal;
