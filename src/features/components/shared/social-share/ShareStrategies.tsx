import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';

import cls from 'classnames';

import { Icon } from '@iconify/react';
import { Modal, Spinner } from 'react-bootstrap';
import { InputGroup, SSRProvider } from 'react-bootstrap';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import CopyToClipboard from 'react-copy-to-clipboard';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import TextInput from '../text-input/TextInput';
import styles from './SocialShare.module.scss';

export interface ShareStrategiesProps {
  heading?: ReactNode;
  className?: string;
  title: string;
  pageUrl: string | (() => string);
  imgUrl?: string;
  layout?: 'grid' | 'column';
}

const ShareStrategies = function (props: ShareStrategiesProps) {
  const [pageUrl, setPageUrl] = useState(() => {
    return (
      window.location.origin +
      (typeof props.pageUrl === 'string' ? props.pageUrl : props.pageUrl())
    );
  });
  const [userCopiedUrl, setUserCopiedUrl] = useState(false);

  const layouts = useMemo(
    () => ({
      grid: styles.gridLayout,
    }),
    [],
  );

  return (
    <div className={props.className || (props.layout === 'grid' ? layouts.grid : '')}>
      <FacebookShareButton url={pageUrl} quote={props.title}>
        <button
          className="btn btn-pry btn--lg w-100 mb-3 flex-grow-1"
          style={{ backgroundColor: '#3b5998' }}
        >
          Share on Facebook
        </button>
      </FacebookShareButton>

      <TwitterShareButton url={pageUrl} title={props.title}>
        <button
          className="btn btn-pry btn--lg w-100 color-white mb-3"
          style={{ backgroundColor: '#1da1f2' }}
        >
          Share on Twitter
        </button>
      </TwitterShareButton>

      <InputGroup className="mb-5">
        <TextInput
          value={pageUrl}
          className="textfield flex-grow-1"
          style={{ flexBasis: '80%' }}
          readonly
          onFocusSelect
        />
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="tooltip-copy-url">{!userCopiedUrl ? 'Copy URL' : 'Copied!'}</Tooltip>
          }
        >
          <CopyToClipboard text={pageUrl} onCopy={setUserCopiedUrl.bind(null, true)}>
            <button
              className="btn btn-outline"
              onMouseLeave={setTimeout.bind(null, setUserCopiedUrl.bind(null, false), 100)}
            >
              <Icon icon="material-symbols:content-copy" width={16} />
            </button>
          </CopyToClipboard>
        </OverlayTrigger>

        <small className="d-block">Want to link to it instead? Copy the above URL!</small>
      </InputGroup>
    </div>
  );
};

export default ShareStrategies;
