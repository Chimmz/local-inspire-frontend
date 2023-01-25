import React from 'react';
import { Modal } from 'react-bootstrap';

interface GuidelinesPopupProps {
  show: boolean;
  close: Function;
  heading?: React.ReactNode;
  bodyStyle?: React.CSSProperties;
  children: React.ReactNode;
}

const GuidelinesPopup: React.FC<GuidelinesPopupProps> = props => {
  return (
    <Modal show={props.show} centered scrollable onHide={props.close as () => void}>
      {props.heading ? <Modal.Header closeButton>{props.heading}</Modal.Header> : null}
      <Modal.Body className="py-3 px-5">{props.children}</Modal.Body>
    </Modal>
  );
};

export default GuidelinesPopup;
