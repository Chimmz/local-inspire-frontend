import React from 'react';

import cls from 'classnames';

// import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';

import LightGallery from 'lightgallery/react';
// import plugins if you need
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import { Modal } from 'react-bootstrap';
import styles from './PhotoGallery.module.scss';
import Image from 'next/image';

// 'https://res.cloudinary.com/dpvothk2d/image/upload/v1674969373/businesses/nfehdeqyh1g0pycccmph.jpg',
// 'https://res.cloudinary.com/dpvothk2d/image/upload/v1674966681/businesses/xmpftfp9jxedut7cixvz.jpg',
// 'https://res.cloudinary.com/dpvothk2d/image/upload/v1674966681/businesses/earpy9gbvkka2gjzfnaw.jpg',

interface Props {
  show: boolean;
  imgUrls: string[] | undefined;
}

const PhotoGallery = function (props: Props) {
  const onInit = () => {
    console.log('lightGallery has been initialized');
  };

  return (
    <Modal fullscreen show={props.show} scrollable={false}>
      <Modal.Header>Photo Gallery</Modal.Header>

      <Modal.Body className={cls(styles.modalBody, 'p-0')}>
        {/* <section className={styles.gallerySection}> */}
        <LightGallery
          mode="lg-fade"
          onInit={onInit}
          speed={500}
          plugins={[lgThumbnail, lgZoom]}
          animateThumb
          closable
          controls
          selector="gallery-list"
        >
          <ul className="gallery-list">
            <li data-src="https://res.cloudinary.com/dpvothk2d/image/upload/v1683556731/cities/nntym97fap8yabj3cbdx.jpg">
              <a href="img/img1.jpg">
                <img
                  alt="img1"
                  src="https://res.cloudinary.com/dpvothk2d/image/upload/v1683556731/cities/nntym97fap8yabj3cbdx.jpg"
                />
              </a>
            </li>
            <li data-src="https://res.cloudinary.com/dpvothk2d/image/upload/v1683556731/cities/nntym97fap8yabj3cbdx.jpg">
              <a href="img/img1.jpg">
                <img
                  alt="img1"
                  src="https://res.cloudinary.com/dpvothk2d/image/upload/v1683556731/cities/nntym97fap8yabj3cbdx.jpg"
                />
              </a>
            </li>
            <li data-src="https://res.cloudinary.com/dpvothk2d/image/upload/v1683556731/cities/nntym97fap8yabj3cbdx.jpg">
              <a href="img/img1.jpg">
                <img
                  alt="img1"
                  src="https://res.cloudinary.com/dpvothk2d/image/upload/v1683556731/cities/nntym97fap8yabj3cbdx.jpg"
                />
              </a>
            </li>
          </ul>
          {/* <figure
            className={styles.figure}
            data-src="https://res.cloudinary.com/dpvothk2d/image/upload/v1683556731/cities/nntym97fap8yabj3cbdx.jpg"
          >
            <Image
              src="https://res.cloudinary.com/dpvothk2d/image/upload/v1683556731/cities/nntym97fap8yabj3cbdx.jpg"
              layout="fill"
            />
          </figure> */}
          {/* <figure
            className={styles.figure}
            data-src="https://res.cloudinary.com/dpvothk2d/image/upload/v1683556731/cities/nntym97fap8yabj3cbdx.jpg"
          >
            <Image
              src="https://res.cloudinary.com/dpvothk2d/image/upload/v1683556731/cities/nntym97fap8yabj3cbdx.jpg"
              layout="fill"
            />
          </figure> */}
          {/* <figure
            className={styles.figure}
            data-src="https://res.cloudinary.com/dpvothk2d/image/upload/v1683556731/cities/nntym97fap8yabj3cbdx.jpg"
          >
            <Image
              src="https://res.cloudinary.com/dpvothk2d/image/upload/v1683556731/cities/nntym97fap8yabj3cbdx.jpg"
              layout="fill"
            />
          </figure> */}
        </LightGallery>
        {/* </section> */}

        {/* <section className={styles.descriptionSection}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores asperiores aperiam
          saepe sequi, culpa obcaecati eum illo, facilis perspiciatis
        </section> */}
      </Modal.Body>
    </Modal>
  );
};

export default PhotoGallery;
