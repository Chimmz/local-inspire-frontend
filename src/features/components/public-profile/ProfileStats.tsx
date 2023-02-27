import React, { useMemo } from 'react';
import { Icon } from '@iconify/react';
import cls from 'classnames';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { SSRProvider } from 'react-bootstrap';
import { UserPublicProfile } from '../../types';
import { ReviewProps } from '../page-reviews/UserReview';
import styles from './styles.module.scss';

interface Props {
  user?: UserPublicProfile;
  totalReviewsMade?: number;
  photosUploadedTotal?: number;
  followingCount?: number;
}

const ProfileStats = (props: Props) => {
  return (
    <aside className={styles.profileStats}>
      <h3 className="mb-5"> {props.user?.firstName}&apos;s Profile</h3>
      <ul className="no-bullets">
        <li className="">
          <Link href={''} passHref>
            <a className="w-max-content">
              <Icon icon="ic:round-star" width={23} /> Reviews
            </a>
          </Link>
          {props.totalReviewsMade}
        </li>
        <li className="">
          <Link href={''} passHref>
            <a className="w-max-content">
              <Icon icon="ic:round-insert-photo" width={19} /> Business Photos
            </a>
          </Link>
          {props.photosUploadedTotal}
        </li>

        <li className="">
          <Link href={''} passHref>
            <a className="w-max-content">
              <Icon icon="material-symbols:format-list-bulleted-rounded" width={22} /> Lists
            </a>
          </Link>
          {props.user?.collections.length}
        </li>

        <li className="">
          <Link href={''} passHref>
            <a className="w-max-content">
              <Icon icon="ant-design:like-filled" width={19} />
              Helpful votes
            </a>
          </Link>
          31
        </li>

        <li className="">
          <Link href={''} passHref>
            <a className="w-max-content">
              <Icon icon="mdi:people-group" width={20} />
              Followers
            </a>
          </Link>
          {props.user?.followers.length}
        </li>

        <li className="">
          <Link href={''} passHref>
            <a className="w-max-content">
              <Icon icon="ri:walk-fill" width={20} />
              Following
            </a>
          </Link>
          {props.followingCount}
        </li>

        <li className="">
          <Link href={''} passHref>
            <a className="w-max-content">
              <Icon icon="ic:baseline-remove-red-eye" width={20} />
              Profile Views
            </a>
          </Link>
          31
        </li>
      </ul>
    </aside>
  );
};

export default ProfileStats;
