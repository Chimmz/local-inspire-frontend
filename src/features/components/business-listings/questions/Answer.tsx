import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { UserPublicProfile } from '../../../types';

import useSignedInUser from '../../../hooks/useSignedInUser';
import useRequest from '../../../hooks/useRequest';
import useClientMiddleware from '../../../hooks/useClientMiddleware';

import api from '../../../library/api';
import { getFullName } from '../../../utils/user-utils';

import cls from 'classnames';
import { Icon } from '@iconify/react';
import styles from './QuestionsSection.module.scss';

export interface AnswerProps {
  readonly _id: string;
  readonly answeredBy: UserPublicProfile;
  readonly createdAt: string;
  readonly answerText: string;
  readonly answeredDate: string;
  readonly likes: string[];
  readonly dislikes: string[];
  readonly mostHelpful: boolean;
}

type Props = AnswerProps & {
  questionId: string;
};

const Answer: React.FC<Props> = function (props) {
  const { _id: currentUserId, accessToken } = useSignedInUser();
  const { send: sendReactionReq, loading: isReacting } = useRequest({
    autoStopLoading: true,
  });
  const [reactions, setReactions] = useState({
    likes: props.likes,
    dislikes: props.dislikes,
  });
  const { withAuth } = useClientMiddleware();
  const [imgSrc, setImgSrc] = useState(
    props.answeredBy.imgUrl || '/img/default-profile-pic.jpeg',
  );

  // const allowReaction = currentUserId !== props.answeredBy._id;
  const allowReaction = true;
  const userLikes = reactions.likes.includes(currentUserId!);
  const userDislikes = reactions.dislikes.includes(currentUserId!);

  const reactToAnswer = async (reaction: 'like' | 'dislike', token: string) => {
    const handler =
      reaction === 'like'
        ? api.toggleLikeAnswerToBusinessQuestion
        : api.toggleDislikeAnswerToBusinessQuestion;

    const data = await sendReactionReq(
      handler.bind(api)(props.questionId, props._id, token!),
    );
    console.log({ data });

    data?.status === 'SUCCESS' && setReactions(data as typeof reactions);
  };

  return (
    <div className={styles.answer}>
      <div className={styles.answerHeader}>
        <Image
          src={imgSrc}
          width={30}
          height={30}
          objectFit="cover"
          style={{ borderRadius: '50%' }}
          onError={setImgSrc.bind(null, '/img/default-profile-pic.jpeg')}
        />
        <small className={cls(styles.authorAndDate, 'd-block')}>
          <small>
            Answer from
            <span className="text-black">
              {' '}
              {getFullName(props.answeredBy, { lastNameInitial: true })}
            </span>{' '}
            on Jan 07, 2020
          </small>
        </small>

        <small
          className={cls(styles.responderInfo, 'd-flex gap-4 align-items-center flex-wrap')}
        >
          {props.answeredBy.role === 'BUSINESS_OWNER' ? (
            <>
              <small>Business Representative</small>•
            </>
          ) : null}

          <small>
            {props.likes.length}{' '}
            {props.likes.length < 1
              ? 'persons'
              : props.likes.length === 1
              ? 'person'
              : 'people'}{' '}
            found this helpful
          </small>

          {props.mostHelpful ? (
            <span className="d-flex align-items-center gap-2">
              <Icon icon="ant-design:like-filled" width={15} />
              <small className="t-2 d-block"> Most helpful answer</small>
            </span>
          ) : null}
        </small>
      </div>

      <small className="parag mb-4 d-block ">{props.answerText}</small>

      <div
        className={`d-${
          allowReaction ? 'flex' : 'none'
        } align-items-center justify-content-start gap-4`}
      >
        <button
          className="btn btn-bg-none no-bg-hover"
          disabled={isReacting}
          onClick={withAuth.bind(null, (token: string) => reactToAnswer('like', token))}
        >
          {/* <Icon icon={`mdi:like${userLikes ? '' : '-outline'}`} width={20} color="gray" />{' '} */}
          <Icon icon={`ant-design:like-${userLikes ? 'filled' : 'outlined'}`} width={20} />
          Helpful ({reactions.likes.length})
        </button>

        <button
          className="btn btn-bg-none no-bg-hover gap-2"
          style={{ alignItems: 'flex-start' }}
          disabled={isReacting}
          onClick={withAuth.bind(null, (token: string) => reactToAnswer('dislike', token))}
        >
          <Icon
            icon={`ant-design:dislike-${userDislikes ? 'filled' : 'outlined'}`}
            width={20}
          />
          {/* <Icon
            icon={`mdi:dislike${userDislikes ? '' : '-outline'}`}
            width={20}
            color="gray"
          /> */}
          Not helpful ({reactions.dislikes.length})
        </button>
      </div>
    </div>
  );
};

export default Answer;
