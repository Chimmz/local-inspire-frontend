import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import useRequest from '../hooks/useRequest';
import useSignedInUser from '../hooks/useSignedInUser';
import api from '../library/api';

interface CurrentLocation {
  city: string;
  cityName: string;
  stateCode: string;
  country: string;
  coords: { long: number; lat: number } | undefined;
}

export const UserLocationContext = createContext<{
  userLocation: Partial<CurrentLocation> | undefined;
  isGettingLocation: boolean;
}>({ userLocation: undefined, isGettingLocation: false });

export function UserLocationProvider({ children }: { children: ReactNode }) {
  const currentUser = useSignedInUser();
  const [userLocation, setUserLocation] = useState<Partial<CurrentLocation> | undefined>(
    currentUser.location,
  );

  const { send: sendMapboxRequest, loading } = useRequest({
    autoStopLoading: true,
    checkPositiveResponse: (res: Promise<any>) => res && 'features' in res,
  });

  const doReverseDecoding = async (coords: GeolocationCoordinates) => {
    const { longitude: long, latitude: lat } = coords;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`;
    try {
      const res = await sendMapboxRequest(fetch(url));
      const data = await res.json();
      console.log('In context, Mapbox data: ', data);

      if (!data?.features) throw Error('Something went wrong');

      // "text": "Anderson County" // --> features[0].context[2].text
      // "short_code": "US-TX", // --> features[0].context[3].short_code

      const [cityName, countryName] = [
        data.features[0].context[2].text || data.features[0].context[0].text,
        data.features[0]?.context[4]?.text || data.features[3]?.place_name,
      ];

      const [countryCode, stateCode] = (
        (data.features[0]?.context[3]?.short_code ||
          data.features[0].context[1].short_code) as string
      )?.split('-');

      const city = cityName.concat(', ').concat(stateCode);
      const country = countryName.concat(', ').concat(countryCode.toUpperCase());
      setUserLocation(prev => ({ ...prev, city, cityName, stateCode, country }));
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) return console.log('Browser doesnt support geolocation');

    const onPositionSuccess: PositionCallback = async function (position) {
      setUserLocation({
        coords: { long: position.coords.longitude, lat: position.coords.latitude },
      });
      doReverseDecoding(position.coords);
    };

    const onPositionError: PositionErrorCallback = err => {
      console.log('Error getting geolocation data: ', err);
      setUserLocation(undefined);
    };
    navigator.geolocation?.getCurrentPosition(onPositionSuccess, onPositionError);
  }, []);

  useEffect(() => {
    const updateUserLocation = async () => {
      const data = await api.updateUserLocation(userLocation!, currentUser.accessToken!);
      console.log('Update user location response: ', data);
    };

    if (currentUser.isSignedIn && userLocation?.city) updateUserLocation();
  }, [currentUser.isSignedIn, userLocation?.city]);

  return (
    <UserLocationContext.Provider value={{ userLocation, isGettingLocation: loading }}>
      {children}
    </UserLocationContext.Provider>
  );
}

export const useUserLocationContext = () => useContext(UserLocationContext);
