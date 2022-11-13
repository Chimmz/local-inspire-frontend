import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

interface Props {
  shown: boolean;
  closeMap: Function;
}
interface AnyHTMLElement extends HTMLElement {
  position: 'relative' | 'absolute';
}

const GoogleMapView = function ({ shown, closeMap }: Props) {
  useEffect(() => {
    setTimeout(() => {
      const modal = document.querySelector('.modal-dialog.modal-fullscreen');
      console.log(modal);
    }, 20);
  }, []);

  if (!shown) return <></>;
  return (
    <Modal show={true} fullscreen onHide={() => closeMap()}>
      <Modal.Header closeButton>
        <Modal.Title>Google Map</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus ratione corrupti
        accusantium soluta velit error ipsa necessitatibus iure optio amet. Voluptas
        asperiores, dignissimos placeat non, molestiae excepturi in veritatis eaque
        maiores dolores ea velit assumenda deserunt ullam nobis quam expedita. Culpa
        inventore quam tenetur, aspernatur incidunt odit por
      </Modal.Body>
    </Modal>
  );
};

export default GoogleMapView;
