import { Icon } from '@iconify/react';
import cls from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
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
  return (
    <Modal centered scrollable show={props.show} onHide={props.closeModal}>
      <Modal.Header
        style={{ backgroundColor: '#f3f3f3' }}
        className="px-5 py-4 pb-3"
        closeButton
      >
        <h2>{props.likers && <>{props.reviewerName}&apos;s review</>}</h2>
      </Modal.Header>
      <Modal.Body className="px-5">
        <ul className={styles.reviewLikersList}>
          {props.likers?.map(user => (
            <Liker
              {...user}
              useNativeLinkToProfile={props.useNativeLinkToProfile!}
              key={user._id}
            />
          ))}
        </ul>
      </Modal.Body>
    </Modal>
  );
};

function Liker(liker: UserPublicProfile & { useNativeLinkToProfile: boolean }) {
  const [followers, setFollowers] = useState(liker?.followers || []);
  const { withAuth } = useMiddleware();
  const { send: sendFollowReq, loading } = useRequest();
  const { isSignedIn, ...currentUser } = useSignedInUser();

  const handleFollow = () => {
    withAuth(async (token: string) => {
      const res = await sendFollowReq(api.followUser(liker!._id, token));
      if (res.status === 'SUCCESS') setFollowers(res.user.followers);
    });
  };

  const isFollowingUser = useMemo(
    () => !!currentUser && followers.includes(currentUser._id!),
    [followers, liker],
  );

  const btnFollowIcon = useMemo(
    () => (
      <Icon icon={`material-symbols:person-${!isFollowingUser ? 'add' : 'remove'}`} width={20} />
    ),
    [isFollowingUser],
  );

  return (
    <li className={cls(styles.liker, 'd-flex align-items-center gap-3 py-4')}>
      <figure className="position-relative" style={{ width: '50px', height: '50px' }}>
        <Image
          src={liker.imgUrl}
          layout="fill"
          objectFit="cover"
          style={{ borderRadius: '50%' }}
        />
      </figure>

      <div className="flex-grow-1">
        <h4>
          {liker.useNativeLinkToProfile ? (
            <a href={genUserProfileUrl(liker)} className="">
              <strong>{getFullName(liker, { lastNameInitial: true })}</strong>
            </a>
          ) : (
            <Link href={genUserProfileUrl(liker)} passHref>
              <a className="">
                <strong>{getFullName(liker, { lastNameInitial: true })}</strong>
              </a>
            </Link>
          )}
        </h4>
        <small>
          {quantitize(liker.contributions?.length || 0, ['contribution', 'contributions'])} •{' '}
          {quantitize(liker.followers.length, ['follower', 'followers'])}
        </small>
      </div>

      <LoadingButton
        className="btn btn-outline-pry btn--sm"
        onClick={handleFollow}
        isLoading={loading}
        textWhileLoading={
          <div className="d-flex gap-4 align-items-center">
            {btnFollowIcon}
            <Spinner animation="border" size="sm" style={{ borderWidth: '1px' }} />
          </div>
        }
      >
        {btnFollowIcon}
        {!isFollowingUser ? 'Follow' : 'Unfollow'}
      </LoadingButton>
    </li>
  );
}

export default ReviewLikersModal;
