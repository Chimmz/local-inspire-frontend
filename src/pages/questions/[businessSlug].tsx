import React, { useState, useMemo, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { Modal, SSRProvider } from 'react-bootstrap';
import { QuestionItemProps } from '../../features/components/business-listings/questions/QuestionItem';
import Layout from '../../features/components/layout';
import api from '../../features/library/api';
import { genBusinessPageUrl, parseBusinessSlug } from '../../features/utils/url-utils';

import { Icon } from '@iconify/react';

import cls from 'classnames';
import Question from '../../features/components/questions-page/Question';
import Paginators from '../../features/components/shared/pagination/Paginators';
import NewQuestionSection from '../../features/components/questions-page/NewQuestionSection';
import useUrlQueryBuilder from '../../features/hooks/useUrlQueryBuilder';
import useRequest from '../../features/hooks/useRequest';
import Spinner from '../../features/components/shared/spinner/Spinner';
import styles from '../../styles/sass/pages/BusinessQuestionsPage.module.scss';
import usePaginate from '../../features/hooks/usePaginate';
import PageSuccess from '../../features/components/shared/success/PageSuccess';
import useDate from '../../features/hooks/useDate';
import PopularQuestion from '../../features/components/questions-page/PopularQuestion';
import { useRouter } from 'next/router';

interface QuestionsPageProps {
  questions: {
    status: 'SUCCESS' | 'FAIL' | 'ERROR';
    total?: number;
    data?: QuestionItemProps[] | undefined;
    error?: { msg: string };
  };
  params: {
    businessName: string;
    businessId: string;
    location: string;
    slug: string;
  };
}
type FilterName = 'Most Answered' | 'Most Recent' | 'Oldest' | 'Page' | string;
const questionFilterNames: FilterName[] = ['Most Answered', 'Most Recent', 'Oldest'];

const QUESTIONS_PER_PAGE = 10;

const QuestionsPage: NextPage<QuestionsPageProps> = function (props) {
  const { businessId, businessName } = props.params;
  const [questions, setQuestions] = useState<QuestionItemProps[]>(props.questions.data || []);

  const router = useRouter();

  const { send: sendQuestionFilterReq, loading: isFilteringQuestions } = useRequest({
    autoStopLoading: true,
  });
  const { send: sendSubmitQuestionReq, loading: submittingNewQuestion } = useRequest({
    autoStopLoading: true,
  });
  const { send: sendPageReq, loading: isPaginating } = useRequest({
    autoStopLoading: true,
  });

  const { formatDate } = useDate(undefined, { month: 'short', year: 'numeric' });
  const { currentPage, currentPageData, setPageData, setCurrentPage } = usePaginate<
    QuestionItemProps[]
  >({
    defaultCurrentPage: 1,
  });

  const { send: sendSubmitAnswerReq, loading: submittingNewAnswer } = useRequest({
    autoStopLoading: true,
  });

  const [showAnswerSuccessModal, setShowAnswerSuccessModal] = useState(false);

  console.log({ currentPageData });

  const { addNewFilterName, removeFilterName, filterNames, queryStr } =
    useUrlQueryBuilder<FilterName>({
      autoBuild: true,
      filtersConfig: new Map([
        ['Most Answered', { sort: '-answersCount', match: '', page: '' }],
        ['Most Recent', { sort: '-createdAt', match: '', page: '' }],
        ['Oldest', { sort: '+createdAt', match: '', page: '' }],
        ['Page', { sort: '', match: '', page: 0 }],
      ]),
      onBuild: async (queryStr: string) => {
        if (!queryStr.length) return;
        console.log('onBuild running');
        const res = await sendQuestionFilterReq(
          api.getQuestionsAskedAboutBusiness(props.params.businessId, queryStr, {
            page: currentPage,
            limit: QUESTIONS_PER_PAGE,
          }),
        );
        if (res.status === 'SUCCESS') setQuestions(res.data);
        console.log('Reponse: ', res);
      },
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
    console.log(newPage);
    const res = await sendPageReq(
      api.getQuestionsAskedAboutBusiness(businessId, queryStr, {
        page: newPage,
        limit: QUESTIONS_PER_PAGE,
      }),
    );
    if (res.status === 'SUCCESS') {
      setQuestions(res.data as QuestionItemProps[]);
    }
  };

  const pageCount = useMemo(
    () => Math.ceil(QUESTIONS_PER_PAGE / props.questions.total!),
    [props.questions.total],
  );
  console.log({ pageCount });

  const popularQuestions = useMemo(
    () => props.questions.data?.filter(q => q.answersCount > 0),
    [props.questions.data],
  );
  const businessUrl = useMemo(
    () => genBusinessPageUrl<string>({ slug: props.params.slug }),
    [],
  );

  return (
    <SSRProvider>
      <Spinner
        show={
          isFilteringQuestions || submittingNewQuestion || isPaginating || submittingNewAnswer
        }
        pageWide
      />
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
                {props.questions.total} questions sorted by:
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
                key={que._id}
              />
            ))}
          </ul>

          <section className={styles.pagination}>
            <Paginators
              currentPage={currentPage}
              onPageChange={handlePageChange}
              pageCount={pageCount}
            />
            <small>
              Page 1 of {pageCount}, showing {currentPageData?.length} record(s) out of{' '}
              {props.questions.total} results
            </small>
          </section>

          <aside className={styles.popularQuestions}>
            <h3 className="mb-4">Popular Questions on {props.params.businessName}</h3>
            <ul className="no-bullets">
              {popularQuestions?.map(q => (
                <PopularQuestion {...q} {...props.params} />
              ))}
            </ul>
          </aside>

          <NewQuestionSection
            {...props.params}
            sendSubmitReq={sendSubmitQuestionReq}
            submitting={submittingNewQuestion!}
            pushQuestion={(q: QuestionItemProps) => setQuestions(items => [q, ...items])}
          />
        </Layout.Main>
      </Layout>
    </SSRProvider>
  );
};

export const getStaticPaths: GetStaticPaths = async function (context) {
  return {
    paths: [
      {
        params: { businessSlug: 'chicken-express_terrell-TX_63930e95aece20c26be873a4' },
      },
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async function (context) {
  try {
    const slug = context.params!.businessSlug as string;

    const { businessName, location, businessId } = parseBusinessSlug(slug, {
      titleCase: true,
    });
    // console.log({ businessName, location, businessId });
    const res = await api.getQuestionsAskedAboutBusiness(businessId);
    console.log({ res });

    if (res.status === 'NOT_FOUND') return { notFound: true }; // If business not found

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
