import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import cls from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import styles from './styles.module.scss';
import { UserPublicProfile } from '../../types';
import useSignedInUser from '../../hooks/useSignedInUser';
import useRequest from '../../hooks/useRequest';
import api from '../../library/api';
import useMiddleware, { MiddlewareNext } from '../../hooks/useMiddleware';
import { getFullName } from '../../utils/user-utils';
import LoadingButton from '../shared/button/Button';
import { Spinner } from 'react-bootstrap';
import NewMessageModal from './NewMessageModal';

interface Props {
  user: UserPublicProfile | undefined;
  followingCount?: number;
}

function ProfileHeader({ user, followingCount }: Props) {
  const [followerIds, setFollowerIds] = useState(user?.followers || []);
  const [showMsgModal, setShowMsgModal] = useState(false);

  const { isSignedIn, _id: currentUserId } = useSignedInUser();
  const { send: sendFollowReq, loading } = useRequest({ autoStopLoading: true });
  const { withAuth } = useMiddleware();

  const handleToggleFollow = () => {
    withAuth(async (token: string) => {
      const res = await sendFollowReq(api.followUser(user!._id, token));
      if (res.status === 'SUCCESS') setFollowerIds(res.user.followers);
    });
  };

  const isFollowedByMe = useMemo(() => {
    return isSignedIn ? followerIds.includes(currentUserId!) : false;
  }, [followerIds, isSignedIn, currentUserId]);

  const userName = useMemo(() => getFullName(user, { full: true }), [user]);

  const btnFollowIcon: React.ReactNode = useMemo(
    () => (
      <Icon
        icon={`material-symbols:person-${!isFollowedByMe ? 'add' : 'remove'}`}
        width={20}
      />
    ),
    [isFollowedByMe],
  );

  return (
    <>
      <header className={cls(styles.header, 'container d-flex align-items-center gap-4')}>
        <Image
          src={user?.imgUrl || '/img/default-profile-pic.jpeg'}
          width={130}
          height={130}
          objectFit="cover"
          style={{ borderRadius: '50%' }}
        />
        <div className="flex-grow-1">
          <h1>{userName}</h1>
          <p className="parag mb-5">"Do unto others as you would have them do unto you."</p>
          <ul className="d-flex gap-5 align-items-start no-bullets">
            <li>
              <span className="text-uppercase text-light fs-5">Contributions</span>
              <br />{' '}
              <span className="fs-3">
                {' '}
                {user?.contributions.length.toString().padStart(2, '0')}
              </span>
            </li>
            <li>
              <span className="text-uppercase text-light fs-5">Following</span>
              <br />{' '}
              <span className="fs-3"> {followingCount?.toString().padStart(2, '0')}</span>
            </li>
            <li>
              <span className="text-uppercase text-light fs-5">Followers</span>
              <br />{' '}
              <span className="fs-3">{followerIds.length.toString().padStart(2, '0')}</span>
            </li>
          </ul>
        </div>
        <div className="d-flex align-self-start gap-3">
          <LoadingButton
            className="btn btn-pry btn--sm"
            onClick={handleToggleFollow}
            isLoading={loading}
            textWhileLoading={
              <div className="d-flex gap-4 align-items-center">
                {btnFollowIcon}
                <Spinner animation="border" size="sm" style={{ borderWidth: '1px' }} />
              </div>
            }
          >
            {btnFollowIcon}
            {!isFollowedByMe ? 'Follow' : 'Unfollow'}
          </LoadingButton>

          <button
            className="btn btn-outline gap-3"
            onClick={withAuth.bind(null, setShowMsgModal.bind(null, true))}
          >
            <Icon icon="ooui:message" width={14} />
            Message
          </button>
        </div>
      </header>

      <NewMessageModal
        show={showMsgModal}
        recipient={user!}
        close={setShowMsgModal.bind(null, false)}
      />
    </>
  );
}

export default ProfileHeader;
