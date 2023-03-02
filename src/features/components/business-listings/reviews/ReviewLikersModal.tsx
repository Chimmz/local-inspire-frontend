import { Icon } from '@iconify/react';
import cls from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import useMiddleware, { MiddlewareNext } from '../../../hooks/useMiddleware';
import useRequest from '../../../hooks/useRequest';
import useSignedInUser from '../../../hooks/useSignedInUser';
import api from '../../../library/api';
import { UserPublicProfile } from '../../../types';
import { quantitize } from '../../../utils/quantity-utils';
import { genUserProfileUrl } from '../../../utils/url-utils';
import { getFullName } from '../../../utils/user-utils';
import LoadingButton from '../../shared/button/Button';
import styles from './ReviewsSection.module.scss';

interface Props {
  show: boolean;
  likers: UserPublicProfile[] | undefined;
  reviewerName: string | undefined | null;
  closeModal: () => void;
  useNativeLinkToProfile?: boolean;
}

const ReviewLikersModal = (props: Props) => {
  const { isSignedIn, _id: currentUserId } = useSignedInUser();

  return (
    <Modal centered scrollable show={props.show} onHide={props.closeModal}>
      <Modal.Header
        style={{ backgroundColor: '#f3f3f3' }}
        className="px-5 py-4 pb-3"
        closeButton
      >
        <h2>
          {props.likers && (
            <>
              <Link href="/">{props.reviewerName}</Link>&apos;s review
            </>
          )}
        </h2>
      </Modal.Header>
      <Modal.Body className="px-5">
        <ul className={styles.reviewLikersList}>
          {props.likers?.map(user => {
            const following = isSignedIn ? user.followers.includes(currentUserId!) : false;
            const icon = (
              <Icon
                icon={`material-symbols:person-${!following ? 'add' : 'remove'}`}
                width={20}
              />
            );
            return (
              <li
                className={cls(styles.liker, 'd-flex align-items-center gap-3 py-4')}
                key={user._id || Math.random() + Math.random()}
              >
                <figure
                  className="position-relative"
                  style={{ width: '50px', height: '50px' }}
                >
                  <Image
                    src={user.imgUrl}
                    layout="fill"
                    objectFit="cover"
                    style={{ borderRadius: '50%' }}
                  />
                </figure>

                <div className="flex-grow-1">
                  <h4>
                    <strong>{getFullName(user, { lastNameInitial: true })}</strong>
                  </h4>
                  <small>
                    {quantitize(user.contributions?.length || 0, [
                      'contribution',
                      'contributions',
                    ])}{' '}
                    • {quantitize(user.followers.length, ['follower', 'followers'])}
                  </small>
                </div>

                {props.useNativeLinkToProfile ? (
                  <a href={genUserProfileUrl(user)} className="btn btn-outline-pry btn--sm">
                    {icon} {!following ? 'Follow' : 'Unfollow'}
                  </a>
                ) : (
                  <Link href={genUserProfileUrl(user)} passHref>
                    <a className="btn btn-outline-pry btn--sm">
                      {icon} {!following ? 'Follow' : 'Unfollow'}
                    </a>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default ReviewLikersModal;
