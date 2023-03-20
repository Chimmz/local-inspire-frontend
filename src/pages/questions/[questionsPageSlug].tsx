import React, { useState, useMemo, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
// Types
import { QuestionItemProps } from '../../features/components/business-listings/questions/QuestionItem';
// Hooks
import { useRouter } from 'next/router';
import useUrlQueryBuilder from '../../features/hooks/useUrlQueryBuilder';
import useRequest from '../../features/hooks/useRequest';
import usePaginate from '../../features/hooks/usePaginate';
// Utils
import api from '../../features/library/api';
import { toTitleCase } from '../../features/utils/string-utils';
import { genBusinessPageUrl, parseQuestionsPageSlug } from '../../features/utils/url-utils';
import {
  newQuestionGuidelinesConfig,
  newAnswersGuidelinesConfig,
  questionReportReasonsConfig,
} from '../../features/components/business-listings/questions/config';
import cls from 'classnames';
// Components
import { Icon } from '@iconify/react';
import { Modal, SSRProvider } from 'react-bootstrap';
import Question from '../../features/components/questions-page/Question';
import Paginators from '../../features/components/shared/pagination/Paginators';
import NewQuestionSection from '../../features/components/questions-page/NewQuestionSection';
import Spinner from '../../features/components/shared/spinner/Spinner';
import PageSuccess from '../../features/components/shared/success/PageSuccess';
import PopularQuestion from '../../features/components/questions-page/PopularQuestion';
import Layout from '../../features/components/layout';
import PopupInfo from '../../features/components/PopupInfo';
import ReportQA from '../../features/components/ReportQA';
import styles from '../../styles/sass/pages/QuestionsPage.module.scss';

interface QuestionsPageProps {
  questions: {
    status: 'SUCCESS' | 'FAIL' | 'ERROR';
    total?: number;
    data?: QuestionItemProps[] | undefined;
    error?: { msg: string };
  };
  params: { businessName: string; businessId: string; location: string; slug: string };
}

type FilterName = 'Most Answered' | 'Most Recent' | 'Oldest' | 'Page' | string;
const questionFilterNames: FilterName[] = ['Most Recent', 'Most Answered', 'Oldest'];

const QUESTIONS_PER_PAGE = 10;
const MAX_POPULAR_QUESTIONS = 6;

const QuestionsPage: NextPage<QuestionsPageProps> = function (props) {
  const { businessId, businessName } = props.params;
  const [questions, setQuestions] = useState<QuestionItemProps[]>(props.questions.data || []);
  const [questionsCount, setQuestionsCount] = useState<number>(props.questions.total!);

  const router = useRouter();

  const { send: sendSubmitQuestionReq, loading: submittingNewQuestion } = useRequest({
    autoStopLoading: true,
  });
  const { send: sendSubmitAnswerReq, loading: submittingNewAnswer } = useRequest({
    autoStopLoading: true,
  });
  const { send: sendFilterReq, loading: isFiltering } = useRequest({ autoStopLoading: true });

  const { currentPage, setCurrentPage } = usePaginate<QuestionItemProps[]>({
    defaultCurrentPage: 1,
  });

  // Modals
  const [showAnswerSuccessModal, setShowAnswerSuccessModal] = useState(false);
  const [showQuestionGuidelines, setNewQuestionGuidelines] = useState(false);
  const [showAnswerGuidelines, setShowNewAnswerGuidelines] = useState(false);
  const [reportedQueId, setReportedQueId] = useState<null | string>(null);

  const filterQuestions = async (queryStr: string, page?: number) => {
    const req = api.getQuestionsAskedAboutBusiness(props.params.businessId, queryStr, {
      page: page || currentPage,
      limit: QUESTIONS_PER_PAGE,
    });
    const res = await sendFilterReq(req);
    if (res.status !== 'SUCCESS') return;
    setQuestions(res.data);
    setQuestionsCount(res.total); // If there are new questions in DB, it will reflect in the number of pages
    console.log('Reponse: ', res);
  };

  const { addNewFilterName, removeFilterName, filterNames, queryStr } =
    useUrlQueryBuilder<FilterName>({
      initFilters: ['Most Recent'],
      autoBuild: true,
      onBuild: filterQuestions,
      filtersConfig: new Map([
        ['Most Answered', { sort: '-answersCount', match: '', page: '' }],
        ['Most Recent', { sort: '-createdAt', match: '', page: '' }],
        ['Oldest', { sort: '+createdAt', match: '', page: '' }],
        ['Page', { sort: '', match: '', page: 0 }],
      ]),
    });

  useEffect(() => {
    if ('promptNewQuestion' in router.query) {
      const scrollToAndFocusTextarea = async () => {
        const textarea = await new Promise<HTMLTextAreaElement | null>(resolve => {
          resolve(document.querySelector('textarea'));
        });
        console.log({ textarea });
        textarea?.focus();
        window.scrollTo(0, window.innerHeight);
      };
      scrollToAndFocusTextarea();
    }
  }, [router.query]);

  const handleClickFilterName = (filter: FilterName) => {
    (filterNames.includes(filter) ? removeFilterName : addNewFilterName)(filter);
    switch (filter) {
      case 'Most Answered':
        removeFilterName('Oldest');
        removeFilterName('Most Recent');
        break;
      case 'Most Recent':
        removeFilterName('Oldest');
        removeFilterName('Most Answered');
        break;
      case 'Oldest':
        removeFilterName('Most Recent');
        removeFilterName('Most Answered');
        break;
    }
  };

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    filterQuestions(queryStr, newPage);
    window.scrollTo(0, 0);
  };

  const handleReportQuestion = (reason: string, explanation: string) => {
    console.log(reason, explanation);
  };

  const pageCount = useMemo(
    () => Math.ceil(questionsCount! / QUESTIONS_PER_PAGE),
    [questionsCount],
  );

  const recordsShown = useMemo(() => {
    if (pageCount > currentPage) return QUESTIONS_PER_PAGE * currentPage;
    return props.questions.total;
  }, [pageCount, currentPage, questionsCount, props.questions.total]);

  const popularQuestions = useMemo(() => {
    const items = props.questions.data?.filter(q => q.answersCount > 0);
    items?.sort((prev, next) => (next.answers.length < prev.answers.length ? -1 : 1));
    return items;
  }, [props.questions.data]);

  const businessUrl = useMemo(
    () => genBusinessPageUrl<string>({ slug: props.params.slug }),
    [props.params.slug],
  );

  // Chicken Express - Questions & Answers Community in Terrell, Tx | Localinspire
  const pageDescription = useMemo(() => {
    const [city, stateCode] = props.params.location.split('-');
    return `${props.params.businessName} - Questions & Answers Community in ${toTitleCase(
      city,
    )}, ${stateCode.toUpperCase()} | Localinspire`;
  }, []);

  return (
    <SSRProvider>
      <Head>
        <title>{pageDescription}</title>
      </Head>
      <Spinner show={submittingNewQuestion || isFiltering || submittingNewAnswer} pageWide />
      <Modal show={showAnswerSuccessModal}>
        <Modal.Body className="py-5">
          <PageSuccess
            title="Answer Submitted."
            description="Your answer has been submitted successfully"
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
            <nav className={cls(styles.pageRouteNav, 'd-flex align-items-center gap-2')}>
              <small className="text-pry">
                <Link href={businessUrl}>{props.params.businessName}</Link>
              </small>
              <Icon icon="ic:baseline-greater-than" width={10} />
              <small className="">Ask the Community</small>
            </nav>

            <header className="mb-2">
              <h1 className="mb-3">{props.params.businessName} Questions & Answers</h1>
              <p className="parag mb-5">
                Below are the questions that previous visitors have asked, with answers from
                representatives of {props.params.businessName}&apos; staff and other visitors.
              </p>
              <small className="d-flex gap-3 flex-wrap">
                <>
                  {questionsCount} questions sorted by:
                  {questionFilterNames.map((filter, i) => {
                    return (
                      <span
                        className="text-pry cursor-pointer"
                        style={{
                          textUnderlineOffset: '7px',
                          textDecoration: filterNames.includes(filter) ? 'underline' : 'none',
                        }}
                        key={i}
                        onClick={handleClickFilterName.bind(null, filter)}
                      >
                        {filter}
                      </span>
                    );
                  })}
                </>
              </small>
            </header>

            <ul className={cls(styles.questionsList, 'no-bullets')}>
              {questions?.map(que => (
                <Question
                  {...que}
                  {...props.params}
                  sendSubmitAnswerReq={sendSubmitAnswerReq}
                  submittingNewAnswer={submittingNewAnswer}
                  onAnswerSuccess={setShowAnswerSuccessModal.bind(null, true)}
                  successModalShown={showAnswerSuccessModal}
                  guidelinesModalShown={showQuestionGuidelines}
                  triggerGuidelinesModalOpen={setShowNewAnswerGuidelines.bind(null, true)}
                  setReportedQueId={setReportedQueId}
                  key={que._id}
                />
              ))}
            </ul>

            {/* Pagination */}
            <section className={styles.pagination}>
              <Paginators
                currentPage={currentPage}
                onPageChange={handlePageChange}
                pageCount={pageCount}
              />
              <small>
                Page 1 of {pageCount}, showing {recordsShown} record(s) out of {questionsCount}{' '}
                results
              </small>
            </section>

            {popularQuestions?.length ? (
              <aside className={styles.popularQuestions}>
                <h3 className="mb-4">Popular Questions on {props.params.businessName}</h3>
                <ul className="no-bullets">
                  {popularQuestions?.slice(0, MAX_POPULAR_QUESTIONS)?.map(q => (
                    <PopularQuestion {...q} {...props.params} key={q._id} />
                  ))}
                </ul>
              </aside>
            ) : null}

            <NewQuestionSection
              {...props.params}
              sendSubmitReq={sendSubmitQuestionReq}
              submitting={submittingNewQuestion!}
              pushQuestion={(q: QuestionItemProps) => setQuestions(items => [q, ...items])}
              openGuidelinesModal={setNewQuestionGuidelines.bind(null, true)}
              withUserPhoto
            />
          </div>
        </Layout.Main>

        {/* New question guidelines modal */}
        <PopupInfo
          heading={newQuestionGuidelinesConfig.heading}
          show={showQuestionGuidelines}
          close={setNewQuestionGuidelines.bind(null, false)}
        >
          {newQuestionGuidelinesConfig.body(props.params.businessName)}
        </PopupInfo>

        {/* New answer to question guidelines modal */}
        <PopupInfo
          heading={newAnswersGuidelinesConfig.heading}
          show={showAnswerGuidelines}
          close={setShowNewAnswerGuidelines.bind(null, false)}
        >
          {newAnswersGuidelinesConfig.body(props.params.businessName)}
        </PopupInfo>

        {/* Report question modal */}
        <ReportQA
          show={!!reportedQueId}
          reportType="question"
          reportObjectId={reportedQueId!}
          onReport={handleReportQuestion}
          possibleReasons={questionReportReasonsConfig}
          close={() => setReportedQueId(null)}
        />
      </Layout>
    </SSRProvider>
  );
};

export const getStaticPaths: GetStaticPaths = async function (context) {
  return {
    paths: [
      {
        params: { questionsPageSlug: 'chicken-express_terrell-TX_63930e95aece20c26be873a4' },
      },
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async function (context) {
  try {
    const slug = context.params!.questionsPageSlug as string;
    const { businessName, location, businessId } = parseQuestionsPageSlug(slug, {
      titleCase: true,
    });
    // console.log({ businessName, location, businessId });
    const res = await api.getQuestionsAskedAboutBusiness(businessId, '?sort=-createdAt');
    console.log({ res });

    // If business not found
    if (res.status === 'NOT_FOUND') return { notFound: true };

    return {
      props: {
        questions: (res as Pick<QuestionsPageProps, 'questions'>) || {},
        params: { slug, businessName, location, businessId },
      },
    };
  } catch (err) {
    return {
      props: { error: (err as Error).message },
    };
  }
};

export default QuestionsPage;
