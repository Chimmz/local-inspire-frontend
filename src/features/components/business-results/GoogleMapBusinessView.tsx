import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

interface Props {
  shown: boolean;
  closeMap: Function;
}
interface AnyHTMLElement extends HTMLElement {
  position: 'relative' | 'absolute';
}

const GoogleMapView = ({ shown, closeMap }: Props) => {
  if (!shown) return <></>;

  useEffect(() => {
    setTimeout(() => {
      const modal = document.querySelector('.modal-dialog.modal-fullscreen');
      console.log(modal);
    }, 20);
  }, []);

  return (
    <Modal show={true} fullscreen onHide={() => closeMap()}>
      <Modal.Header closeButton>
        <Modal.Title>Google Map</Modal.Title>
      </Modal.Header>
      <Modal.Body>Map will be shown here</Modal.Body>
    </Modal>
  );
};

export default GoogleMapView;
