import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Icon } from '@iconify/react';
import cls from 'classnames';
import Link from 'next/link';
import { UserPublicProfile } from '../../types';
import styles from './styles.module.scss';
import { Modal } from 'react-bootstrap';
import useInput from '../../hooks/useInput';
import { isRequired } from '../../utils/validators/inputValidators';
import TextInput from '../shared/text-input/TextInput';
import useRequest from '../../hooks/useRequest';
import useMiddleware from '../../hooks/useMiddleware';
import useSignedInUser from '../../hooks/useSignedInUser';
import Spinner from '../shared/spinner/Spinner';
import api from '../../library/api';
import LoadingButton from '../shared/button/Button';

interface Props {
  user?: UserPublicProfile;
  totalReviewsMade?: number;
  totalHelfulVotes?: number;
  photosUploadedTotal?: number;
  followingCount?: number;
  profileViews: number | undefined;
  showSpinner(bool: boolean): void;
}

const ProfileStats = (props: Props) => {
  const [showProfileReportModal, setShowReportModal] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<string[] | null>(null);
  const [showReportFeedbackModal, setShowReportFeedbackModal] = useState(false);

  const { send: sendReportReq, loading: reporting } = useRequest();
  const { withAuth } = useMiddleware();
  const { isSignedIn, ...currentUser } = useSignedInUser();
  const { send: sendBlockRequest, loading: blockReqLoading } = useRequest();
  const { send: sendGetBlockedUsersRequest, loading: gettingBlockedUsers } = useRequest();

  const {
    inputValue: reportReason,
    handleChange: handleChangeReport,
    validationErrors: reportValidationErrors,
    runValidators: runReportValidators,
    pushValidationError: pushReportValidationError,
    clearInput: clearReport,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['Report cannot be empty'] }],
  });

  const loadBlockedUsers = useCallback(() => {
    const req = api.getPeopleBlockedByUser(currentUser!.accessToken!);
    sendGetBlockedUsersRequest(req).then(res =>
      res.status === 'SUCCESS'
        ? setBlockedUsers(res.users)
        : pushReportValidationError(res?.msg || "Couldn't submit. Something went wrong"),
    );
  }, [currentUser]);

  useEffect(() => {
    if (isSignedIn) loadBlockedUsers();
  }, [isSignedIn]);

  useEffect(() => {
    if (blockReqLoading || gettingBlockedUsers) props.showSpinner(true);
    else props.showSpinner(false);
  }, [blockReqLoading]);

  const handleReport = useCallback(async () => {
    if (runReportValidators().errorExists) return;
    const body = { reportedId: props.user!._id, reason: reportReason, model: 'UserProfile' };

    sendReportReq(api.report(body, currentUser.accessToken!))
      .then(res => res.status === 'SUCCESS' && setShowReportFeedbackModal(true))
      .finally(setShowReportModal.bind(null, false));
  }, [currentUser]);

  const handleBlockUser = (token: string) => {
    const req = api.toggleBlockUser(props.user!._id, token);
    sendBlockRequest(req).then(
      res => res.status === 'SUCCESS' && setBlockedUsers(res.blockedUsers),
    );
  };

  const userIsBlockable = useMemo(() => {
    return isSignedIn && props.user?._id !== currentUser._id;
  }, [isSignedIn, props.user, currentUser]);

  const userIsBlocked = useMemo(() => {
    return (props.user && isSignedIn && blockedUsers?.includes(props.user._id)) || false;
  }, [props.user, isSignedIn, blockedUsers]);

  return (
    <>
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
            {props.totalHelfulVotes}
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

          {(props.profileViews && props.profileViews >= 0 && (
            <li className="">
              <Link href={''} passHref>
                <a className="w-max-content">
                  <Icon icon="ic:baseline-remove-red-eye" width={20} />
                  Profile Views
                </a>
              </Link>
              {props.profileViews}
            </li>
          )) ||
            null}

          <li>
            <button
              className="btn btn-bg-none no-bg-hover w-max-content"
              onClick={withAuth.bind(null, setShowReportModal.bind(null, true))}
            >
              <Icon icon="heroicons:flag-solid" width={18} />
              Report profile
            </button>
          </li>

          <li className={cls(!userIsBlockable ? 'd-none' : '')}>
            <LoadingButton
              isLoading={blockReqLoading}
              className="btn btn-bg-none no-bg-hover w-max-content"
              onClick={withAuth.bind(null, handleBlockUser)}
              withSpinner
              textWhileLoading={userIsBlocked ? 'Unblocking...' : 'Blocking...'}
            >
              <Icon icon="ic:baseline-block" width={20} color="red" />
              {userIsBlocked ? 'Unblock' : 'Block'} {props.user?.firstName}
            </LoadingButton>
          </li>
        </ul>
      </aside>

      <Modal
        show={showReportFeedbackModal}
        style={{ marginTop: '2rem' }}
        onHide={setShowReportFeedbackModal.bind(null, false)}
      >
        <Modal.Header className="u-border-none p-5" closeButton>
          <div className="d-flex align-items-center gap-3">
            <Icon icon="mdi:success" width={25} color="#00ae00" />
            <h3 className="mt-2">Your report has been submitted!</h3>
          </div>
        </Modal.Header>
      </Modal>

      <Modal
        show={showProfileReportModal}
        centered
        onEntering={clearReport}
        onHide={() => setShowReportModal(false)}
      >
        <Modal.Body className="px-5">
          <Modal.Header className="pt-4 u-border-none mb-5" closeButton>
            <div className="d-flex align-items-center gap-3">
              <Icon icon="heroicons:flag-solid" width={22} />
              <h2 className="">Report a problem</h2>
            </div>
          </Modal.Header>
          <TextInput
            as="textarea"
            value={reportReason}
            onChange={handleChangeReport}
            validationErrors={reportValidationErrors}
            label={
              <>
                <span className="text-black mb-3 d-block">
                  Please let us know what's inappropriate about this profile.
                </span>
                <small className="text-light">
                  (e.g. headline, about me, profile photo, spammer, etc.)
                </small>
              </>
            }
          />
          <div className="d-flex justify-content-center gap-2 mt-4 mb-3">
            <LoadingButton
              isLoading={reporting}
              className="btn btn-pry"
              onClick={handleReport}
              disabled={!!reportValidationErrors.length || reporting}
              textWhileLoading="Reporting..."
            >
              Report profile
            </LoadingButton>
            <button className="btn btn-outline" onClick={setShowReportModal.bind(null, false)}>
              Cancel
            </button>
          </div>
          <small className="text-light text-center d-block">
            We will examine this report as quickly as possible..
          </small>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProfileStats;
