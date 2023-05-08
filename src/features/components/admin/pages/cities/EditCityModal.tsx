import React, { useEffect, useMemo, useState } from 'react';

import useInput from '../../../../hooks/useInput';
import useToggle from '../../../../hooks/useToggle';
import useRequest from '../../../../hooks/useRequest';
import useReactSelect from '../../../../hooks/useReactMultiselect';
import useSignedInUser from '../../../../hooks/useSignedInUser';

import * as validators from '../../../../utils/validators/inputValidators';
import makeAnimated from 'react-select/animated';
import api from '../../../../library/api';
import { getSelectOptions, ReactSelectOption } from './config';

import { Form, Modal } from 'react-bootstrap';
import LabelledCheckbox from '../../../shared/LabelledCheckbox';
import TextInput from '../../../shared/text-input/TextInput';
import LoadingButton from '../../../shared/button/Button';
import ReactSelect from 'react-select';
import { AdminSearchKeyword, City } from '../../../../types';
import Image from 'next/image';
import FileUploadPrompt from '../../../shared/FileUploadPrompt';
import useDeviceFileUpload from '../../../../hooks/useDeviceFileUpload';

interface Props {
  city: City | undefined;
  cityIndex: number | undefined;
  stateNames: string[] | undefined;
  onUpdate(): void;

  show: boolean;
  close: () => void;
  onExit?: () => void;
}

