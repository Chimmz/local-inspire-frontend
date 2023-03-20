import { useCallback, useMemo, useState, Dispatch, SetStateAction, memo } from 'react';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Modal, SSRProvider } from 'react-bootstrap';
import Answer, {
  AnswerProps,
} from '../../features/components/business-listings/questions/Answer';
import { QuestionItemProps } from '../../features/components/business-listings/questions/QuestionItem';
import { BusinessProps } from '../../features/components/business-results/Business';
import {
  answerReportReasonsConfig,
  newQuestionGuidelinesConfig,
  newAnswersGuidelinesConfig,
  questionReportReasonsConfig,
} from '../../features/components/business-listings/questions/config';

import { Icon } from '@iconify/react';
import useMiddleware, { AuthMiddlewareNext } from '../../features/hooks/useMiddleware';
import usePaginate from '../../features/hooks/usePaginate';
import useDate from '../../features/hooks/useDate';
import useInput from '../../features/hooks/useInput';
import useRequest from '../../features/hooks/useRequest';
import useSignedInUser from '../../features/hooks/useSignedInUser';
import cls from 'classnames';

import { maxLength, minLength } from '../../features/utils/validators/inputValidators';
import {
  genBusinessPageUrl,
  genUserProfileUrl,
  getBusinessQuestionsUrl,
} from '../../features/utils/url-utils';
import { getFullName } from '../../features/utils/user-utils';
import * as qtyUtils from '../../features/utils/quantity-utils';
import * as domUtils from '../../features/utils/dom-utils';
import { toTitleCase } from '../../features/utils/string-utils';
import api from '../../features/library/api';

import Paginators from '../../features/components/shared/pagination/Paginators';
import PopupInfo from '../../features/components/PopupInfo';
import Layout from '../../features/components/layout';
import PopularQuestions from '../../features/components/question-details-page/PopularQuestions';
import NewQuestionSection from '../../features/components/questions-page/NewQuestionSection';
import LoadingButton from '../../features/components/shared/button/Button';
import AppDropdown from '../../features/components/shared/dropdown/AppDropdown';
import Spinner from '../../features/components/shared/spinner/Spinner';
import PageSuccess from '../../features/components/shared/success/PageSuccess';
import TextInput from '../../features/components/shared/text-input/TextInput';
import ReportQA from '../../features/components/ReportQA';
import styles from '../../styles/sass/pages/QuestionWIthAnswers.module.scss';

interface Props {
  question?: QuestionItemProps & {
    business: Pick<BusinessProps, '_id' | 'businessName' | 'city' | 'stateCode' | 'reviewers'>;
  };
  answers: {
    data: AnswerProps[] | undefined;
    total: number;
    results: number;
    mostHelpfulAnswerId: string | null;
  };
  error?: string;
}

const NEW_ANSWER_MIN_LENGTH = 5;
const NEW_ANSWER_MAX_LENGTH = 180;
const ANSWERS_PER_PAGE = 10;

