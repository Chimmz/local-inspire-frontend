import { useState, useEffect } from 'react';

type CurrentLocation = {
  city: string;
  state: string;
  country: string;
  coords: { longitude: number; latitude: number } | undefined;
};

const useCurrentLocation: () => CurrentLocation = function () {
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation>({
    city: '',
    state: '',
    country: '',
    coords: undefined,
  });

  const getPositionSuccessCallback: PositionCallback = async function (position) {
    // console.log({ position });
    const { longitude, latitude } = position.coords;
    setCurrentLocation(obj => ({ ...obj, coords: { longitude, latitude } }));

    const req = fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`,
    );

    const handleResponse = (data: any) => {
      console.log('Mapbox response: ', data);
      if (!data?.features) throw Error('Something went wrong');

      // const stateName = data.features[0].context[1].text as string;
      // const countryName = data.features[0].context[3].text as string;
      const [stateName, countryName] = [
        data.features[0].context[0].text as string,
        data.features[3].place_name,
      ];
      const [countryCode, stateCode] = (
        data.features[0].context[1].short_code as string
      )?.split('-');

      const state = stateName.concat(', ').concat(stateCode);
      const country = countryName.concat(', ').concat(countryCode.toUpperCase());
      setCurrentLocation({ ...currentLocation, state, country });
    };
    req
      .then(res => res.json())
      .then(handleResponse)
      .catch(console.log);
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
