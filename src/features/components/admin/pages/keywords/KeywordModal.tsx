import React, { useEffect, useMemo, useState } from 'react';

import useInput from '../../../../hooks/useInput';
import useToggle from '../../../../hooks/useToggle';
import useRequest from '../../../../hooks/useRequest';
import useReactSelect from '../../../../hooks/useReactMultiselect';
import useSignedInUser from '../../../../hooks/useSignedInUser';

import { isRequired } from '../../../../utils/validators/inputValidators';
import makeAnimated from 'react-select/animated';
import api from '../../../../library/api';
import { getSelectOptions, ReactSelectOption } from './config';

import { Form, Modal } from 'react-bootstrap';
import LabelledCheckbox from '../../../shared/LabelledCheckbox';
import TextInput from '../../../shared/text-input/TextInput';
import LoadingButton from '../../../shared/button/Button';
import ReactSelect from 'react-select';
import { AdminSearchKeyword } from '../../../../types';

interface Props {
  show: boolean;
  onSaved: Function;
  close: () => void;
  onExit?: () => void;
  keyword: AdminSearchKeyword | null;
}

const KeywordModal = function (props: Props) {
  const [sic4Categories, setSic4Categories] = useState<string[]>([]);
  const { accessToken } = useSignedInUser();
  const { send: sendGetCategories, loading: loadingCategories } = useRequest();
  const { send: sendSaveKeywordReq, loading: isSavingKeyword } = useRequest();

  const {
    inputValue: keywordName,
    handleChange: handleChangeName,
    setInputValue: setKeywordName,
    validationErrors: nameValidationErrors,
    runValidators: runNameValidators,
    clearInput: clearName,
  } = useInput({
    init: props.keyword?.name || '',
    validators: [{ fn: isRequired, params: ['Please enter a name for this keyword'] }],
  });

  const {
    state: showOnNavbar,
    toggle: toggleShowOnNavbar,
    setState: setShowOnNavbar,
  } = useToggle(true);
  const {
    state: showForSearch,
    toggle: toggleShowForSearch,
    setState: setShowForSearch,
  } = useToggle(true);

  const {
    state: enableForFilter,
    toggle: toggleEnableForFilter,
    setState: setEnabledForFilter,
  } = useToggle(true);
  const {
    state: enableForBusiness,
    toggle: toggleEnableForBusiness,
    setState: setEnabledForBusiness,
  } = useToggle(false);

  const {
    selectedItems: sic4CategoriesValue,
    onSelect: handleChangeSic4,
    setSelectedItems: setSelectedSIC4Value,
  } = useReactSelect();

  const sic4Options = useMemo(() => getSelectOptions(sic4Categories), [sic4Categories]);

  useEffect(() => {
    if (!props.keyword) return; // If not in edit mode
    setKeywordName(props.keyword.name);
    setSelectedSIC4Value(getSelectOptions(props.keyword.sic4Categories));
    setShowOnNavbar(props.keyword.showOnNavbar);
    setShowForSearch(props.keyword.showForSearch);
    setEnabledForFilter(props.keyword.enableForFilter);
    setEnabledForBusiness(props.keyword.enableForBusiness);
  }, [props.keyword]);

  useEffect(() => {
    const req = sendGetCategories(api.getBusinessCategories('SIC4', ''));
    req.then(res => res.status === 'SUCCESS' && setSic4Categories(res.categories));
  }, []);

  const saveKeyword = async () => {
    const body = {
      name: keywordName,
      enableForBusiness,
      enableForFilter,
      showOnNavbar,
      showForSearch,
      sic4Categories: (sic4CategoriesValue as ReactSelectOption[]).map(optn => optn.value),
    };
    console.log(body);
    const req = !!props.keyword
      ? api.editKeyword(props.keyword._id, body, accessToken!)
      : api.addKeyword(body, accessToken!);

    try {
      const res = await sendSaveKeywordReq(req);
      if (res.status !== 'SUCCESS') throw Error(res.msg || res.error);
      props.onSaved();
      clearName();
      props.close();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    const validationResults = [runNameValidators()];
    if (validationResults.some(result => result.errorExists)) return;
    if (!(sic4CategoriesValue as []).length) return;
    saveKeyword();
  };

  return (
    <Modal
      show={props.show}
      onHide={props.close}
      backdrop="static"
      centered
      size="lg"
      scrollable
      onExit={props.onExit}
    >
      <Modal.Header closeButton>
        <h2> New Search Keyword</h2>
      </Modal.Header>
      <Modal.Body className="p-5">
        {/* Keyword name */}
        <div className="mb-5">
          <TextInput
            label="Name"
            value={keywordName}
            onChange={handleChangeName}
            validationErrors={nameValidationErrors}
            autoFocus={!!!props.keyword} // Autofocus if not in edit mode
          />
        </div>

        <div className="d-flex align-items-center gap-5 mb-5">
          {/* Show on navigation bar checkbox */}
          <LabelledCheckbox
            label="Show on navigation bar"
            checked={showOnNavbar}
            onChange={toggleShowOnNavbar}
            className="w-max-content"
          />
          {/* Show on search results checkbox */}
          <LabelledCheckbox
            label="Show on search results"
            checked={showForSearch}
            onChange={toggleShowForSearch}
            className="w-max-content"
          />
        </div>

        {/* SIC4 Categories */}
        <div className="mb-5">
          <label className="mb-2">SIC4 Categories</label>
          <ReactSelect
            value={sic4CategoriesValue}
            options={sic4Options}
            onChange={handleChangeSic4}
            isMulti
            components={useMemo(() => makeAnimated(), [])}
          />
          {/* <Form.Control.Feedback type="invalid" className="d-block">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Form.Control.Feedback> */}
        </div>

        <div className="d-flex align-items-center gap-5 mb-5">
          {/* Enable for business checkbox */}
          <LabelledCheckbox
            label="Enable for business"
            checked={enableForBusiness}
            onChange={toggleEnableForBusiness}
            className="gap-3 w-max-content"
          />

          {/* Enable for filter checkbox */}
          <LabelledCheckbox
            label="Enable for filter"
            checked={enableForFilter}
            onChange={toggleEnableForFilter}
            className="gap-3 w-max-content"
          />
        </div>

        <LoadingButton
          isLoading={isSavingKeyword}
          textWhileLoading="Saving..."
          className="btn btn-pry btn--lg"
          onClick={handleSubmit}
        >
          Save keyword
        </LoadingButton>
      </Modal.Body>
    </Modal>
  );
};

export default KeywordModal;
