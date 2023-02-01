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

interface Props {
  heading?: ReactNode;
  pageUrl: string | (() => string);
  className?: string;
}

const ShareStrategies = function (props: Props) {
  const [pageUrl, setPageUrl] = useState(() => {
    return (
      window.location.origin +
      (typeof props.pageUrl === 'string' ? props.pageUrl : props.pageUrl())
    );
  });
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setPageUrl(relativeUrl => window.location.origin.concat(relativeUrl));
  //   setMounted(true);
  // }, []);

  const [userCopiedUrl, setUserCopiedUrl] = useState(false);

  // if (!mounted)
  //   return (
  //     <div className={props.className}>
  //       <Spinner animation="border" style={{ borderWidth: '3px' }} />
  //     </div>
  //   );
  return (
    <div className={props.className}>
      <FacebookShareButton url={pageUrl} className="">
        <button
          className="btn btn-pry btn--lg w-100 mb-3"
          style={{ backgroundColor: '#3b5998' }}
        >
          Share on Facebook
        </button>
      </FacebookShareButton>

      <TwitterShareButton url={pageUrl} className="">
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
          selectOnFocus
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
