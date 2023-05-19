import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import { InputGroup } from 'react-bootstrap';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
// @ts-ignore
import { FacebookButton } from 'react-social';
import CopyToClipboard from 'react-copy-to-clipboard';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Icon } from '@iconify/react';
import Tooltip from 'react-bootstrap/Tooltip';
import TextInput from '../text-input/TextInput';

import cls from 'classnames';
import styles from './SocialShare.module.scss';

export interface ShareStrategiesProps {
  heading?: ReactNode;
  className?: string;
  title: string;
  pageUrl: string | (() => string);
  imgUrl?: string;
  layout?: 'grid' | 'column';
  urlCopyOption?: boolean;
}

const ShareStrategies = function (props: ShareStrategiesProps) {
  const { urlCopyOption = true } = props;

  const [pageUrl, setPageUrl] = useState(
    typeof props.pageUrl === 'string' ? props.pageUrl : props.pageUrl(),
  );
  const [userCopiedUrl, setUserCopiedUrl] = useState(false);

  const layouts = useMemo(() => ({ grid: styles.gridLayout, column: styles.columnLayout }), []);

  useEffect(() => {
    setPageUrl(window.location.origin + pageUrl);
  }, [setPageUrl]);

  return (
    <div className={cls(props.className, props.layout && layouts[props.layout])}>
      <FacebookButton
        url={pageUrl}
        title={props.title}
        media={props.imgUrl}
        className="btn btn-pry btn--lg w-100 mb-3 flex-grow-1"
        element="button"
        appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
      >
        Share on Facebook
      </FacebookButton>
      {/* <FacebookShareButton url={pageUrl} quote={props.title}>
        <button
          className="btn btn-pry btn--lg w-100 mb-3 flex-grow-1"
          style={{ backgroundColor: '#3b5998' }}
        >
          Share on Facebook
        </button>
      </FacebookShareButton> */}

      {/* <Link
        href={`https://www.facebook.com/sharer.php?u=${pageUrl}&imageurl=${props.imgUrl}}`}
        passHref
      >
        <a
          target="_blank"
          className="btn btn-pry btn--lg w-100 mb-3 flex-grow-1"
          rel="noopener noreferrer"
        >
          Share on Facebook
        </a>
      </Link>

      <Link
        href={`https://twitter.com/intent/tweet?text=${props.title}&url=${pageUrl}?imageurl=${props.imgUrl}`}
        passHref
      >
        <a
          target="_blank"
          className="btn btn-pry btn--lg w-100 color-white mb-3"
          style={{ backgroundColor: '#1da1f2' }}
        >
          Share on Twitter
        </a>
      </Link> */}

      <TwitterShareButton url={pageUrl} title={props.title}>
        <button
          className="btn btn-pry btn--lg w-100 color-white mb-3"
          style={{ backgroundColor: '#1da1f2' }}
        >
          Share on Twitter
        </button>
      </TwitterShareButton>

      <InputGroup className={cls('mb-5', !urlCopyOption && 'd-none')}>
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
