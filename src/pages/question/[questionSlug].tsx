import { Icon } from '@iconify/react';
import cls from 'classnames';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, SSRProvider } from 'react-bootstrap';
import Answer, {
  AnswerProps,
} from '../../features/components/business-listings/questions/Answer';
import { postingGuidelinesConfig } from '../../features/components/business-listings/questions/config';
import { QuestionItemProps } from '../../features/components/business-listings/questions/QuestionItem';
import { reportModalConfig } from '../../features/components/business-listings/reviews/config';
import PopupInfo from '../../features/components/PopupInfo';
import Layout from '../../features/components/layout';
import PopularQuestions from '../../features/components/question-details-page/PopularQuestions';
import NewQuestionSection from '../../features/components/questions-page/NewQuestionSection';
import LoadingButton from '../../features/components/shared/button/Button';
import AppDropdown from '../../features/components/shared/dropdown/AppDropdown';
import LabelledCheckbox from '../../features/components/shared/LabelledCheckbox';
import Spinner from '../../features/components/shared/spinner/Spinner';
import PageSuccess from '../../features/components/shared/success/PageSuccess';
import TextInput from '../../features/components/shared/text-input/TextInput';
import useMiddleware, { AuthMiddlewareNext } from '../../features/hooks/useMiddleware';
import useDate from '../../features/hooks/useDate';
import useInput from '../../features/hooks/useInput';
import useRequest from '../../features/hooks/useRequest';
import useSignedInUser from '../../features/hooks/useSignedInUser';
import api from '../../features/library/api';
import { genBusinessPageUrl, getBusinessQuestionsUrl } from '../../features/utils/url-utils';
import { getFullName } from '../../features/utils/user-utils';
import { maxLength, minLength } from '../../features/utils/validators/inputValidators';
import ReportQA from '../../features/components/ReportQA';
import styles from '../../styles/sass/pages/QuestionWIthAnswers.module.scss';

interface Props {
  question?: QuestionItemProps;
  error?: string;
}

const NEW_ANSWER_MIN_LENGTH = 5;
const NEW_ANSWER_MAX_LENGTH = 180;

