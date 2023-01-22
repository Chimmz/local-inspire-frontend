import { Icon } from '@iconify/react';
import cls from 'classnames';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Modal, SSRProvider } from 'react-bootstrap';
import Answer, {
  AnswerProps,
} from '../../features/components/business-listings/questions/Answer';
import { QuestionItemProps } from '../../features/components/business-listings/questions/QuestionItem';
import Layout from '../../features/components/layout';
import PopularQuestions from '../../features/components/question-details-page/PopularQuestions';
import NewQuestionSection from '../../features/components/questions-page/NewQuestionSection';
import LoadingButton from '../../features/components/shared/button/Button';
import AppDropdown from '../../features/components/shared/dropdown/AppDropdown';
import LabelledCheckbox from '../../features/components/shared/LabelledCheckbox';
import Spinner from '../../features/components/shared/spinner/Spinner';
import PageSuccess from '../../features/components/shared/success/PageSuccess';
import TextInput from '../../features/components/shared/text-input/TextInput';
import useClientMiddleware, {
  AuthMiddlewareNextAction,
} from '../../features/hooks/useClientMiddleware';
import useDate from '../../features/hooks/useDate';
import useInput from '../../features/hooks/useInput';
import useRequest from '../../features/hooks/useRequest';
import useSignedInUser from '../../features/hooks/useSignedInUser';
import api from '../../features/library/api';
import { genBusinessPageUrl, getBusinessQuestionsUrl } from '../../features/utils/url-utils';
import { getFullName } from '../../features/utils/user-utils';
import styles from '../../styles/sass/pages/QuestionWIthAnswers.module.scss';

interface Props {
  question?: QuestionItemProps;
  error?: string;
  // params: { questionText: string | undefined };
}

const QuestionWithAnswersPage: NextPage<Props> = function (props) {
  const [question, setQuestion] = useState<QuestionItemProps | undefined>(props.question);
  const { isSignedIn, ...currentUser } = useSignedInUser();
  const { withAuth } = useClientMiddleware();
  const [showAnswerSuccessModal, setShowAnswerSuccessModal] = useState(false);

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
  } = useInput({ init: '', validators: [] });

  if ('promptAnswer' in router.query) {
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

  useEffect(() => {
    if (props.question) setQuestion(props.question);
  }, [props.question]);

  useEffect(() => {
    // if (!('promptAnswer' in router.query)) return;
    // if (question) {
    //   console.log('Exists in router!!!');
    //   const scrollToAndFocusTextarea = async () => {
    //     const textarea = await new Promise<HTMLTextAreaElement | null>(resolve => {
    //       resolve(document.querySelector('textarea'));
    //     });
    //     console.log({ textarea });
    //     textarea?.focus();
    //     window.scrollTo(0, window.innerHeight);
    //   };
    //   scrollToAndFocusTextarea();
    // }
  }, [question, setQuestion]);

  const handleSelectDropdownOption = (evKey: string) => {
    switch (evKey as 'report') {
      case 'report':
        console.log('Reporting...');
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

  const submitNewAnswer: AuthMiddlewareNextAction = async (token: string) => {
    const res = await sendAnswerReq(
      api.addAnswerToBusinessQuestion(props.question!._id, newAnswer, token),
    );

    if (res.status === 'SUCCESS') {
      setQuestion(res.question);
      setShowAnswerSuccessModal(true);
      clearNewAnswerText();
    }
  };

  const mostHelpfulAnswer = useMemo(() => {
    if (!question) return null;

    let answer: AnswerProps | null = question!.answers.reduce((acc, ans) => {
      if (ans.likes.length > acc.likes.length) return ans;
      else return acc;
    }, question!.answers[0]);

    return answer?.likes.length ? answer : null;
  }, [question]);

  // mostHelpfulAnswer = !!mostHelpfulAnswer.likes.length ? mostHelpfulAnswer : null;
  console.log({ mostHelpfulAnswer });

  const externalUrlParams = {
    businessId: question!.business!._id,
    businessName: question!.business!.businessName,
    city: question!.business!.city,
    stateCode: question!.business!.stateCode,
  };
  const businessUrl = useMemo(() => genBusinessPageUrl(externalUrlParams), []);
  const questionsUrl = useMemo(() => getBusinessQuestionsUrl(externalUrlParams), []);

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
          <nav className={cls(styles.pageRouteNav, 'd-flex align-items-center gap-2 mb-4')}>
            <small className="text-pry">
              <Link href={businessUrl}>{props.question?.business?.businessName}</Link>
            </small>
            <Icon icon="ic:baseline-greater-than" width={10} />
            <small className="text-pry">
              <Link href={'/'}>Ask the Community</Link>
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
                <Icon icon="material-symbols:location-on" width={15} color="#2c2c2c" />
                Terrell, TX • 5 contributions
              </small>
            </div>
            <LabelledCheckbox
              onChange={ev => {}}
              label={<small>Notify me of new answers</small>}
            />
            <button
              className="btn btn-outline btn--sm ms-auto"
              onClick={handleClickProvideNewAnswer}
            >
              Provide an answer
            </button>
          </header>

          {/* <h3>2 Answers sorted by most helpful</h3> */}
          <h3>{question?.answersCount} Answers</h3>

          <ul className={cls(styles.answersList, 'no-bullets')}>
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
            onSubmit={ev => {
              ev.preventDefault();
              if (!runNewAnswerValidators().errorExists) withAuth(submitNewAnswer);
            }}
          >
            <h6 className="fs-5 mb-5">
              <strong>
                {' '}
                Hi, Don, can you provide an answer for this traveler's question?
              </strong>
            </h6>
            <Image
              src={isSignedIn ? currentUser.imgUrl! : '/img/default-profile-pic.jpeg'}
              width={40}
              height={40}
              objectFit="cover"
              style={{ borderRadius: '50%' }}
            />
            <TextInput
              as="textarea"
              value={newAnswer}
              onChange={handleChangeNewAnswer}
              validationErrors={newAnswerValidators}
              className="textfield w-100 d-block bg-white u-border-none mb-3"
            />
            <LoadingButton
              className="btn btn-pry"
              isLoading={submittingAnswer}
              textWhileLoading="Submitting..."
            >
              Post your answer
            </LoadingButton>
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
        </Layout.Main>
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
