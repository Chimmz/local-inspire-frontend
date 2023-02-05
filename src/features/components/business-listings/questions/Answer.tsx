import React, { useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';
import Image from 'next/image';
import { UserPublicProfile } from '../../../types';

import useSignedInUser from '../../../hooks/useSignedInUser';
import useRequest from '../../../hooks/useRequest';
import useMiddleware from '../../../hooks/useMiddleware';

import api from '../../../library/api';
import { getFullName } from '../../../utils/user-utils';

import cls from 'classnames';
import { Icon } from '@iconify/react';
import styles from './QuestionsSection.module.scss';
import { QuestionItemProps } from './QuestionItem';
import useDate from '../../../hooks/useDate';
import * as qtyUtils from '../../../utils/quantity-utils';
import AppDropdown from '../../shared/dropdown/AppDropdown';
import * as domUtils from '../../../utils/dom-utils';

export interface AnswerProps {
  readonly _id: string;
  readonly answeredBy: UserPublicProfile;
  readonly createdAt: string;
  readonly answerText: string[];
  readonly answeredDate: string;
  readonly likes: string[];
  readonly dislikes: string[];
  readonly mostHelpful: boolean;
}

type Props = AnswerProps & {
  questionId: string;
  setQuestion: Dispatch<SetStateAction<QuestionItemProps>>;
  openReportAnswerModal: (id: string) => void;
};

const Answer: React.FC<Props> = function (props) {
  const { _id: currentUserId, accessToken } = useSignedInUser();

  const [reactions, setReactions] = useState({
    likes: props.likes,
    dislikes: props.dislikes,
  });
  const { date: answeredDate } = useDate(props.createdAt, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const { send: sendReactionReq, loading: isReactingToAnswer } = useRequest({
    autoStopLoading: true,
  });
  const { withAuth } = useMiddleware();

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

  const handleSelectDropdownAction = useCallback((evKey: string) => {
    switch (evKey as 'report') {
      case 'report':
        withAuth(token => props.openReportAnswerModal(props._id));
        // withAuth.bind(null, (_?: string) => props.openReportModal(props._id))}
        break;
    }
  }, []);

  return (
    <div className={styles.answer}>
      <div className={styles.answerHeader}>
        <figure className="position-relative d-block">
          <Image
            src={props.answeredBy.imgUrl}
            layout="fill"
            objectFit="cover"
            style={{ borderRadius: '50%' }}
          />
        </figure>
        <small className={cls(styles.authorAndDate, 'd-block')}>
          <small>
            Answer from
            <span className="text-black">
              {' '}
              {getFullName(props.answeredBy, { lastNameInitial: true })}
            </span>{' '}
            on {answeredDate}
          </small>
        </small>

        <small
          className={cls(
            styles.responderInfo,
            'd-flex gap-2 align-items-center flex-wrap text-light',
          )}
          style={{ rowGap: '5px' }}
        >
          <small>
            {props.answeredBy.role === 'BUSINESS_OWNER'
              ? 'Business Representative'
              : 'Reviewed Business'}
          </small>
          {reactions.likes.length ? (
            <>
              •
              <small>
                {qtyUtils.getPeopleQuantity(reactions.likes.length)} found this helpful
              </small>
            </>
          ) : null}
          {props.mostHelpful ? (
            <strong className="d-flex align-items-center gap-2">
              • <small className="t-2 d-block">Most helpful answer</small>
            </strong>
          ) : null}
        </small>

        <AppDropdown
          items={['Report']}
          onSelect={handleSelectDropdownAction}
          toggler={<Icon icon="material-symbols:more-vert" width={20} />}
          className={styles.options}
        />
      </div>

      <small className="parag mb-4 d-block text-black">
        {domUtils.renderMultiLineText(props.answerText)}
      </small>

      <div
        className={`d-${
          allowReaction ? 'flex' : 'none'
        } align-items-center justify-content-start gap-4`}
      >
        <button
          className="btn btn-bg-none no-bg-hover"
          disabled={isReactingToAnswer}
          onClick={withAuth.bind(null, (token?: string) => reactToAnswer('like', token!))}
        >
          {/* <Icon icon={`mdi:like${userLikes ? '' : '-outline'}`} width={20} color="gray" />{' '} */}
          <Icon icon={`ant-design:like-${userLikes ? 'filled' : 'outlined'}`} width={18} />
          <small> Helpful ({reactions.likes.length})</small>
        </button>

        <button
          className="btn btn-bg-none no-bg-hover gap-2"
          style={{ alignItems: 'flex-start' }}
          disabled={isReactingToAnswer}
          onClick={withAuth.bind(null, (token?: string) => reactToAnswer('dislike', token!))}
        >
          <Icon
            icon={`ant-design:dislike-${userDislikes ? 'filled' : 'outlined'}`}
            width={18}
          />
          <small> Not helpful ({reactions.dislikes.length})</small>
        </button>
      </div>
    </div>
  );
};

export default Answer;
