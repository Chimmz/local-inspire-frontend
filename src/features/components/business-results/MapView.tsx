import React, { useState, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';

import Modal from 'react-bootstrap/Modal';

interface Props {
  show: boolean;
  closeMap: any;
  coords: string | undefined;
  withModal: boolean;
  scrollZoom?: boolean;
  placeName?: string;
  zoom?: number;
}

interface Viewport {
  longitude: number | undefined;
  latitude: number | undefined;
  zoom: number;
}

const MapView = function (props: Props) {
  const { coords, withModal = true, scrollZoom = true, zoom } = props;
  const [lat, lng] = coords?.split(',') || [];
  const [view, setView] = useState<Viewport>({
    latitude: +lat,
    longitude: +lng,
    zoom: zoom || 8,
  });

  useEffect(() => {
    setTimeout(() => {
      const mapBoxText = document.querySelector(
        '.mapboxgl-ctrl.mapboxgl-ctrl-attrib',
      ) as HTMLElement;

      if (!mapBoxText) return;
      mapBoxText.style.display = 'none';
      mapBoxText.style.visibility = 'hidden';
    }, 20);
  }, []);

  if (!withModal) {
    return (
      <Map
        initialViewState={view}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      />
    );
  }

  return (
    <Modal show={props.show} fullscreen onHide={props.closeMap}>
      <Modal.Header closeButton>
        <Modal.Title>{props.placeName}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
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