const QuestionWithAnswersPage: NextPage<Props> = function (props) {
  const [question, setQuestion] = useState<QuestionItemProps | undefined>(props.question);
  const { isSignedIn, ...currentUser } = useSignedInUser();
  const { withAuth } = useMiddleware();
  // Modals
  const [showAnswerSuccessModal, setShowAnswerSuccessModal] = useState(false);
  const [showPostingGuidelines, setShowPostingGuidelines] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const router = useRouter();
  console.log({ 'router.query': router.query });

  const { formatDate } = useDate(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const { send: sendAnswerReq, loading: submittingAnswer } = useRequest({
    autoStopLoading: true,
  });

  const {
    inputValue: newAnswer,
    handleChange: handleChangeNewAnswer,
    validationErrors: newAnswerValidators,
    runValidators: runNewAnswerValidators,
    clearInput: clearNewAnswerText,
  } = useInput({
    init: '',
    validators: [
      {
        fn: minLength,
        params: [
          NEW_ANSWER_MIN_LENGTH,
          `Please enter at least ${NEW_ANSWER_MIN_LENGTH} characters`,
        ],
      },
      {
        fn: maxLength,
        params: [
          NEW_ANSWER_MAX_LENGTH,
          `Please enter no more than ${NEW_ANSWER_MAX_LENGTH} characters`,
        ],
      },
    ],
  });

  useEffect(() => {
    if (props.question) setQuestion(props.question);
  }, [props.question]);

  const handleSelectDropdownOption = (evKey: string) => {
    switch (evKey as 'report') {
      case 'report':
        withAuth(setShowReportModal.bind(null, true));
        break;
    }
  };

  const handleClickProvideNewAnswer = async () => {
    const textarea = await new Promise<HTMLTextAreaElement>(resolve => {
      const el = document.querySelector('.newAnswerForm textarea') as HTMLTextAreaElement;
      resolve(el);
    });
    window.scrollTo(0, window.innerHeight);
    textarea?.focus();
  };

  const submitNewAnswer: AuthMiddlewareNext = async (token?: string) => {
    const res = await sendAnswerReq(
      api.addAnswerToBusinessQuestion(props.question!._id, newAnswer, token!),
    );
    if (res.status === 'SUCCESS') {
      setQuestion(res.question);
      setShowAnswerSuccessModal(true);
      clearNewAnswerText();
    }
  };

  const handleReportQuestion = (reason: string, explanation: string) => {
    console.log(reason, explanation);
  };

  const mostHelpfulAnswer = useMemo(() => {
    if (!question) return null;

    let answer: AnswerProps | null = question!.answers.reduce((acc, ans) => {
      return ans.likes.length > acc.likes.length ? ans : acc;
    }, question!.answers[0]);

    return answer?.likes.length ? answer : null;
  }, [question]);

  console.log({ mostHelpfulAnswer });

  const externalUrlParams = {
    businessId: question!.business!._id,
    businessName: question!.business!.businessName,
    city: question!.business!.city,
    stateCode: question!.business!.stateCode,
  };
  const businessUrl = useMemo(() => genBusinessPageUrl(externalUrlParams), []);
  const questionsUrl = useMemo(
    () => getBusinessQuestionsUrl({ ...externalUrlParams, promptNewQuestion: true }),
    [],
  );

  return (
    <SSRProvider>
      <Spinner show={submittingAnswer} pageWide />
      <Modal show={showAnswerSuccessModal}>
        <Modal.Body className="py-5">
          <PageSuccess
            title="Answer Submitted."
            description="Your answer has been submitted successfully."
            className="mb-5"
          />
          <button
            className="btn btn-pry mx-auto text-center"
            style={{ minWidth: '150px' }}
            onClick={setShowAnswerSuccessModal.bind(null, false)}
          >
            Close
          </button>
        </Modal.Body>
      </Modal>
      <Layout>
        <Layout.Nav></Layout.Nav>
        <Layout.Main className={cls(styles.main, 'page-main')}>
          <div className={cls(styles.container, 'container')}>
            <nav
              className={cls(
                styles.pageRouteNav,
                'd-flex align-items-center gap-2 mb-5 flex-wrap',
              )}
            >
              <small className="text-pry">
                <Link href={businessUrl}>{props.question?.business?.businessName}</Link>
              </small>
              <Icon icon="ic:baseline-greater-than" width={10} />
              <small className="text-pry">
                <Link href={questionsUrl}>Ask the Community</Link>
              </small>
              <Icon icon="ic:baseline-greater-than" width={10} />
              <small className="">{question?.questionText}</small>
            </nav>

            <header className={styles.header}>
              <h1 className="flex-grow-1" style={{ flexBasis: '90%' }}>
                {question?.questionText}
              </h1>
              <AppDropdown
                items={['Report']}
                onSelect={handleSelectDropdownOption}
                toggler={<Icon icon="material-symbols:more-vert" width={20} />}
                className={styles.options}
              />
              <figure>
                <Image
                  src={isSignedIn ? currentUser.imgUrl! : '/img/default-profile-pic.jpeg'}
                  width={40}
                  height={40}
                  objectFit="cover"
                  style={{ borderRadius: '50%' }}
                />
              </figure>

              <div className="" style={{ flexBasis: '80%' }}>
                <small className="d-block">
                  <span className="text-black">
                    {getFullName(question?.askedBy, { lastNameInitial: true })}
                  </span>{' '}
                  asked a question on {formatDate(question?.createdAt)}
                </small>
                <small className={styles.location}>
                  {props.question?.askedBy.city ? (
                    <>
                      <Icon icon="material-symbols:location-on" width={15} color="#2c2c2c" />
                      {props.question?.askedBy.city} •
                    </>
                  ) : null}
                  5 contributions
                </small>
              </div>
              <button
                className="btn btn-outline btn--sm ms-auto"
                onClick={handleClickProvideNewAnswer}
              >
                Provide an answer
              </button>
            </header>

            {/* <h3>2 Answers sorted by most helpful</h3> */}
            <h3>{question?.answersCount} Answers</h3>

            <ul className={cls(styles.answersList, 'no-bullets mb-5')}>
              {question?.answers.map(a => (
                <Answer
                  {...a}
                  setQuestion={setQuestion as Dispatch<SetStateAction<QuestionItemProps>>}
                  questionId={question._id}
                  mostHelpful={a._id === mostHelpfulAnswer?._id}
                  key={a._id}
                />
              ))}
            </ul>

            <form
              className={cls(styles.newAnswer, 'newAnswerForm')}
              id="new-answer"
              onSubmit={ev => {
                ev.preventDefault();
                if (!runNewAnswerValidators().errorExists) withAuth(submitNewAnswer);
              }}
            >
              <h6 className="fs-4 mb-5" style={{ flexBasis: '100%' }}>
                <strong>
                  Hi, {currentUser.firstName}, can you provide an answer for this
                  traveler&apos;s question?
                </strong>
              </h6>
              <div className="d-flex align-items-start flex-wrap gap-4 mb-3">
                <Image
                  src={isSignedIn ? currentUser.imgUrl! : '/img/default-profile-pic.jpeg'}
                  width={40}
                  height={40}
                  objectFit="cover"
                  style={{ borderRadius: '50%' }}
                />
                <div className="flex-grow-1">
                  <TextInput
                    as="textarea"
                    value={newAnswer}
                    onChange={handleChangeNewAnswer}
                    validationErrors={newAnswerValidators}
                    className="textfield bg-white mb-3"
                  />
                </div>
              </div>

              <div className="d-flex align-items-center gap-5">
                <LoadingButton
                  className="btn btn-pry"
                  isLoading={submittingAnswer}
                  textWhileLoading="Submitting..."
                >
                  Post your answer
                </LoadingButton>
                <button
                  className="btn btn-bg-none no-bg-hover"
                  type="button"
                  onClick={setShowPostingGuidelines.bind(null, true)}
                >
                  Posting guidelines
                </button>
              </div>
            </form>

            <aside>
              <Link href={questionsUrl} passHref>
                <a className="btn btn-sec ms-auto mb-5 w-max-content">See all questions</a>
              </Link>
              <section className={styles.popularQuestions}>
                <h3 className="mb-5">
                  Popular questions for {question?.business?.businessName}
                </h3>
                <PopularQuestions
                  business={props.question!.business!}
                  className={cls(styles.popularList, 'no-bullets')}
                />
              </section>
            </aside>
          </div>
        </Layout.Main>

        <PopupInfo
          heading={postingGuidelinesConfig.heading}
          show={showPostingGuidelines}
          close={setShowPostingGuidelines.bind(null, false)}
        >
          {postingGuidelinesConfig.body(props.question?.business?.businessName!)}
        </PopupInfo>

        <ReportQA
          show={showReportModal}
          close={setShowReportModal.bind(null, false)}
          onReport={handleReportQuestion}
        ></ReportQA>
      </Layout>
    </SSRProvider>
  );
};

export const getStaticPaths: GetStaticPaths = async context => {
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async function (context) {
  const slug = context.params!.questionSlug as string;
  const [businessName, location, questionText, questionId] = slug.split('_');

  if (!businessName || !location || !questionText || !questionId) return { notFound: true };
  console.log({ businessName, location, questionText, questionId });

  const res = await api.getQuestion(questionId, {
    textSearch: questionText.split('-').join(' ').split('?').join(' ').trim().toLowerCase(),
  });

  if (res.status === 'NOT_FOUND') return { notFound: true };

  return {
    props: {
      question: res.question,
      // params: { questionText: questionText.split('-').join(' ') },
    },
  };
};

export default QuestionWithAnswersPage;
