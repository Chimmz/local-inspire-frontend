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
  const { send: sendGetCategories, loading: loadingCategories } = useRequest();
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
    const req = sendGetCategories(api.getBusinessCategories('SIC4', ''));
    req.then(res => res.status === 'SUCCESS' && setSic4Categories(res.categories));

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

// EXPLANATIONS FOR PHASE 2:

// Filters: (26th Dec)
// https://edocadvisor.com/admin/filters

// We add keywords and the sic codes it should show for.
// So if I add "Restaurants", I need to be able to set the sic code for it like Restaurants. So, when someone searches for restaurants the filters I add for it will show.
// We set filters for the keywords (most important categories) we have like hotels and motels, Restaurants, cruises and so on.

// So when I add the filter it needs to be like so:

// Add keyword:
// 1)	Keyword title
// 2)	Select Sic codes

// Add Filters:
// 1) Select keyword
// 2) Add title (Will show on search page and Add/Edit page)
// 3) Add description (will only show on Add/edit business page)
// 4) Select to show on Search page and or Business add/edit page)
// 5) Order they will show in on filter and business page.
// 6) Filter keywords can add as many as I want.
// 7) Form type it will be.

// Whatever a business selects when adding or editing the business will show on the business page. And a business will show on search page according to what was selected.

// I will select the keyword like "Restaurants", I will then select the sic code for it.

// I will then select if it is for search and add/edit business.

// I can then add the filters like it is on my site. Filter title and all the filters.

// This is the tricky part as we will have price range also.

// But need to show on results page and add/edit page like trip advisor and show a few then if more popup.

// And whatever the businesses select when they add/edit their business page will show on their business page.