const EditCityModal = function (props: Props) {
  const [statesUSA, setStatesUSA] = useState<string[]>([]);
  const currenUser = useSignedInUser();
  const { send: sendGetCategories, loading: loadingCategories } = useRequest();
  const { send: sendUpdateReq, loading: isUpdating } = useRequest();

  const {
    inputValue: cityName,
    handleChange: handleChangeName,
    validationErrors: nameValidationErrors,
    runValidators: runNameValidators,
    setInputValue: setCityName,
    clearInput: clearName,
  } = useInput({
    init: '',
    validators: [{ fn: validators.isRequired, params: ['City name cannot be empty'] }],
  });

  const {
    inputValue: price,
    handleChange: handleChangePrice,
    validationErrors: priceValidationErrors,
    runValidators: runPriceValidators,
    setInputValue: setPrice,
    clearInput: clearPrice,
  } = useInput({
    init: '',
    // validators: [{ fn: validators.isRequired, params: ['Please enter a name for this keyword'] }],
    type: 'number',
  });

  const {
    inputValue: population,
    handleChange: handleChangePopulation,
    validationErrors: populationValidationErrors,
    runValidators: runPopulationValidators,
    setInputValue: setPopulation,
    clearInput: clearPopulationValue,
  } = useInput({
    init: '',
    validators: [{ fn: validators.isRequired, params: ['Population cannot be empty'] }],
    type: 'number',
  });

  const {
    inputValue: usaState,
    handleChange: handleChangeUsaState,
    validationErrors: usaStateValidationErrors,
    runValidators: runUsaStateValidators,
    setInputValue: setUsaState,
    clearInput: clearUsaState,
  } = useInput({
    init: '',
    validators: [
      { fn: validators.mustNotBeSameAs, params: ['Select', 'This field is required'] },
    ],
  });

  const {
    inputValue: description,
    handleChange: handleChangeDescription,
    validationErrors: descriptionValidationErrors,
    runValidators: runDescriptionValidators,
    setInputValue: setDescription,
    clearInput: clearDescription,
  } = useInput({
    init: '',
    // validators: [{ fn: validators.isRequired, params: ['Please enter a name for this keyword'] }],
  });

  const {
    uploadedFile: uploadedImage,
    setUploadedFile: setUploadedImage,
    onChangeFile: handleChangeCityPhoto,
  } = useDeviceFileUpload({ type: 'image', multiple: false });

  const {
    inputValue: longitude,
    handleChange: handleChangeLongitude,
    validationErrors: longitudeValidationErrors,
    runValidators: runLongitudeValidators,
    setInputValue: setLongitude,
    clearInput: clearLongitudeValue,
  } = useInput({
    init: '',
    validators: [{ fn: validators.isRequired, params: ['This field cannot be empty'] }],
    type: 'number',
  });

  const {
    inputValue: latitude,
    handleChange: handleChangeLatitude,
    validationErrors: latitudeValidationErrors,
    runValidators: runLatitudeValidators,
    setInputValue: setLatitude,
    clearInput: clearLatitudeValue,
  } = useInput({
    init: '',
    validators: [{ fn: validators.isRequired, params: ['This field cannot be empty'] }],
    type: 'number',
  });

  const { state: isFeatured, toggle: toggleIsFeatured, setState: setIsFeatured } = useToggle();

  useEffect(() => {
    if (!props.city) return;
    setCityName(props.city.name);
    setPrice(props.city.price.amount + '' || '0.00');
    setUploadedImage({ url: props.city.imgUrl });
    setPopulation(props.city.population);
    setUsaState(props.city.stateName);
    setDescription(props.city.description || '');
    setLongitude(props.city.lng);
    setLatitude(props.city.lat);
    setIsFeatured(props.city.isFeatured);
  }, [props.city]);

  const saveCity = async () => {
    const body: { [key: string]: any; photo?: File | string } = {
      name: cityName,
      stateName: usaState,
      population,
      lat: latitude,
      lng: longitude,
      price,
      photo: uploadedImage?.rawFile || props.city!.imgUrl,
      isFeatured,
    };
    if (!uploadedImage) delete body.photo;

    const formData = new FormData();
    for (const [key, val] of Object.entries(body)) formData.append(key, val);
    console.log(body);

    const req = sendUpdateReq(
      api.updateCity(props.city!._id, formData, currenUser.accessToken!),
    );
    req.then(res => {
      if (res.status !== 'SUCCESS' || !('city' in res)) return;
      props.onUpdate();
      props.close();
    });
    req.catch(console.error);
  };

  const handleSubmit = () => {
    const validations = [
      runNameValidators(),
      runPriceValidators(),
      runPopulationValidators(),
      runUsaStateValidators(),
      runDescriptionValidators(),
      runLongitudeValidators(),
      runLatitudeValidators(),
    ];
    if (validations.some(v => v.errorExists)) return;
    saveCity();
  };

  return (
    <Modal
      show={props.show}
      onHide={props.close}
      backdrop="static"
      centered
      size="lg"
      onExit={props.onExit}
    >
      <Modal.Header closeButton>
        <h2>{props.city?.name}</h2>
      </Modal.Header>
      <Modal.Body className="p-5">
        {/* City name */}
        <div className="mb-5">
          <TextInput
            label="City Name"
            value={cityName}
            onChange={handleChangeName}
            validationErrors={nameValidationErrors}
            autoFocus={!!!props.city} // Autofocus if not in edit mode
          />
        </div>

        {/* City price */}
        <div className="mb-5">
          <TextInput
            type="number"
            min={0.0}
            step={0.01}
            label="Price ($)"
            value={price}
            onChange={handleChangePrice}
            validationErrors={priceValidationErrors}
          />
        </div>

        {/* City Population */}
        <div className="mb-5">
          <TextInput
            type="number"
            value={population}
            onChange={handleChangePopulation}
            validationErrors={populationValidationErrors}
            min={1}
            step={1}
            label="Population"
          />
        </div>

        {/* USA State */}
        <div className="mb-5">
          <Form.Label>State</Form.Label>
          <Form.Select
            className="textfield"
            onChange={handleChangeUsaState}
            value={usaState}
            isInvalid={!!usaStateValidationErrors.length}
          >
            <option value="Select">{`Please select the appropriate state for ${cityName}`}</option>
            {props.stateNames?.map(opt => (
              <option value={opt} key={opt}>
                {opt}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid" className="d-block position-relative">
            {usaStateValidationErrors?.[0]?.msg}
          </Form.Control.Feedback>
        </div>

        {/* Description */}
        <div className="mb-5">
          <TextInput
            as="textarea"
            value={description}
            onChange={handleChangeDescription}
            validationErrors={descriptionValidationErrors}
            label="Description"
          />
        </div>

        {/* Upload image */}
        <div className="d-flex flex-column align-items-start gap-2 mb-5">
          <label className="mb-2">Image</label>
          {props.city ? (
            <Image
              src={uploadedImage?.url || props.city.imgUrl}
              width={400}
              height={200}
              objectFit="cover"
            />
          ) : null}
          <FileUploadPrompt
            onChange={handleChangeCityPhoto}
            className="btn btn-outline-sec-light btn--sm"
            allowedFileTypes={['image/*']}
          >
            Change photo
          </FileUploadPrompt>
        </div>

        {/* Longitude */}
        <div className="mb-5">
          <TextInput
            type="number"
            min={0.0}
            step={0.01}
            label="Longitude"
            value={longitude}
            onChange={handleChangeLongitude}
            validationErrors={longitudeValidationErrors}
          />
        </div>

        {/* Latitude */}
        <div className="mb-5">
          <TextInput
            type="number"
            min={0.0}
            step={0.01}
            label="Latitude"
            value={latitude}
            onChange={handleChangeLatitude}
            validationErrors={latitudeValidationErrors}
          />
        </div>

        <Form.Check
          label={`Make ${cityName} featured`}
          className="gap-3 mb-5"
          checked={isFeatured}
          onChange={toggleIsFeatured}
        />

        <div className="d-flex gap-3">
          <LoadingButton
            isLoading={isUpdating}
            textWhileLoading="Saving..."
            className="btn btn-pry btn--lg"
            onClick={handleSubmit}
          >
            Save changes
          </LoadingButton>
          <button className="btn btn-outline" onClick={props.close}>
            Cancel
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditCityModal;
