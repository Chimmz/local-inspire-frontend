import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Icon } from '@iconify/react';
import TextInput from '../shared/text-input/TextInput';
import { Form } from 'react-bootstrap';
import cls from 'classnames';
import styles from './Announcement.module.scss';

function Announcement() {
  return (
    <section className={styles.announcement}>
      <div className={styles.announcementHeader}>
        <Image
          src={'/img/los-angeles-photo.jpg'}
          width={50}
          height={50}
          style={{ borderRadius: '50%' }}
        />
        <div className={cls(styles.title, 'd-flex align-items-start gap-2')}>
          <Icon icon="mdi:loudspeaker" width={25} />
          <h5 className="fs-4 mt-1">Announcement from the owner of</h5>
        </div>
        <button className="btn btn-pry">Start Now!</button>
        <Link href={'/'} className="link">
          <a className="fs-4"> Fannies BBQ</a>
        </Link>
      </div>
      <div className={styles.announcementBody}>
        <strong className="fs-4 mb-2 d-block">
          <Link href={'/'}>Give them a reason to visit and keep coming back</Link>
        </strong>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae explicabo numquam
          provident iste perferendis deleniti animi! Accusamus quasi veniam laboriosam!
        </p>
        <small>Starts: Wednesday, Nov 30, 2022 - Ends: Saturday, Feb 25, 2023</small>
      </div>
    </section>
  );
}

export default Announcement;
