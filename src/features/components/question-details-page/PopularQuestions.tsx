import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import useDate from '../../hooks/useDate';
import api from '../../library/api';
import {
  genBusinessPageUrl,
  genQuestionDetailsPageUrl,
  getBusinessQuestionsUrl,
} from '../../utils/url-utils';
import { getFullName } from '../../utils/user-utils';
import { QuestionItemProps } from '../business-listings/questions/QuestionItem';
import { BusinessProps } from '../business-results/Business';

const TOTAL_POPULAR_TO_SHOW = 5;

type Props = {
  business: Pick<BusinessProps, '_id' | 'businessName' | 'stateCode' | 'city'>;
  className: string;
};

const PopularQuestions = function (props: Props) {
  const [questions, setQuestions] = useState<QuestionItemProps[]>([]);
  const { formatDate } = useDate(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const getPopularQuestions = async () => {
    const res = await api.getQuestionsAskedAboutBusiness(props.business._id);
    console.log('Popular: ', res);
    if (res.status !== 'SUCCESS') return;

    const items = res.data as QuestionItemProps[];
    items?.sort((prev, next) => (next.answers.length < prev.answers.length ? -1 : 1));
    setQuestions(items.slice(5));
  };

  useEffect(() => {
    getPopularQuestions();
  }, []);

  const questionsPageUrl = useMemo(
    () =>
      getBusinessQuestionsUrl({
        businessId: props.business._id,
        ...props.business,
      }),
    [],
  );

  return (
    <>
      <ul className={props.className}>
        {questions.slice(TOTAL_POPULAR_TO_SHOW).map(q => (
          <li key={q._id}>
            <small className="parag text-dark d-block mb-2">{q.questionText}</small>
            <small className="d-block mb-3 text-light" style={{ fontSize: '12px' }}>
              Asked by{' '}
              <Link href={'/'} passHref>
                <a>{getFullName(q.askedBy, { lastNameInitial: true })}</a>
              </Link>{' '}
              {formatDate(q.createdAt)}
            </small>

            <a
              href={genQuestionDetailsPageUrl({
                businessName: props.business.businessName,
                qId: q._id,
                qText: q.questionText,
                city: props.business.city,
                stateCode: props.business.stateCode,
                scrollToAnswerForm: true,
              })}
              className="btn btn-gray btn--xsm text-pry w-max-content"
            >
              Answer this question
            </a>
          </li>
        ))}
      </ul>

      <small className="text-pry cursor-pointer">
        <Link href={questionsPageUrl} passHref>
          <a> View all {questions.length} questions</a>
        </Link>
      </small>
    </>
  );
};

export default PopularQuestions;
