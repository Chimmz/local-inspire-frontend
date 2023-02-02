import React from 'react';
import styles from './BestPlaces.module.scss';
import cls from 'classnames';
import Image from 'next/image';

console.log(styles);

function BestPlaces() {
  return (
    <section className={styles.bestPlaces}>
      <h2 className="mb-">The best places in the top cities</h2>
      <div className={styles.places}>
        <figure className={cls(styles.place, styles['place--special'])}>
          <Image
            src="/img/los-angeles-photo.jpg"
            layout="fill"
            alt="Los Angeles"
            objectFit="cover"
          />
          <figcaption>
            <span>Los Angeles</span>
            <span>62 Listings</span>
          </figcaption>
        </figure>
        <figure className={styles.place}>
          <Image
            src="/img/pexels-abdullah-ghatasheh-3069345.jpg"
            layout="fill"
            alt="Miami"
            objectFit="cover"
          />
          <figcaption>
            <span>Miami</span>
            <span>62 Listings</span>
          </figcaption>
        </figure>

        <figure className={styles.place}>
          <Image
            src="/img/pexels-suzukii-xingfu-872831.jpg"
            layout="fill"
            alt="Florida"
            objectFit="cover"
          />
          <figcaption>
            <span>Florida</span>
            <span>62 Listings</span>
          </figcaption>
        </figure>
        <figure className={cls(styles.place, styles['place--special'])}>
          <Image
            src="/img/newyork-photo.jpg"
            layout="fill"
            alt="New York"
            objectFit="cover"
          />
          <figcaption>
            <span>New York</span>
            <span>62 Listings</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export default BestPlaces;
