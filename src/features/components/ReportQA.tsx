import React from 'react';
import { Modal } from 'react-bootstrap';
import useInput from '../hooks/useInput';
import { isRequired } from '../utils/validators/inputValidators';
import TextInput from './shared/text-input/TextInput';

interface ReportQAProps {
  show: boolean;
  close(): void;
  onReport(reason: string, explanation: string): void;
}

const ReportQA = function (props: ReportQAProps) {
  const {
    inputValue: reportText,
    handleChange: handleChangeReport,
    validationErrors: reportValidators,
    runValidators: runReportValidators,
    clearInput: clearReportText,
  } = useInput({ init: '', validators: [{ fn: isRequired, params: [] }] });

  const handleSubmitClick: React.FormEventHandler = ev => {
    if (runReportValidators().errorExists) return;
    props.onReport('some_reason', reportText);
    props.close();
  };

  return (
    <Modal show={Boolean(props.show)} centered scrollable onHide={props.close}>
      <Modal.Header closeButton>
        <h4 className="text-center w-100 fs-2 mt-3">Report a problem</h4>
      </Modal.Header>
      <Modal.Body className="py-3 px-5">
        <p className="parag">
          Please let us know why you think the content you&apos;re reporting violates our
          guidelines. Use the below forms to report any questionable or inappropriate reviews.
        </p>
        <strong className="mb-3 d-block">Why do you want to report this review?</strong>
        <ul>
          <li className="d-flex align-items-center gap-3">
            <input type="radio" name="" id="" />
            Review contains false information
          </li>
          <li className="d-flex align-items-center gap-3">
            <input type="radio" name="" id="" /> Review violates guidelines
          </li>
          <li className="d-flex align-items-center gap-3">
            <input type="radio" name="" id="" /> Contains threats, lewdness, or hate speach
          </li>
          <li className="d-flex align-items-center gap-3">
            <input type="radio" name="" id="" /> Review posted to wrong location
          </li>
          <li className="d-flex align-items-center gap-3">
            <input type="radio" name="" id="" /> Review is spam
          </li>
          <li className="d-flex align-items-center gap-3">
            <input type="radio" name="" id="" /> I want to report something else
          </li>
        </ul>
        <strong className="my-4 d-block">Please provide specific details below:</strong>

        <TextInput
          as="textarea"
          value={reportText}
          onChange={handleChangeReport}
          validationErrors={reportValidators}
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
              clearReportText();
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
