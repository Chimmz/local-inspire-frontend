import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserPublicProfile } from '../../../types';

import useSignedInUser from '../../../hooks/useSignedInUser';
import useRequest from '../../../hooks/useRequest';

import api from '../../../library/api';
import { getFullName } from '../../../utils/user-utils';

import cls from 'classnames';
import { Icon } from '@iconify/react';
import styles from './QuestionsSection.module.scss';
import { simulateRequest } from '../../../utils/async-utils';

export interface AnswerProps {
  readonly _id: string;
  answerText: string;
  readonly answeredBy: UserPublicProfile;
  answeredDate: string;
  likes: string[];
  dislikes: string[];
  readonly createdAt: string;
  mostHelpful: boolean;
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

  // const allowReaction = currentUserId !== props.answeredBy._id;
  const allowReaction = true;

  const userLikes = reactions.likes.includes(currentUserId!);
  const userDislikes = reactions.dislikes.includes(currentUserId!);

  const reactToAnswer = async (reaction: 'like' | 'dislike') => {
    const handler =
      reaction === 'like'
        ? api.toggleLikeAnswerToBusinessQuestion
        : api.toggleDislikeAnswerToBusinessQuestion;

    const data = await sendReactionReq(
      handler.bind(api)(props.questionId, props._id, accessToken!),
    );
    console.log({ data });

    data?.status === 'SUCCESS' && setReactions(data as typeof reactions);
  };

  return (
    <div className={styles.answer}>
      <div className={styles.answerHeader}>
        <Image
          src={'/img/los-angeles-photo.jpg'}
          width={30}
          height={30}
          objectFit="cover"
          style={{ borderRadius: '50%' }}
        />
        <small className={cls(styles.authorAndDate, 'd-block')}>
          <small>
            Answer from
            <small className="text-black">
              {' '}
              {getFullName(props.answeredBy, { lastNameInitial: true })}
            </small>{' '}
            on Jan 07, 2020
          </small>
        </small>

        <small
          className={cls(
            styles.responderInfo,
            'd-flex gap-3 align-items-center flex-wrap',
          )}
        >
          {props.answeredBy.role === 'BUSINESS_OWNER' ? (
            <small>Business Representative</small>
          ) : null}
          {/* <small>• 4 people found this helpful</small> */}
          {props.mostHelpful ? (
            <span className="d-flex align-items-center gap-2">
              <Icon icon="mdi:like" width={15} />
              <small className="t-2 d-block"> Most helpful answer</small>
            </span>
          ) : null}
        </small>
      </div>
      <small className="parag mb-5 d-block">{props.answerText}</small>

      <div
        className={`d-${
          allowReaction ? 'flex' : 'none'
        } align-items-center justify-content-start gap-5 mb-4`}
      >
        <button
          className="btn btn-bg-none"
          disabled={isReacting}
          onClick={reactToAnswer.bind(null, 'like')}
        >
          <Icon icon={`mdi:like${userLikes ? '' : '-outline'}`} width={20} color="gray" />{' '}
          Helpful ({reactions.likes.length})
        </button>

        <button
          className="btn btn-bg-none gap-2"
          style={{ alignItems: 'flex-start' }}
          disabled={isReacting}
          onClick={reactToAnswer.bind(null, 'dislike')}
        >
          <Icon
            icon={`mdi:dislike${userDislikes ? '' : '-outline'}`}
            width={20}
            color="gray"
          />
          Not helpful ({reactions.dislikes.length})
        </button>
      </div>
    </div>
  );
};

export default Answer;
