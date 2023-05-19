import { useMemo, useState, FormEventHandler, useEffect, useCallback } from 'react';
import { UserPublicProfile } from '../../types';

import useInput from '../../hooks/useInput';
import useRequest from '../../hooks/useRequest';
import useSignedInUser from '../../hooks/useSignedInUser';

import api from '../../library/api';
import { getFullName } from '../../utils/user-utils';
import { isRequired } from '../../utils/validators/inputValidators';

import { Icon } from '@iconify/react';
import { Modal } from 'react-bootstrap';
import LoadingButton from '../shared/button/Button';
import SuccessUI from '../shared/success/SuccessFeedback';
import TextInput from '../shared/text-input/TextInput';

interface MsgModalProps {
  show: boolean;
  recipient: Pick<UserPublicProfile, 'firstName' | 'lastName' | '_id'>;
  close: () => void;
}

const MessageModal = function (props: MsgModalProps) {
  const [msgSent, setMsgSent] = useState(false);

  const { accessToken } = useSignedInUser();
  const { send: sendReq, loading: sending } = useRequest({ autoStopLoading: true });

  const {
    inputValue: newMessage,
    handleChange: handleChangeNewMessage,
    validationErrors: newMessageValidators,
    runValidators: runNewMessageValidators,
    pushValidationError,
    clearInput: clearNewMessage,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['Message body cannot be empty.'] }],
  });

  const handleSendMsg: FormEventHandler<HTMLFormElement> = async ev => {
    ev.preventDefault();
    if (runNewMessageValidators().errorExists) return;
    const res = await sendReq(api.sendMessage(newMessage, props.recipient._id, accessToken!));
    switch (res.status) {
      case 'SUCCESS':
        setMsgSent(true);
        clearNewMessage();
        break;
      case 'FAIL':
        pushValidationError(
          res.msg || "Sorry, we couldn't deliver your message. Please try again.",
        );
    }
  };

  const recipientName = useMemo(
    () => getFullName(props.recipient, { lastNameInitial: true }),
    [props.recipient],
  );

  return (
    <Modal
      show={props.show}
      centered
      onHide={props.close}
      onExited={setMsgSent.bind(null, false)}
    >
      <Modal.Header className="p-4" closeButton>
        <div className="d-flex  gap-4">
          <Icon icon="ooui:message" width={18} />
          <h3 className="m" style={{ marginBottom: '-3px' }}>
            Send a message to {recipientName}
          </h3>
        </div>
      </Modal.Header>

      <Modal.Body className="py-5 px-5">
        {msgSent ? (
          <>
            <SuccessUI
              title="Message sent!"
              description={`Your message was successfully sent to ${recipientName}.
              Please give ${recipientName} some time to get back to you.`}
            />
            <button className="btn btn-outline-pry ms-auto mt-4" onClick={props.close}>
              Close
            </button>
          </>
        ) : (
          <form onSubmit={handleSendMsg}>
            <div className="mb-3">
              <TextInput
                as="textarea"
                autoFocus
                value={newMessage}
                onChange={handleChangeNewMessage}
                validationErrors={newMessageValidators}
                className="textfield w-100 d-block"
                label="Message"
              />
            </div>

            <div className="d-flex flex-column align-items-center">
              <LoadingButton
                type="submit"
                className="btn btn-pry btn--lg mb-2"
                isLoading={sending}
                textWhileLoading={
                  <>
                    <Icon
                      icon="material-symbols:send-sharp"
                      width={18}
                      style={{ marginRight: '10px' }}
                    />
                    Sending...
                  </>
                }
              >
                <Icon icon="material-symbols:send-sharp" width={18} /> Send message
              </LoadingButton>

              <small className="text-light">
                Please give {recipientName} some time to get back to you.
              </small>
            </div>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MessageModal;
