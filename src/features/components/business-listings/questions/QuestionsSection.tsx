import React, { useState, useMemo, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import api from '../../../library/api';
import { postingGuidelinesConfig } from './config';
import { newQuestionValidatorsConfig } from './config';
import cls from 'classnames';

import useInput from '../../../hooks/useInput';
import useRequest from '../../../hooks/useRequest';
import useSignedInUser from '../../../hooks/useSignedInUser';
import useMiddleware, { MiddlewareNext } from '../../../hooks/useMiddleware';

import { Icon, listIcons } from '@iconify/react';
import LoadingButton from '../../shared/button/Button';
import TextInput from '../../shared/text-input/TextInput';
import LabelledCheckbox from '../../shared/LabelledCheckbox';
import Accordion from 'react-bootstrap/Accordion';
import CustomAccordionToggle from '../../shared/accordion/CustomAccordionToggle';
import QuestionItem, { QuestionItemProps } from './QuestionItem';
import styles from './QuestionsSection.module.scss';
import BusinessesToConsider from './BusinessesToConsider';
import {
  genQuestionDetailsPageUrl,
  genRecommendBusinessPageUrl,
  getBusinessQuestionsUrl,
} from '../../../utils/url-utils';
import { BusinessProps } from '../../business-results/Business';
import GuidelinesPopup from '../../PopupInfo';
import { useRouter } from 'next/router';
import Paginators from '../../shared/pagination/Paginators';
import usePaginate from '../../../hooks/usePaginate';
import * as domUtils from '../../../utils';

interface Props {
  show: boolean;
  questions: QuestionItemProps[] | undefined;
  business: BusinessProps | undefined;
  slug: string;
  questionsCount: number;
  sendRequest: (req: Promise<any>) => any;
  loading: boolean;
}

const QUESTIONS_PER_PAGE = 5;
const MAX_PAGES = 3;
const MAX_ITEMS = MAX_PAGES * QUESTIONS_PER_PAGE; // 15

const QuestionsSection = function (props: Props) {
  const [questions, setQuestions] = useState(props.questions);
  const [questionsCount, setQuestionsCount] = useState(props.questionsCount);

  const { withAuth } = useMiddleware();
  const currentUser = useSignedInUser();

  const { send: sendSubmitQuestionReq, loading: isPostingQuestion } = useRequest({
    autoStopLoading: true,
  });

  const [showPostingGuidelines, setShowPostingGuidelines] = useState(false);
  const btnCloseAccordionRef = useRef<HTMLButtonElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const {
    inputValue: newQuestion,
    handleChange: handleChangeNewQuestion,
    validationErrors: newQuestionValidators,
    runValidators: runNewQuestionValidators,
    clearInput: clearNewQuestionText,
  } = useInput({ init: '', validators: [...newQuestionValidatorsConfig] });

  const { currentPage, currentPageData, setCurrentPage, setPageData, getPageData } =
    usePaginate<QuestionItemProps[]>({ init: { 1: props.questions } });

  const postNewQuestion: MiddlewareNext = async (token?: string) => {
    const data = await sendSubmitQuestionReq(
      api.askQuestionAboutBusiness(newQuestion, props.business?._id!, token!),
    );
    console.log({ data });

    if (data?.status) {
      setQuestions(items => [data.question, ...(items || [])]);
      clearNewQuestionText();
      btnCloseAccordionRef.current!.click();
    }
  };

  const handleSubmitNewQuestion: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();
    if (runNewQuestionValidators().errorExists) return;
    withAuth(postNewQuestion);
  };

  const handlePageChange = async function (newPage: number) {
    console.log({ newPage });

    // Check if data for this page has previously been fetched
    if (getPageData(newPage)?.length) {
      setCurrentPage(newPage);
      return domUtils.scrollToElement(sectionRef.current!);
    }
    // Fetch page data
    const req = api.getQuestionsAskedAboutBusiness(props.business?._id!, undefined, {
      page: newPage,
      limit: QUESTIONS_PER_PAGE,
    });
    const res = await props.sendRequest(req);
    console.log(res);

    if (res.status === 'SUCCESS') {
      setPageData(newPage, res.data); // Populate the new page
      setCurrentPage(newPage); // Make the populated page be the current page

      domUtils.scrollToElement(sectionRef.current!); // Scroll to the section top
      if (res.total !== questionsCount) setQuestionsCount(res.total); // In case total has changed
    }
  };

  const totalPages = useMemo(() => {
    const itemsExceedMaxItems = questionsCount >= MAX_ITEMS;
    return itemsExceedMaxItems ? MAX_PAGES : Math.ceil(questionsCount / QUESTIONS_PER_PAGE);
  }, [questionsCount, MAX_ITEMS, MAX_PAGES, QUESTIONS_PER_PAGE]);

  // console.log({ totalPages });

  const questionsPageUrl = useMemo(
    () => getBusinessQuestionsUrl<string>({ slug: props.slug }),
    [],
  );

  const showWith = useCallback(
    (showClassName: string) => (!props.show ? 'd-none' : showClassName),
    [props.show],
  );

  return (
    // This is the Q&A header section containing the Ask question accordion
    <>
      <Accordion
        defaultActiveKey="0"
        className={cls(styles.queSectionHeading, showWith('d-grid'))}
        ref={sectionRef}
      >
        <h2 className="">Questions & Answers</h2>
        {questions?.length ? (
          <Link href={questionsPageUrl} passHref>
            <a className="text-pry w-max-content">See all {questionsCount} questions</a>
          </Link>
        ) : null}

        <CustomAccordionToggle
          eventKey="1"
          className={cls(styles.btnNewQuestion, 'btn btn-bg-none no-bg-hover text-pry')}
          contentOnExpand={
            <span className="btn btn-bg-none text-pry gap-1" ref={btnCloseAccordionRef}>
              <Icon icon="material-symbols:expand-less" width={20} /> Close
            </span>
          }
        >
          <Icon icon="material-symbols:add" width={20} />
          Ask new question
        </CustomAccordionToggle>
        <Accordion.Collapse
          eventKey="1"
          className={cls('mt-5', styles.collapsedContent)}
          appear
        >
          <form className={cls(styles.newQuestionForm)} onSubmit={handleSubmitNewQuestion}>
            <small className="fs-4">
              <strong className="mb-3 d-inline-block"> Got Questions?</strong> Get answers
              from <strong>{props.business?.businessName}</strong> staff and past visitors.
            </small>

            <div className={styles.defaultImg}>
              <Image
                src={currentUser?.imgUrl || '/img/default-profile-pic.jpeg'}
                width={35}
                height={35}
                style={{ borderRadius: '50%' }}
              />
            </div>

            <TextInput
              as="textarea"
              value={newQuestion}
              onChange={handleChangeNewQuestion}
              validationErrors={newQuestionValidators}
              className="textfield w-100 d-block"
            />
            <small className="mb-3 d-block">
              Note: your question will be posted publicly here and on the Questions & Answers
              page <Icon icon="ic:baseline-info" style={{ marginLeft: '1rem' }} />
            </small>

            <div className="d-flex align-items-end gap-3">
              <LoadingButton
                className="btn btn-pry mt-3 w-max-content"
                type="submit"
                isLoading={isPostingQuestion}
                textWhileLoading="Posting..."
              >
                Post question
              </LoadingButton>
              <button
                type="button"
                className="btn btn-gray"
                style={{ gridColumn: '2' }}
                onClick={() => {
                  // console.log(btnCloseAccordionRef.current);
                  btnCloseAccordionRef.current?.click();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </Accordion.Collapse>
      </Accordion>

      {/* Page questions */}
      {currentPageData?.map(que => (
        <QuestionItem
          {...que}
          show={props.show && !!questions?.length}
          key={que._id}
          business={props.business}
          showPostingGuidelines={setShowPostingGuidelines.bind(null, true)}
        />
      ))}

      {/* If there are no questions to show */}
      {!questions?.length && (
        <div className={cls(showWith('d-flex'), 'flex-column align-items-center')}>
          <h5 className="text-center mb-4 fs-3" style={{ color: 'gray' }}>
            Do you have a new question to ask about {props.business?.businessName}?
          </h5>
          <Link
            href={getBusinessQuestionsUrl<string>({
              slug: router.query.businessPageSlug! as string,
            })}
            passHref
          >
            <a className="btn btn-sec w-max-content">Ask a new question</a>
          </Link>
        </div>
      )}

      {currentPageData?.length ? (
        <div
          className={cls('align-items-center justify-content-between', showWith('d-flex'))}
        >
          <Paginators
            currentPage={1}
            onPageChange={handlePageChange}
            pageCount={totalPages}
          />
          {questionsCount > MAX_ITEMS ? (
            <Link href={questionsPageUrl} passHref>
              <a className="btn btn-sm btn-bg-none text-pry w-max-content">
                See all {questionsCount} questions
              </a>
            </Link>
          ) : null}
        </div>
      ) : null}

      <GuidelinesPopup
        show={showPostingGuidelines}
        close={setShowPostingGuidelines.bind(null, false)}
        heading={postingGuidelinesConfig.heading}
      >
        {postingGuidelinesConfig.body(props.business?.businessName!)}
      </GuidelinesPopup>
    </>
  );
};

export default QuestionsSection;

// #include <stdio.h>

// int isDaphneNumber(int n) {
//     if (n < 0) return 0;

//     int minFactor = NULL, maxFactor=NULL;
//     int factorsCount = 0;
//     int i;
//     for (int i=2; i < n; i++) {
//         if (n % i != 0) continue;
//         maxFactor = i;
//         if (minFactor == NULL) minFactor = i;
//     }
//     // Here, both factors will be 0, 0 if n is prime.
//     if (!minFactor || !maxFactor) return 0;

//     int diff = maxFactor - minFactor;
//     if (diff * diff < n) return 1;

//     return 0;
// }
