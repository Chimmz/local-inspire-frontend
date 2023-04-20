import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import useInput from '../../hooks/useInput';
import { isRequired, mustNotBeSameAs } from '../../utils/validators/inputValidators';
import TextInput from '../shared/text-input/TextInput';
import LabelledCheckbox from '../shared/LabelledCheckbox';
import useToggle from '../../hooks/useToggle';
import api from '../../library/api';
import useRequest from '../../hooks/useRequest';
import useSignedInUser from '../../hooks/useSignedInUser';
import navigateTo, { genBusinessPageUrl } from '../../utils/url-utils';
import { useRouter } from 'next/router';
import LoadingButton from '../shared/button/Button';

interface Props {
  show: boolean;
  businessId: string;
  businessName: string;
  businessAddress: string;
  pageSlug: string;
  close: () => void;
}

const selectOptions = [
  'Owner',
  'Business Manager',
  'Business Representative ',
  'I work here and have permission to claim',
  'Other',
];

const BusinessClaimModal = (props: Props) => {
  const { state: authorized, toggle: toggleAuthorized } = useToggle();
  const { state: agreedToTerms, toggle: toggleAgreedToTerms } = useToggle();
  const { send: sendClaimReq, loading: isSubmitting, startLoading: showSpinner } = useRequest();
  const { accessToken } = useSignedInUser();

  const router = useRouter();

  const {
    inputValue: phone,
    handleChange: handleChangePhone,
    validationErrors: phoneValidationErrors,
    runValidators: runPhoneValidators,
  } = useInput({ init: '', validators: [{ fn: isRequired, params: [] }] });

  const {
    inputValue: email,
    handleChange: handleChangeEmail,
    validationErrors: emailValidationErrors,
    runValidators: runEmailValidators,
  } = useInput({ init: '', validators: [{ fn: isRequired, params: [] }] });

  const {
    inputValue: role,
    handleChange: handleChangeRole,
    validationErrors: roleValidationErrors,
    runValidators: runRoleValidators,
  } = useInput({
    init: '',
    validators: [
      { fn: mustNotBeSameAs, params: ['Select', 'This field is required'] },
      { fn: isRequired, params: [] },
    ],
  });

  const handleContinue = () => {
    const validators = [runPhoneValidators, runEmailValidators, runRoleValidators];
    if (validators.some(v => v().errorExists) || !authorized || !agreedToTerms) return;

    console.log(props.businessId, accessToken);

    const body = { businessPhone: phone, businessEmail: email, role };
    const req = api.claimBusiness(props.businessId, body, accessToken!);

    sendClaimReq(req).then(res => {
      if (res.status !== 'SUCCESS') return;
      showSpinner();
      router.push(genBusinessPageUrl<string>({ slug: props.pageSlug }));
    });
  };

  return (
    <Modal show={props.show} centered size="lg" onHide={props.close}>
      <Modal.Header className="bg-white text-center py-4 px-5" closeButton>
        <h2>Claim Your FREE Listing</h2>
        <br />
        <span className="text-black fs-3">{props.businessName}</span>
        <br />
        <span className="text-light">{props.businessAddress}</span>
      </Modal.Header>
      <Modal.Body className="p-5">
        <div className="d-flex flex-wrap gap-5 mb-5">
          <div className="flex-grow-1">
            <TextInput
              type="number"
              min={1111}
              value={phone}
              onChange={handleChangePhone}
              validationErrors={phoneValidationErrors}
              label="Business Phone"
            />
          </div>
          <div className="flex-grow-1">
            <TextInput
              value={email}
              onChange={handleChangeEmail}
              validationErrors={emailValidationErrors}
              label="Business Email"
            />
          </div>
        </div>

        <Form.Group className="mb-5">
          <Form.Label>How do you represent this business? *</Form.Label>
          <Form.Select
            className="textfield"
            value={role}
            onChange={handleChangeRole}
            isInvalid={!!roleValidationErrors.length}
          >
            <option value="Select">Select an option</option>
            {selectOptions.map(opt => (
              <option value={opt} key={opt}>
                {opt}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid" className="d-block position-relative">
            {roleValidationErrors?.[0]?.msg}
          </Form.Control.Feedback>
        </Form.Group>

        <LabelledCheckbox
          label="I certify that I am an authorized representative of this business and have the authority to claim and represent this business, and agree to localinspire’s Terms of Service and Privacy Policy."
          className="gap-3 mb-5"
          checked={authorized}
          onChange={toggleAuthorized}
        />

        <LabelledCheckbox
          label="I have read and agree to localinspire’s Terms of Service and Privacy Policy."
          className="gap-3"
          checked={agreedToTerms}
          onChange={toggleAgreedToTerms}
        />
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <LoadingButton
          isLoading={isSubmitting}
          withSpinner
          className="btn btn-pry btn--lg"
          onClick={handleContinue}
          disabled={
            !authorized || !agreedToTerms || !email || !phone || !!roleValidationErrors.length
          }
        >
          Continue
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};

export default BusinessClaimModal;
