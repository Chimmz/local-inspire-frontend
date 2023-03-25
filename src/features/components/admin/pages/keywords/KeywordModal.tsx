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
    state: enableForBusiness,
    toggle: toggleEnableForBusiness,
    setOn: setEnabledForBusinessTrue,
    setOff: setEnabledForBusinessFalse,
  } = useToggle(props.keyword?.enableForBusiness || true);

  const {
    state: enableForFilter,
    toggle: toggleEnableForFilter,
    setOn: setEnabledForFilterTrue,
    setOff: setEnabledForFilterFalse,
  } = useToggle(props.keyword?.enableForFilter || true);

  const { chosenItems: selectedSic4Categories, onSelect: handleChangeSic4 } = useReactSelect();
  const { accessToken } = useSignedInUser();
  const { send: sendGetCategories, loading: gettingCategories } = useRequest();
  const { send: sendSaveKeywordReq, loading: isSavingKeyword } = useRequest();

  const sic4Options = useMemo(() => getSelectOptions(sic4Categories), [sic4Categories]);

  const saveKeyword = async () => {
    const body = {
      name: keywordName,
      enableForBusiness,
      enableForFilter,
      sic4Categories: (selectedSic4Categories as ReactSelectOption[]).map(optn => optn.value),
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
    if (!(selectedSic4Categories as []).length) return;
    saveKeyword();
  };

  useEffect(() => {
    const req = sendGetCategories(api.getAllBusinessCategories('SIC4'));
    req.then(res => res.status === 'SUCCESS' && setSic4Categories(res.categories));

    // If not in edit mode
    if (!props.keyword) return;
    (props.keyword.enableForBusiness ? setEnabledForBusinessTrue : setEnabledForBusinessFalse)();
    (props.keyword.enableForFilter ? setEnabledForFilterTrue : setEnabledForFilterFalse)();
    setKeywordName(props.keyword.name);
  }, [props.keyword]);

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
        <div className="mb-5">
          <TextInput
            label="Name"
            value={keywordName}
            onChange={handleChangeName}
            validationErrors={nameValidationErrors}
            autoFocus={!!!props.keyword} // Autofocus if not in edit mode
          />
        </div>

        {/* Enable for business checkbox */}
        <LabelledCheckbox
          label="Enable for business"
          checked={enableForBusiness}
          onChange={toggleEnableForBusiness}
          className="gap-3 w-max-content mb-5"
        />

        {/* Enable for filter checkbox */}
        <LabelledCheckbox
          label="Enable for filter"
          checked={enableForFilter}
          onChange={toggleEnableForFilter}
          className="gap-3 w-max-content mb-5"
        />

        {/* SIC4 Categories */}
        <div className="mb-5">
          <label className="mb-2">SIC4 Categories</label>
          <ReactSelect
            options={sic4Options}
            onChange={handleChangeSic4}
            isMulti
            components={useMemo(() => makeAnimated(), [])}
          />
          {/* <Form.Control.Feedback type="invalid" className="d-block">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Form.Control.Feedback> */}
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
