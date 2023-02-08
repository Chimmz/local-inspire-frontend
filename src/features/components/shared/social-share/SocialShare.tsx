import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import cls from 'classnames';

import { Icon } from '@iconify/react';
import { Modal } from 'react-bootstrap';
import styles from './SocialShare.module.scss';
import ShareStrategies, { ShareStrategiesProps } from './ShareStrategies';

type Props = {
  show: boolean;
  heading?: ReactNode;
  close(): void;
} & Pick<ShareStrategiesProps, 'title' | 'pageUrl' | 'imgUrl'>;

const SocialShareModal: React.FunctionComponent<Props> = function (props) {
  const { heading = 'Share' } = props;
  return (
    <Modal show={props.show} centered onHide={props.close}>
      <Modal.Header className="px-5 pt-4" closeButton>
        <h2>{heading}</h2>
      </Modal.Header>

      <Modal.Body className="p-5">
        <ShareStrategies
          className={styles.bodyLayout}
          pageUrl={props.pageUrl}
          imgUrl={props.imgUrl}
          title={props.title}
        />
      </Modal.Body>
    </Modal>
  );
};

export default SocialShareModal;
