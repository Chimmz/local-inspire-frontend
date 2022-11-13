import { useState, useEffect } from 'react';

type CurrentLocation = {
  coords: { longitude: number; latitude: number };
  country: string;
  state: string;
  city: string;
};

const useCurrentLocation: () => CurrentLocation | {} = function () {
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation | {}>({});

  const getPositionSuccessCallback: PositionCallback = async position => {
    // console.log({ position });
    const { longitude, latitude } = position.coords;
    setCurrentLocation(obj => ({ ...obj, longitude, latitude }));

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyBCMI4epNPuo_ZNMRDPdrSEM0vKoojVcyg`,
      {
        method: 'GET',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(res);
  };

  useEffect(() => {
    if (!navigator.geolocation) return console.log('Browser doesnt support geolocation');

    navigator.geolocation?.getCurrentPosition(getPositionSuccessCallback, err => {
      console.log('Error getting geolocation data: ', err);
    });
  }, []);

  return currentLocation;
};

export default useCurrentLocation;
