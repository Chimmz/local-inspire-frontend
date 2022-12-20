import Image from 'next/image';
import React from 'react';

import styles from './Gallery.module.scss';

function Gallery() {
  return (
    <section className={styles.gallery}>
      <div className={styles['gallery-photos']}>
        <picture>
          <Image
            src="/img/pexels-fauxels-3184405.jpg"
            alt=""
            layout="fill"
            objectFit="cover"
            objectPosition="right"
            style={{ borderRadius: '8px' }}
          />
        </picture>

        <picture>
          <Image
            src="/img/pexels-pixabay-262978.jpg"
            alt=""
            layout="fill"
            objectFit="cover"
            objectPosition="top left"
            style={{ borderRadius: '8px' }}
          />
        </picture>

        <picture>
          <Image
            src="/img/pexels-suzukii-xingfu-872831.jpg"
            alt=""
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            style={{ borderRadius: '8px' }}
          />
        </picture>
      </div>

      <div className={styles['gallery-text']}>
        <h2 className="mb-4" style={{ maxWidth: '17ch' }}>
          <span className="text-pry">Join us</span> in making our community great!
        </h2>

        <p className="mb-3 fs-5">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam alias expedita
          ratione voluptates! Veritatis quidem odio iste nesciunt, ratione nemo.
        </p>

        <p className="mb-3 fs-5">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam assumenda aut
          nostrum dicta. Quis fugiat provident, dolores quam hic obcaecati.
        </p>

        <p className=" fs-5">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam assumenda aut
          nostrum dicta. Quis fugiat provident, dolores quam hic obcaecati.
        </p>
      </div>
    </section>
  );
}

export default Gallery;
