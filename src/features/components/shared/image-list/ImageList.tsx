import React, { useMemo } from 'react';
import Image, { ImageProps } from 'next/image';
import cls from 'classnames';
import styles from './ImageList.module.scss';

interface Props {
  images: { _id: string; src: string }[];
  imageProps?: Omit<ImageProps, 'src'>;
  limit: number;
  pictureClassName?: string;
}

const ImageList = (props: Props) => {
  const undisplayedPhotosCount = useMemo(() => {
    return props.limit > props.images.length ? 0 : props.images.length - props.limit;
  }, [props.images, props.limit]);

  const imgsToDisplay = useMemo(
    () => props.images.slice(0, props.limit),
    [props.images, props.limit],
  );

  if (!Array.isArray(props.images)) return null;
  return (
    <>
      {imgsToDisplay.map((img, i) => {
        const isFirstImage = i === 0;
        const isLastImage = i === imgsToDisplay.length - 1;

        let pictureClassName = cls(
          'position-relative d-block',
          props.pictureClassName,
          styles.lastPicture,
        );

        if (isFirstImage) pictureClassName = pictureClassName.concat('m-0');

        const imgUI = (
          <Image src={img.src} {...props.imageProps} style={{ borderRadius: '3px' }} />
        );

        if (!isLastImage) {
          if (props.imageProps?.layout !== 'fill') return imgUI;
          return (
            <figure key={img._id} className={pictureClassName}>
              {imgUI}
            </figure>
          );
        }

        if (props.imageProps?.layout !== 'fill') return imgUI;
        return (
          <figure
            className={pictureClassName}
            data-remaining-count={
              '+' + (undisplayedPhotosCount > 0 ? undisplayedPhotosCount : 0)
            }
            key={img._id}
          >
            {imgUI}
          </figure>
        );
      })}
    </>
  );
};

export default ImageList;
