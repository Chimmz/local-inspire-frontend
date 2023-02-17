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
import { simulateRequest } from '../../../utils/async-utils';
import { quantitize } from '../../../utils/quantity-utils';
import { getFullName } from '../../../utils/user-utils';
import LoadingButton from '../../shared/button/Button';
import styles from './ReviewsSection.module.scss';

interface Props {
  show: boolean;
  likers: UserPublicProfile[] | undefined;
  reviewerName: string | undefined | null;
  closeModal: () => void;
}

const ReviewLikersModal = (props: Props) => {
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
          {props.likers?.map(user => (
            <Liker user={user} />
          ))}
        </ul>
      </Modal.Body>
    </Modal>
  );
};

function Liker({ user }: { user: UserPublicProfile }) {
  const [isFollowedByMe, setIsFollowedByMe] = useState(() => {
    return isSignedIn ? user.followers.includes(myId!) : false;
  });
  const { isSignedIn, _id: myId } = useSignedInUser();
  const { send: sendFollowReq, loading } = useRequest({ autoStopLoading: true });
  const { withAuth } = useMiddleware();

  // const isFollowedByMe = useMemo(() => {
  //   return isSignedIn ? user.followers.includes(myId!) : false
  // }, [isSignedIn, myId, user.followers])
  // : MiddlewareNext
  const handleToggleFollow = async (token: string) => {
    // await simulateRequest(5, sendFollowReq);
    const res = await sendFollowReq(api.followUser(user._id, token));
    if (res.status === 'SUCCESS') setIsFollowedByMe(res.following);
  };

  const icon = useMemo(
    () => (
      <Icon
        icon={`material-symbols:person-${!isFollowedByMe ? 'add' : 'remove'}`}
        width={20}
      />
    ),
    [isFollowedByMe],
  );

  return (
    <li
      className={cls(styles.liker, 'd-flex align-items-center gap-3 py-4')}
      key={user._id || Math.random() + Math.random()}
    >
      <figure className="position-relative" style={{ width: '50px', height: '50px' }}>
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
          {quantitize(user.contributions?.length || 0, ['contribution', 'contributions'])} • 0
          Followers
        </small>
      </div>
      <LoadingButton
        className="btn btn-outline-pry btn--sm"
        onClick={() => withAuth(handleToggleFollow)}
        isLoading={loading}
        textWhileLoading={
          <div className="d-flex gap-4 align-items-center">
            {icon}
            <Spinner animation="border" size="sm" style={{ borderWidth: '1px' }} />
          </div>
        }
      >
        {icon}
        {!isFollowedByMe ? 'Follow' : 'Unfollow'}
      </LoadingButton>
    </li>
  );
}

export default ReviewLikersModal;
