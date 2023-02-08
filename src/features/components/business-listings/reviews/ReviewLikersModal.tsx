import { Icon } from '@iconify/react';
import cls from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { UserPublicProfile } from '../../../types';
import { quantitize } from '../../../utils/quantity-utils';
import { getFullName } from '../../../utils/user-utils';
import styles from './ReviewsSection.module.scss';

interface Props {
  show: boolean;
  likers: UserPublicProfile[] | undefined;
  reviewerName: string | undefined | null;
  closeModal: () => void;
}

const ReviewLikersModal = function (props: Props) {
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
                  {quantitize(user.contributions?.length || 0, [
                    'contribution',
                    'contributions',
                  ])}{' '}
                  • 0 Followers
                </small>
              </div>
              <button className="btn btn-outline-pry btn--sm">
                <Icon icon="material-symbols:person-add" width={20} /> Follow
              </button>
            </li>
          ))}
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default ReviewLikersModal;
