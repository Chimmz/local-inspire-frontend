import React, { useEffect, useState } from 'react';
import { City } from '../../types';
// Utils
import cls from 'classnames';
import api from '../../library/api';
// Context and hooks
import { useUserLocationContext } from '../../contexts/UserLocationContext';
import useRequest from '../../hooks/useRequest';
// Compons and styles
import Image from 'next/image';
import styles from './BestPlaces.module.scss';

const TOTAL_CITIES_TO_SHOW = 20;

function BestPlaces() {
  const [cities, setCities] = useState<City[] | undefined>();
  const { userLocation } = useUserLocationContext();
  const { send: sendCitiesReq, loading: citiesLoading } = useRequest();

  useEffect(() => {
    if (!userLocation) return;

    const req = api.getCities({
      stateCode: userLocation.stateCode,
      isFeatured: true,
      page: 1,
      limit: TOTAL_CITIES_TO_SHOW,
    });
    sendCitiesReq(req).then(res => res.status === 'SUCCESS' && setCities(res.cities));
  }, [userLocation]);

  if (!cities?.length) return <></>;
  return (
    <section className={styles.bestPlaces}>
      <h2 className="mb-">The best places in the top cities</h2>
      <div className={styles.places}>
        {cities.map((city, i) => (
          <figure
            className={cls(styles.place, !(i % 3) && styles['place--special'])}
            key={city._id}
          >
            <Image
              src={city.imgUrl}
              layout="fill"
              alt={`Photo of ${city.name}, ${city.stateCode}`}
              objectFit="cover"
            />
            <figcaption>
              <span>{city.name}</span>
              <span>62 Listings</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default BestPlaces;
