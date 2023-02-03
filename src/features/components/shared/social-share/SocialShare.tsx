import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';

import cls from 'classnames';

import { Icon } from '@iconify/react';
import { Modal } from 'react-bootstrap';
import { InputGroup, SSRProvider } from 'react-bootstrap';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import CopyToClipboard from 'react-copy-to-clipboard';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import TextInput from '../text-input/TextInput';
import styles from './SocialShare.module.scss';
import ShareStrategies from './ShareStrategies';

interface Props {
  show: boolean;
  url: string | (() => string);
  heading?: ReactNode;
  close(): void;
}

const SocialShareModal: React.FunctionComponent<Props> = function (props) {
  const { heading = 'Share' } = props;
  return (
    <Modal show={props.show} centered onHide={props.close}>
      <Modal.Header className="px-5 pt-4" closeButton>
        <h2>{heading}</h2>
      </Modal.Header>

      <Modal.Body className="p-5">
        <ShareStrategies className={styles.bodyLayout} pageUrl={props.url} />
      </Modal.Body>
    </Modal>
  );
};

export default SocialShareModal;
