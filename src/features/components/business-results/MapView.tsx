import React, { useState, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';

import Modal from 'react-bootstrap/Modal';
import useCurrentLocation from '../../hooks/useCurrentLocation';

interface Props {
  shown: boolean;
  closeMap: any;
  coords: string | undefined;
  withModal: boolean;
  scrollZoom?: boolean;
  placeName?: string;
}

interface Viewport {
  longitude: number | undefined;
  latitude: number | undefined;
  zoom: number;
}

const MapView = function (props: Props) {
  const { shown, closeMap, coords, withModal = true, scrollZoom = true } = props;
  const userLocation = useCurrentLocation();

  const [lat, lng] = coords?.split(',') || [];
  const [view, setView] = useState<Viewport>({
    latitude: +lat,
    longitude: +lng,
    zoom: 8,
  });

  useEffect(() => {
    setTimeout(() => {
      const modal = document.querySelector('.modal-dialog.modal-fullscreen')!;
      // (Array.from(modal.children) as HTMLElement[]).forEach((child: HTMLElement) => {
      //   child.style.padding = '0';
      // });
      // console.log(modal);
      // const modalBody = modal?.querySelector('.modal-body') as HTMLElement;

      const mapBoxText = document.querySelector(
        '.mapboxgl-ctrl.mapboxgl-ctrl-attrib',
      ) as HTMLElement;
      console.log({ mapBoxText });
      if (mapBoxText) {
        mapBoxText.style.display = 'none';
        mapBoxText.style.visibility = 'hidden';
      }
    }, 20);
  }, []);

  if (!shown) return <></>;

  if (!withModal)
    return (
      <Map
        initialViewState={view}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      />
    );
  return (
    <Modal show={true} fullscreen onHide={() => closeMap()}>
      <Modal.Header closeButton>
        <Modal.Title>{props.placeName}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className=""
        style={{ width: '100%', height: '100%', overflow: 'hidden' }}
      >
        <Map
          initialViewState={view}
          style={{ width: '100%', height: '100%' }}
          // mapStyle="mapbox://styles/mapbox/streets-v9"
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
          scrollZoom={scrollZoom}
          onMove={ev => setView(ev.viewState)}
        >
          <Marker longitude={-122.4} latitude={37.8} color="red" />
        </Map>
      </Modal.Body>
    </Modal>
  );
};

export default MapView;
