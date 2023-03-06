import { Icon } from '@iconify/react';
import cls from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo, useEffect } from 'react';
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
import { ReviewProps } from '../../page-reviews/UserReview';
import LoadingButton from '../../shared/button/Button';
import styles from './ReviewsSection.module.scss';

interface Props {
  show: boolean;
  closeModal: () => void;
  reviewId: string | undefined;
  useNativeLinkToProfile?: boolean;
}

type Liker = Pick<
  UserPublicProfile,
  '_id' | 'firstName' | 'lastName' | 'followers' | 'contributions' | 'imgUrl'
>;

const ReviewLikersModal = (props: Props) => {
  const [likes, setLikes] = useState<Liker[] | undefined>();

  const [reviewer, setReviewer] = useState<
    Pick<UserPublicProfile, 'firstName' | 'lastName' | '_id'> | undefined
  >();
  const { send: sendLikesReq, loading: gettingLikes } = useRequest();

  const loadLikes = async () => {
    if (!props.reviewId) return;
    const req = api.getReviewLikes(props.reviewId);

    sendLikesReq(req).then(res => {
      if (res.status !== 'SUCCESS') return;
      setLikes(res.likes);
      setReviewer(res.reviewedBy);
    });
  };

  return (
    <Modal
      centered
      scrollable
      show={props.show}
      onEntering={loadLikes}
      onHide={props.closeModal}
    >
      <Modal.Header
        style={{ backgroundColor: '#f3f3f3' }}
        className="px-5 py-4 pb-3"
        closeButton
      >
        <h2>{<>{reviewer?.firstName}&apos;s review</>}</h2>
      </Modal.Header>
      <Modal.Body className="px-5">
        <ul className={styles.reviewLikersList}>
          <div className={cls('justify-content-center', gettingLikes ? 'd-flex' : 'd-none')}>
            <Spinner className="mx-auto" animation="border" style={{ borderWidth: '1px' }} />
          </div>
          {likes?.map(user => (
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

function Liker(props: Liker & { useNativeLinkToProfile: boolean }) {
  const [followers, setFollowers] = useState(props?.followers || []);
  const { withAuth } = useMiddleware();
  const { send: sendFollowReq, loading } = useRequest();
  const { isSignedIn, ...currentUser } = useSignedInUser();

  const handleFollow = () => {
    withAuth(async (token: string) => {
      const res = await sendFollowReq(api.followUser(props._id!, token));
      if (res.status === 'SUCCESS') setFollowers(res.user.followers);
    });
  };

  const isFollowingUser = useMemo(
    () => !!currentUser && followers.includes(currentUser._id!),
    [followers, props],
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
          src={props.imgUrl!}
          layout="fill"
          objectFit="cover"
          style={{ borderRadius: '50%' }}
        />
      </figure>

      <div className="flex-grow-1">
        <h4>
          {props.useNativeLinkToProfile ? (
            <a href={genUserProfileUrl(props)} className="">
              <strong>{getFullName(props, { lastNameInitial: true })}</strong>
            </a>
          ) : (
            <Link href={genUserProfileUrl(props)} passHref>
              <a className="">
                <strong>{getFullName(props, { lastNameInitial: true })}</strong>
              </a>
            </Link>
          )}
        </h4>
        <small>
          {quantitize(props.contributions?.length || 0, ['contribution', 'contributions'])} •{' '}
          {quantitize(props.followers.length, ['follower', 'followers'])}
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
