import Link from 'next/link';
import { useMemo } from 'react';
import useDate from '../../hooks/useDate';
import { genBusinessPageUrl, genQuestionDetailsPageUrl } from '../../utils/url-utils';
import { getFullName } from '../../utils/user-utils';
import { QuestionItemProps } from '../business-listings/questions/QuestionItem';

type Props = QuestionItemProps & {
  businessId: string;
  businessName: string;
  location: string;
};

const PopularQuestion = function (props: Props) {
  const { date: askedDate } = useDate(props.createdAt, { month: 'short', year: 'numeric' });

  const questionUrl = useMemo(
    () =>
      genQuestionDetailsPageUrl({
        businessName: props.businessName,
        qId: props._id,
        qText: props.questionText,
        location: props.location,
      }),
    [],
  );

  return (
    <li className="py-3" key={props._id}>
      <p className="parag text-dark">{props.questionText}</p>
      <small className="fs-5 text-light">
        Asked by{' '}
        <Link href={'/'}>{getFullName(props.askedBy, { lastNameInitial: true })}</Link>{' '}
        {askedDate}
      </small>
      <small
        className={`text-pry fs-5 d-block cursor-pointer ${!props.answersCount && 'd-none'}`}
      >
        <Link href={questionUrl} passHref>
          <a>View all {props.answersCount} answers</a>
        </Link>
      </small>
    </li>
  );
};

export default PopularQuestion;
