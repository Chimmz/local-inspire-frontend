import React from 'react';
import { Modal } from 'react-bootstrap';

interface PopupInfoPropsProps {
  show: boolean;
  close: Function;
  heading?: React.ReactNode;
  bodyStyle?: React.CSSProperties;
  children: React.ReactNode;
}

const PopupInfo: React.FC<PopupInfoPropsProps> = props => {
  return (
    <Modal show={props.show} centered scrollable onHide={props.close as () => void}>
      {props.heading ? (
        <Modal.Header className="pb-4 px-3" closeButton>
          {props.heading}
        </Modal.Header>
      ) : null}
      <Modal.Body className="py-3 px-5">{props.children}</Modal.Body>
    </Modal>
  );
};

export default PopupInfo;