const QuestionWithAnswersPage: NextPage<Props> = function (props) {
  const [question, setQuestion] = useState<QuestionItemProps | undefined>(props.question);
  const [answers, setAnswers] = useState<AnswerProps[] | undefined>(props.answers.data);
  const [answersTotal, setAnswersTotal] = useState(props.answers.total);
  const [mostHelpfulAnswerId, setMostHelpfulAnswerId] = useState(
    props.answers.mostHelpfulAnswerId,
  );
  const { currentPage, setCurrentPage } = usePaginate<AnswerProps[]>({
    init: { 1: props.answers.data },
  });
  const { isSignedIn, ...currentUser } = useSignedInUser();
  const { withAuth } = useMiddleware();
  // Modals
  const [showNewQuestionSuccessModal, setShowNewQuestionSuccessModal] = useState(false);
  const [answerIdReport, setAnswerIdReport] = useState<string | null>(null);
  const [showQuestionGuidelines, setShowQuestionGuidelinesModal] = useState(false);
  const [showAnswerGuidelines, setShowAnswerGuidelinesModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const { send: sendPageReq, loading: isPaginating } = useRequest({ autoStopLoading: true });
  const { send: sendSubmitQuestionReq, loading: submittingNewQuestion } = useRequest({
    autoStopLoading: true,
  });

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

  const handlePageChange = useCallback(
    async (newPage: number) => {
      setCurrentPage(newPage);
      const res = await sendPageReq(
        api.getAnswersToQuestion(props.question?._id!, {
          page: newPage,
          limit: ANSWERS_PER_PAGE,
        }),
      );
      setAnswers(res.data);
      setAnswersTotal(res.total);
      window.scrollTo(0, 0);
    },
    [setCurrentPage, props.question?._id, sendPageReq, setAnswers, setAnswersTotal],
  );

  const pageCount = useMemo(() => Math.ceil(answersTotal! / ANSWERS_PER_PAGE), [answersTotal]);

  const handleSelectDropdownOption = useCallback(
    (evKey: string) => {
      switch (evKey as 'report') {
        case 'report':
          withAuth(setShowReportModal.bind(null, true));
          break;
      }
    },
    [withAuth, setShowReportModal],
  );

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
      setAnswers(items => [res.newAnswer, ...items!]);
      setAnswersTotal(n => n + 1);
      clearNewAnswerText();
      window.scrollTo(0, 0);
    }
  };

  const reportQuestion = (reason: string, explanation: string) => {
    console.log(reason, explanation);
  };

  const externalUrlParams = useMemo(
    () => ({
      businessId: question!.business!._id,
      businessName: question!.business!.businessName,
      city: question!.business!.city,
      stateCode: question!.business!.stateCode,
    }),
    [question],
  );

  const businessUrl = useMemo(
    () => genBusinessPageUrl(externalUrlParams),
    [genBusinessPageUrl, externalUrlParams],
  );
  const questionsUrl = useMemo(
    () => getBusinessQuestionsUrl({ ...externalUrlParams, promptNewQuestion: true }),
    [externalUrlParams],
  );

  const mostHelpfulAnswer = useMemo(() => {
    return props.answers.data?.find(a => a._id === mostHelpfulAnswerId) || null;
  }, [props.answers, mostHelpfulAnswerId]);

  const businessReviewersSet = useMemo(() => {
    const b = props.question?.business;
    return b?.reviewers?.length ? new Set(b.reviewers) : null;
  }, [props.question?.business?.reviewers]);

  // Have they got roasted beef? – Chicken Express in Terrell, Tx
  const pageDescription = useMemo(() => {
    const q = props.question;
    return `${q?.questionText} - ${q?.business.businessName} in ${toTitleCase(
      q?.business.city || '',
    )},
      ${q?.business.stateCode} | Localinspire`;
  }, [props.question]);

  return (
    <SSRProvider>
      <Head>
        <title>{pageDescription}</title>
      </Head>
      <Spinner show={isPaginating || submittingAnswer} pageWide />
      <Modal show={showNewQuestionSuccessModal}>
        <Modal.Body className="py-5">
          <PageSuccess
            title="Submitted."
            description="Your question has been posted successfully in the Q&A page."
            className="mb-5"
          />
          <button
            className="btn btn-pry mx-auto text-center"
            style={{ minWidth: '150px' }}
            onClick={setShowNewQuestionSuccessModal.bind(null, false)}
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
                {domUtils.renderMultiLineText(question?.questionText!)}
              </h1>
              <AppDropdown
                items={['Report']}
                onSelect={handleSelectDropdownOption}
                toggler={<Icon icon="material-symbols:more-vert" width={20} />}
                className={styles.options}
              />
              <figure>
                <Image
                  src={props.question?.askedBy.imgUrl || '/img/default-profile-pic.jpeg'}
                  width={40}
                  height={40}
                  objectFit="cover"
                  style={{ borderRadius: '50%' }}
                />
              </figure>

              <div className="" style={{ flexBasis: '80%' }}>
                <small className="d-block">
                  <Link href={genUserProfileUrl(question!.askedBy)} passHref>
                    <a className="text-black">
                      {getFullName(question?.askedBy, { lastNameInitial: true })}
                    </a>
                  </Link>{' '}
                  asked a question on {formatDate(question?.createdAt)}
                </small>
                <small className={styles.location}>
                  {props.question?.askedBy.city ? (
                    <>
                      <Icon icon="material-symbols:location-on" width={15} color="#2c2c2c" />
                      {props.question?.askedBy.city} •{' '}
                    </>
                  ) : null}
                  {qtyUtils.quantitize(props.question?.askedBy?.contributions?.length! || 0, [
                    'contribution',
                    'contributions',
                  ])}
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
            <h3>{qtyUtils.quantitize(answersTotal, ['Answer', 'Answers'])} </h3>

            <ul className={cls(styles.answersList, 'no-bullets mb-5')}>
              {mostHelpfulAnswer ? (
                <Answer
                  {...mostHelpfulAnswer!}
                  mostHelpful
                  setQuestion={setQuestion as Dispatch<SetStateAction<QuestionItemProps>>}
                  setMostHelpfulAnswerId={setMostHelpfulAnswerId}
                  questionId={props.question?._id!}
                  openReportAnswerModal={setAnswerIdReport}
                  businessReviewersSet={businessReviewersSet}
                  key={String(mostHelpfulAnswerId)}
                />
              ) : null}

              {answers?.map(a => {
                if (a._id === mostHelpfulAnswerId) return null;
                return (
                  <Answer
                    {...a}
                    setQuestion={setQuestion as Dispatch<SetStateAction<QuestionItemProps>>}
                    setMostHelpfulAnswerId={setMostHelpfulAnswerId}
                    questionId={props.question?._id!}
                    openReportAnswerModal={setAnswerIdReport}
                    businessReviewersSet={businessReviewersSet}
                    key={a._id}
                  />
                );
              })}
            </ul>

            {/* Pagination */}
            <section className={(styles.pagination, 'mb-5')}>
              <Paginators
                currentPage={currentPage}
                onPageChange={handlePageChange}
                pageCount={pageCount}
              />
            </section>

            <form
              className={cls(styles.newAnswer, 'newAnswerForm', 'mb-5')}
              id="new-answer"
              onSubmit={ev => {
                ev.preventDefault();
                if (!runNewAnswerValidators().errorExists) withAuth(submitNewAnswer);
              }}
            >
              <h6 className="fs-4 mb-5" style={{ flexBasis: '100%' }}>
                <strong>
                  Hi, {currentUser.firstName}, can you provide an answer for this traveler&apos;s
                  question?
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
                <small
                  className="cursor-pointer text-pry"
                  onClick={setShowAnswerGuidelinesModal.bind(null, true)}
                >
                  Posting guidelines
                </small>
              </div>
            </form>

            <aside>
              <Link href={questionsUrl} passHref>
                <a className="btn btn-sec ms-auto mb-5 w-max-content">See all questions</a>
              </Link>
              <NewQuestionSection
                businessId={props.question?.business?._id!}
                businessName={props.question?.business?.businessName!}
                sendSubmitReq={sendSubmitQuestionReq}
                submitting={submittingNewQuestion!}
                openGuidelinesModal={setShowQuestionGuidelinesModal.bind(null, true)}
                className="mb-5"
                withUserPhoto={false}
                openSuccessModal={setShowNewQuestionSuccessModal.bind(null, true)}
              />
              <section className={styles.popularQuestions}>
                <h3 className="">Popular questions for {question?.business?.businessName}</h3>
                <PopularQuestions
                  business={props.question!.business!}
                  className={cls(styles.popularList, 'no-bullets')}
                />
              </section>
            </aside>
          </div>
        </Layout.Main>

        {/* New question Guidelines modal */}
        <PopupInfo
          heading={newQuestionGuidelinesConfig.heading}
          show={showQuestionGuidelines}
          close={setShowQuestionGuidelinesModal.bind(null, false)}
        >
          {newQuestionGuidelinesConfig.body(props.question?.business?.businessName!)}
        </PopupInfo>

        <PopupInfo
          heading={newAnswersGuidelinesConfig.heading}
          show={showAnswerGuidelines}
          close={setShowAnswerGuidelinesModal.bind(null, false)}
        >
          {newAnswersGuidelinesConfig.body(props.question?.business?.businessName!)}
        </PopupInfo>

        {/* Report question modal */}
        <ReportQA
          show={showReportModal}
          reportType="question"
          reportObjectId={props.question?._id!}
          possibleReasons={questionReportReasonsConfig}
          onReport={reportQuestion}
          close={setShowReportModal.bind(null, false)}
        />

        {/* Report answer modal */}
        <ReportQA
          show={!!answerIdReport}
          reportObjectId={answerIdReport!}
          reportType="answer"
          possibleReasons={answerReportReasonsConfig}
          close={() => setAnswerIdReport(null)}
        />
      </Layout>
    </SSRProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async function (context) {
  const slug = context.params!.questionSlug as string;
  const [businessName, location, questionText, questionId] = slug.split('_');

  if (!businessName || !location || !questionText || !questionId) return { notFound: true };
  console.log({ businessName, location, questionText, questionId });

  const responses = await Promise.all([
    api.getQuestion(questionId),
    api.getAnswersToQuestion(questionId, { page: 1, limit: 10 }),
  ]);

  console.log('Que response: ', responses[0]);

  if (responses[0].status === 'NOT_FOUND') return { notFound: true };

  return {
    props: {
      question: responses[0].question,
      answers: responses[1],
    },
  };
};

export default QuestionWithAnswersPage;
