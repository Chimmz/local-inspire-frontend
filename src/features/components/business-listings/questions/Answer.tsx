import React, { useState, useMemo, Dispatch, SetStateAction, useCallback } from 'react';
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
import AppTooltip from '../../AppTooltip';

export interface AnswerProps {
  _id: string;
  answeredBy: UserPublicProfile;
  createdAt: string;
  answerText: string[];
  answeredDate: string;
  likes: string[];
  dislikes: string[];
  mostHelpful: boolean;
}

type Props = AnswerProps & {
  questionId: string;
  setQuestion: Dispatch<SetStateAction<QuestionItemProps>>;
  setMostHelpfulAnswerId?: Dispatch<SetStateAction<string | null>>;
  businessReviewersSet?: Set<string> | null;
  openReportAnswerModal: (id: string) => void;
};

const Answer: React.FC<Props> = function (props) {
  const { _id: currentUserId, accessToken } = useSignedInUser();
  const [isMostHelpfulAnswer, setIsMostHelpfulAnswer] = useState(props.mostHelpful);

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
  const userLikesAnswer = reactions.likes.includes(currentUserId!);
  const userDislikesAnswer = reactions.dislikes.includes(currentUserId!);

  const reactToAnswer = async function (reaction: 'like' | 'dislike', token: string) {
    const handler =
      reaction === 'like'
        ? api.toggleLikeAnswerToBusinessQuestion
        : api.toggleDislikeAnswerToBusinessQuestion;

    const req = handler.bind(api)(props.questionId, props._id, token!);

    const res = (await sendReactionReq(req)) as typeof reactions & {
      status: 'SUCCESS' | 'FAIL' | 'ERROR';
      mostHelpfulAnswerId: string | null;
    };
    console.log({ res });

    if (res?.status === 'SUCCESS') {
      setIsMostHelpfulAnswer(res.mostHelpfulAnswerId === props._id);
      setReactions(res);
    }
  };

  const userReviewedBusiness = useMemo(() => {
    return props.businessReviewersSet?.has(props.answeredBy._id);
  }, [props.businessReviewersSet, props.answeredBy._id]);

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
              : userReviewedBusiness
              ? 'Reviewed Business'
              : ''}
          </small>
          {reactions.likes.length ? (
            <small>
              {'•'} {qtyUtils.getPeopleQuantity(reactions.likes.length)} found this helpful
            </small>
          ) : null}
          {isMostHelpfulAnswer ? (
            <strong className="d-flex align-items-center gap-2">
              • <small className="t-2 d-block">Most helpful answer</small>
            </strong>
          ) : null}
          |{/* Report flag */}
          <AppTooltip text="Problem with this answer?">
            <small
              className="cursor-pointer"
              onClick={() => withAuth(props.openReportAnswerModal.bind(null, props._id))}
            >
              <Icon icon="fa6-solid:flag" width={10} />
            </small>
          </AppTooltip>
        </small>
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
          <Icon
            icon={`ant-design:like-${userLikesAnswer ? 'filled' : 'outlined'}`}
            width={18}
          />
          <small> Helpful ({reactions.likes.length})</small>
        </button>

        <button
          className="btn btn-bg-none no-bg-hover gap-2"
          style={{ alignItems: 'flex-start' }}
          disabled={isReactingToAnswer}
          onClick={withAuth.bind(null, (token?: string) => reactToAnswer('dislike', token!))}
        >
          <Icon
            icon={`ant-design:dislike-${userDislikesAnswer ? 'filled' : 'outlined'}`}
            width={18}
          />
          <small> Not helpful ({reactions.dislikes.length})</small>
        </button>
      </div>
    </div>
  );
};

export default Answer;

// I wish I could visit this eatery every weekend. They're special in a kind of way.
// Just have a first visit and you will become addicted to their tasty meals.
