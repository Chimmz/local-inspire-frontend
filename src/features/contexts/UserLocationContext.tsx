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

  const smartlyExtractLocation = (mapboxContexts: { [key: string]: string }[]) => {
    console.log('Param: ', mapboxContexts);
    const data = mapboxContexts.reduce(
      (accum, context) => {
        if (!context) return accum;
        // Find state code
        if (context.short_code?.length === 5 && context.short_code.includes('-')) {
          if (accum.stateCode.length) return accum;
          return { ...accum, stateCode: context.short_code.split('-')[1] };
        }

        // Country name
        if (!accum.country.length && context.id?.includes('country') && context.text.length)
          return { ...accum, country: context.text };

        if (accum.cityName.length) return accum;
        // Find city name
        if (context.id?.includes('region') && context.text?.length) {
          return { ...accum, cityName: context.text };
        } else if (context.id?.includes('place') && context.text?.length) {
          return { ...accum, cityName: context.text };
        }
        return accum;
      },
      { cityName: '', stateCode: '', country: '' },
    );
    return data;
  };

  const doReverseDecoding = async (coords: GeolocationCoordinates) => {
    const { longitude: long, latitude: lat } = coords;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`;
    try {
      const res = await sendMapboxRequest(fetch(url));
      const data = await res.json();
      console.log('In context, Mapbox data: ', data);

      if (!data?.features) throw Error('Something went wrong');

      const extractedData = smartlyExtractLocation(
        (data.features as { context: { [key: string]: string } }[]).map(f => f.context).flat(),
      );
      console.log('extractedData: ', extractedData);

      const city = [extractedData.cityName, extractedData.stateCode].join(', ');
      setUserLocation(prev => ({ ...prev, ...extractedData, city }));
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
