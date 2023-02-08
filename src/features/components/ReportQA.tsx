import React, { useState, useEffect } from 'react';
import { Form, Modal, Spinner } from 'react-bootstrap';
import useInput from '../hooks/useInput';
import useRequest from '../hooks/useRequest';
import useSignedInUser from '../hooks/useSignedInUser';
import api from '../library/api';
import { simulateRequest } from '../utils/async-utils';
import { isRequired, maxLength } from '../utils/validators/inputValidators';
import LoadingButton from './shared/button/Button';
import RadioOptions from './shared/radio/RadioOptions';
import PageSuccess from './shared/success/PageSuccess';
import TextInput from './shared/text-input/TextInput';

interface ReportQAProps {
  show: boolean;
  reportObjectId: string;
  reportType: 'question' | 'answer' | 'review' | 'advice';
  possibleReasons: string[];
  close(): void;
  onReport?: (reason: string, explanation: string) => void;
}

const ReportQA = function (props: ReportQAProps) {
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const currentUser = useSignedInUser();
  const { send: sendReportReq, loading: isReporting } = useRequest({ autoStopLoading: true });

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

  const handleSubmitClick: React.FormEventHandler = async function (ev) {
    if ([runReasonValidators(), runExplanationReportValidators()].some(r => r.errorExists))
      return;
    if (props.onReport) return props.onReport(reason, explanation);

    const modelMap = {
      review: 'BusinessReview',
      question: 'BusinessQuestion',
      answer: 'BusinessAnswer',
      advice: 'BusinessTip',
    };

    const body = {
      reportedObject: props.reportObjectId,
      model: modelMap[props.reportType],
      reason,
      moreExplanation: explanation,
    };
    console.log(body);

    const res = await sendReportReq(api.report(body, currentUser.accessToken!));
    setReportSubmitted(res?.status === 'SUCCESS');
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
        {reportSubmitted ? (
          <PageSuccess
            title="Thank you!"
            description="We have received your report and a moderator will investigate it."
          />
        ) : (
          <>
            <p className="parag">
              Please let us know why you think the content you&apos;re reporting violates our
              guidelines. Use the below forms to report any questionable or inappropriate{' '}
              {props.reportType}s.
            </p>
            <strong className="mb-3 d-block">
              Why do you want to report this {props.reportType}?
            </strong>

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
              <LoadingButton
                isLoading={isReporting}
                className="btn btn-pry"
                onClick={handleSubmitClick}
                textWhileLoading={
                  <Spinner animation="border" style={{ borderWidth: '2px' }} />
                }
              >
                Submit
              </LoadingButton>
              <button
                className="btn btn-bg-none-no-bg-hover"
                disabled={isReporting}
                onClick={() => {
                  props.close();
                  clearExplanation();
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ReportQA;
