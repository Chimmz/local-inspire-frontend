import React, { useEffect, useState } from 'react';
import useSWR, { Fetcher } from 'swr';
import Link from 'next/link';

import * as urlUtils from '../../../utils/url-utils';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import { NavDropdown } from 'react-bootstrap';
import styles from './Navbar.module.scss';
import useSignedInUser from '../../../hooks/useSignedInUser';
import api from '../../../library/api';
import { getFullName } from '../../../utils/user-utils';
import useDate from '../../../hooks/useDate';

interface Props {
  justifyIconsRight?: boolean;
}

interface Message {
  _id: string;
  from: { _id: string; firstName: string; lastName: string };
  to: string;
  text: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MessagesResponse {
  status: 'SUCCESS' | 'FAIL' | 'ERROR';
  messages: Message[];
  total: number;
}

const msgsFetcher: Fetcher<MessagesResponse, string> = async function (
  this: { token: string; removeMessagesAlert(): void },
  url,
) {
  if (!this.token) return this.removeMessagesAlert();
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${this.token}`,
    },
  });
  return await res.json();
};

const Notifications = (props: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { isSignedIn, accessToken } = useSignedInUser();
  const { formatDate } = useDate(undefined, { month: 'short', day: 'numeric' });

  const { data: msgsData, error } = useSWR(
    api._baseUrl?.concat('/messages/unread'),
    msgsFetcher.bind({ token: accessToken, removeMessagesAlert: setMessages.bind(null, []) }),
    { refreshInterval: 30000 },
  );

  useEffect(() => {
    console.log('useSWR data changed: ', msgsData);
    if (msgsData?.status === 'SUCCESS') setMessages(msgsData.messages);
  }, [msgsData?.total]);

  useEffect(() => {
    if (!isSignedIn) setMessages([]);
  }, [isSignedIn, setMessages]);

  return (
    <div
      className={cls(styles.icons, props.justifyIconsRight && 'flex-grow-1 justify-content-end')}
    >
      <NavDropdown
        className={styles.notifToggler}
        color="white"
        title={<Icon icon="ic:baseline-notifications" color="#fff" width={20} />}
      >
        <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, sequi!...
        </NavDropdown.Item>
        <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, sequi!...
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus, sequi!...
        </NavDropdown.Item>
      </NavDropdown>

      <NavDropdown
        className={styles.notifToggler}
        color="white"
        title={
          <span className={styles.iconBox} data-count={messages.length || 0}>
            <Icon icon="ic:round-message" color="#fff" width={20} />
          </span>
        }
        // align="end"
      >
        {messages.map(msg => (
          <NavDropdown.Item className="fs-5 d-flex align-items-center gap-3" key={msg._id}>
            {getFullName(msg.from, { lastNameInitial: true })} sent a message on{' '}
            {formatDate(msg.createdAt)}{' '}
            <span className="text-black"> {msg.text.slice(0, 20).concat('...')}</span>
          </NavDropdown.Item>
        ))}
      </NavDropdown>
    </div>
  );
};

export default Notifications;
