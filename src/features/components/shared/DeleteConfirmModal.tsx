import { useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';

interface Props {
  show: boolean;
  title?: string;
  msg?: string;
  onChooseDelete: Function;
  loading: boolean;
  close: () => void;
}

const DeleteConfirmModal = function (props: Props) {
  const btnText = useMemo(
    () => (props.loading ? 'Deleting...' : 'Yes, delete'),
    [props.loading],
  );

  return (
    <Modal show={props.show} onHide={props.close}>
      <Modal.Header closeButton>
        <h2>{props.title || 'Delete Confirmation'}</h2>
      </Modal.Header>
      <Modal.Body>
        <p className="parag mb-auto">{props.msg || 'Are you sure you want to delete?'}</p>
        <div className="d-flex gap-3 mt-5">
          <button className="btn btn-outline btn--sm fs-5" onClick={props.close}>
            Cancel
          </button>
          <button
            className="btn btn-pry btn--sm fs-5"
            onClick={props.onChooseDelete as () => void}
          >
            {btnText}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteConfirmModal;
