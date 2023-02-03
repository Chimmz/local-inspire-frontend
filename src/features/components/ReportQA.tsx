import React, { useEffect } from 'react';
import { Form, Modal } from 'react-bootstrap';
import useInput from '../hooks/useInput';
import { isRequired, maxLength } from '../utils/validators/inputValidators';
import RadioOptions from './shared/radio/RadioOptions';
import TextInput from './shared/text-input/TextInput';

interface ReportQAProps {
  show: boolean;
  possibleReasons: string[];
  close(): void;
  onReport(reason: string, explanation: string): void;
}

const ReportQA = function (props: ReportQAProps) {
  const {
    inputValue: reason,
    handleChange: handleChangeReason,
    validationErrors: reasonValidationErrors,
    runValidators: runReasonValidators,
    clearInput: clearReasonText,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['Please select a reason'] }],
  });

  const {
    inputValue: explanation,
    handleChange: handleChangeExplanation,
    validationErrors: explanationValidationErrors,
    runValidators: runExplanationReportValidators,
    clearInput: clearExplanation,
  } = useInput({
    init: '',
    validators: [
      { fn: isRequired, params: ['Please give a brief explanation'] },
      { fn: maxLength, params: [200] },
    ],
  });

  const handleSubmitClick: React.FormEventHandler = function (ev) {
    const vResults = [runReasonValidators(), runExplanationReportValidators()];
    if (vResults.some(r => r.errorExists)) return;

    props.onReport(reason, explanation);
    props.close();
  };

  useEffect(() => {
    if (!props.show) {
      clearExplanation();
      clearReasonText();
    }
  }, [props.show]);

  return (
    <Modal show={Boolean(props.show)} centered scrollable onHide={props.close}>
      <Modal.Header closeButton>
        <h4 className="fs-2 ps-4 mt-3">Report a problem</h4>
      </Modal.Header>
      <Modal.Body className="py-5 px-5">
        <p className="parag">
          Please let us know why you think the content you&apos;re reporting violates our
          guidelines. Use the below forms to report any questionable or inappropriate reviews.
        </p>
        <strong className="mb-3 d-block">Why do you want to report this review?</strong>

        <RadioOptions
          as="circle"
          options={props.possibleReasons}
          onChange={handleChangeReason}
          value={reason}
          name="report_reason"
          layout="block"
          validationError={reasonValidationErrors[0]?.msg}
        />

        <strong className="my-4 d-block">Please provide specific details below:</strong>
        <TextInput
          as="textarea"
          value={explanation}
          onChange={handleChangeExplanation}
          validationErrors={explanationValidationErrors}
          className="textfield"
        />

        <div className="d-flex align-items-center gap-3 mt-3">
          <button className="btn btn-pry" onClick={handleSubmitClick}>
            Submit
          </button>
          <button
            className="btn btn-bg-none-no-bg-hover"
            onClick={() => {
              props.close();
              clearExplanation();
            }}
          >
            Cancel
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ReportQA;
