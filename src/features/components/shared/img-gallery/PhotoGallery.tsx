import React from 'react';

import cls from 'classnames';

import { Modal } from 'react-bootstrap';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import styles from './PhotoGallery.module.scss';
import Image from 'next/image';

const commonItemProperties = {
  thumbnailClass: styles.thumbnail,
  thumbnailHeight: 100,
  thumbnailWidth: 100,
};
const images: ReactImageGalleryItem[] = [
  {
    original:
      'https://res.cloudinary.com/dpvothk2d/image/upload/v1674969373/businesses/nfehdeqyh1g0pycccmph.jpg',
    thumbnail:
      'https://res.cloudinary.com/dpvothk2d/image/upload/v1674969373/businesses/nfehdeqyh1g0pycccmph.jpg',
    renderItem: function (args) {
      return (
        <figure className={styles.imgFigure}>
          <Image
            src={args.original}
            layout="fill"
            // width={500}
            // height={500}
            objectFit="cover"
          />
        </figure>
      );
    },
    ...commonItemProperties,
  },
  {
    original:
      'https://res.cloudinary.com/dpvothk2d/image/upload/v1674966681/businesses/xmpftfp9jxedut7cixvz.jpg',
    thumbnail:
      'https://res.cloudinary.com/dpvothk2d/image/upload/v1674966681/businesses/xmpftfp9jxedut7cixvz.jpg',
    renderItem: function (args) {
      return (
        // <figure className={styles.imgFigure}>
        <Image src={args.original} layout="fill" width={500} height={500} objectFit="cover" />
      );
    },
    ...commonItemProperties,
  },
  {
    original:
      'https://res.cloudinary.com/dpvothk2d/image/upload/v1674966681/businesses/earpy9gbvkka2gjzfnaw.jpg',
    thumbnail:
      'https://res.cloudinary.com/dpvothk2d/image/upload/v1674966681/businesses/earpy9gbvkka2gjzfnaw.jpg',
    renderItem: function (args) {
      return (
        <figure className={styles.imgFigure}>
          <Image
            src={args.original}
            layout="fill"
            // width={500}
            // height={500}
            objectFit="cover"
          />
        </figure>
      );
    },
    ...commonItemProperties,
  },
];

const PhotoGallery = function () {
  return (
    <Modal fullscreen show>
      {/* <Modal.Header className="position-absolute"></Modal.Header> */}
      <Modal.Body className={cls(styles.modalBody, 'p-0')}>
        <ImageGallery
          items={images}
          // renderThumbInner={args => <Image src={args.original} width="100" height={100} />}
          // showPlayButton
        />
        <section className={styles.imgDescription}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rerum, cupiditate.
        </section>
        {/* <div className={styles.myGalleryContainer}>
          
        </div> */}
      </Modal.Body>
    </Modal>
  );
};

export default PhotoGallery;
