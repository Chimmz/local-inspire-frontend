import React, { useMemo } from 'react';
import { Icon } from '@iconify/react';
import cls from 'classnames';
import { UserPublicProfile } from '../../types';
import useDate from '../../hooks/useDate';
import styles from './styles.module.scss';

interface Props {
  user: UserPublicProfile | undefined;
}

const ProfileAbout = (props: Props) => {
  const { date: joinedDate } = useDate(props.user?.createdAt, {
    month: 'short',
    day: '2-digit',
  });

  return (
    <section className={styles.about}>
      <h3 className="mb-4">About</h3>
      <ul className="no-bullets mb-5">
        <li className="d-flex align-items-center gap-3 mb-4">
          <Icon icon="ic:baseline-location-on" width={18} />
          {props.user?.city}
        </li>
        <li className="d-flex align-items-center gap-3 mb-3">
          <Icon icon="fa-solid:calendar-alt" /> Joined {joinedDate}
        </li>
      </ul>
      <article className="mb-4">
        <span className="text-black">My Hometown</span>
        <br />
        <span>{props.user?.city}</span>
      </article>

      <article>
        <span className="text-black">About Me</span>
        <br />
        <span>"I am a wild one running free."</span>
      </article>

      <hr className="my-4" style={{ borderColor: '#ccc' }} />

      <span className="text-black">Social Profiles</span>
    </section>
  );
};

export default ProfileAbout;
