import React, { useState, useMemo, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
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
import { genBusinessPageUrl, parseQuestionsPageSlug } from '../../features/utils/url-utils';
import {
  postingGuidelinesConfig,
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
const questionFilterNames: FilterName[] = ['Most Answered', 'Most Recent', 'Oldest'];

const QUESTIONS_PER_PAGE = 10;

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

  const { currentPage, currentPageData, setPageData, setCurrentPage } = usePaginate<
    QuestionItemProps[]
  >({ defaultCurrentPage: 1 });

  // Modals
  const [showAnswerSuccessModal, setShowAnswerSuccessModal] = useState(false);
  const [showPostingGuidelines, setShowPostingGuidelines] = useState(false);
  const [reportedQueId, setReportedQueId] = useState<null | string>(null);

  const filterQuestions = async (queryStr: string, page?: number) => {
    console.log('onBuild running');
    const res = await sendFilterReq(
      api.getQuestionsAskedAboutBusiness(props.params.businessId, queryStr, {
        page: page || currentPage,
        limit: QUESTIONS_PER_PAGE,
      }),
    );

    if (res.status !== 'SUCCESS') return;
    setQuestions(res.data);
    setQuestionsCount(res.total); // If there are new questions in DB, it will reflect in the number of pages
    console.log('Reponse: ', res);
  };

  const { addNewFilterName, removeFilterName, filterNames, queryStr } =
    useUrlQueryBuilder<FilterName>({
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
  }, []);

  const handleClickFilterName = (filter: FilterName) => {
    (filterNames.includes(filter) ? removeFilterName : addNewFilterName)(filter);

    switch (filter) {
      case 'Most Recent':
        removeFilterName('Oldest');
        break;
      case 'Oldest':
        removeFilterName('Most Recent');
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
  }, [pageCount, currentPage, questionsCount]);

  const popularQuestions = useMemo(() => {
    const items = props.questions.data?.filter(q => q.answersCount > 0);
    items?.sort((prev, next) => (next.answers.length < prev.answers.length ? -1 : 1));
    return items;
  }, [props.questions.data]);

  const businessUrl = useMemo(
    () => genBusinessPageUrl<string>({ slug: props.params.slug }),
    [],
  );

  return (
    <SSRProvider>
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
                  guidelinesModalShown={showPostingGuidelines}
                  triggerGuidelinesModalOpen={setShowPostingGuidelines.bind(null, true)}
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
                Page 1 of {pageCount}, showing {recordsShown} record(s) out of{' '}
                {questionsCount} results
              </small>
            </section>

            <aside className={styles.popularQuestions}>
              <h3 className="mb-4">Popular Questions on {props.params.businessName}</h3>
              <ul className="no-bullets">
                {popularQuestions?.map(q => (
                  <PopularQuestion {...q} {...props.params} key={q._id} />
                ))}
              </ul>
            </aside>

            <NewQuestionSection
              {...props.params}
              sendSubmitReq={sendSubmitQuestionReq}
              submitting={submittingNewQuestion!}
              pushQuestion={(q: QuestionItemProps) => setQuestions(items => [q, ...items])}
              openGuidelinesModal={setShowPostingGuidelines.bind(null, true)}
            />
          </div>
        </Layout.Main>

        {/* Posting guidelines modal */}
        <PopupInfo
          heading={postingGuidelinesConfig.heading}
          show={showPostingGuidelines}
          close={setShowPostingGuidelines.bind(null, false)}
        >
          {postingGuidelinesConfig.body(props.questions.data?.[0].business?.businessName!)}
        </PopupInfo>

        {/* Report question modal */}
        <ReportQA
          show={!!reportedQueId}
          close={() => setReportedQueId(null)}
          onReport={handleReportQuestion}
          possibleReasons={questionReportReasonsConfig}
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
    const res = await api.getQuestionsAskedAboutBusiness(businessId);
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
