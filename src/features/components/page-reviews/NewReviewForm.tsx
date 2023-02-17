import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ReviewProps } from './UserReview';

import useInput from '../../hooks/useInput';
import useSignedInUser from '../../hooks/useSignedInUser';
import useFeatureRatings from '../../hooks/useFeatureRatings';
import useFileUploadsWithDescription from '../../hooks/useFileUploadsWithDescription';

import { featuresToRate } from './config';
import navigateTo, * as urlUtils from '../../utils/url-utils';
import { getPast12MonthsWithYear } from '../../utils/date-utils';
import {
  isRequired,
  mustBeSameAs,
  mustNotBeSameAs,
} from '../../utils/validators/inputValidators';
import { toTitleCase } from '../../utils/string-utils';
import api from '../../library/api';
import * as domUtils from '../../utils/dom-utils';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import { Form, Modal } from 'react-bootstrap';
import RadioOptions from '../shared/radio/RadioOptions';
import TextInput from '../shared/text-input/TextInput';
import StarRating from '../shared/star-rating/StarRating';
import FeatureRating from '../shared/feature-rating/FeatureRating';
import PhotoUploadsWithDescription from '../shared/photo-uploads-with-description/PhotoUploadsWithDescription';
import PageSuccess from '../shared/success/PageSuccess';
import styles from './NewReviewForm.module.scss';
import useMiddleware, { AuthMiddlewareNext } from '../../hooks/useMiddleware';
import ShareStrategies from '../shared/social-share/ShareStrategies';
import { useAuthModalContext } from '../../contexts/AuthContext';

interface Props {
  userReview: ReviewProps | null;
  userRecommends: boolean;
  readonly: boolean;
  businessName: string;
  businessId: string;
  submitting: boolean;
  sendReviewRequest(req: any): Promise<any>;
  slug: string;
}

const AUTH_MODAL_TITLE = "You're almost done!";
const AUTH_MODAL_SUBTITLE = 'Choose how you want to post your review.';

function NewReviewForm(props: Props) {
  const { businessId, businessName } = props;
  const [submitted, setSubmitted] = useState(false);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [mainRating, setMainRating] = useState(0);
  const { setAuthTitle, setAuthSubtitle } = useAuthModalContext();

  const { ratingMap, changeFeatureRating } = useFeatureRatings(
    featuresToRate.map(f => (typeof f === 'string' ? f : f.label)),
  );
  const past12Months = useMemo(getPast12MonthsWithYear.bind(null), []);
  const { withAuth } = useMiddleware();

  const {
    inputValue: reviewTitle,
    handleChange: handleChangeReviewTitle,
    runValidators: runReviewTitleValidators,
    validationErrors: reviewTitleValidationErrors,
  } = useInput({
    init: props.userReview?.reviewTitle || '',
    validators: [{ fn: isRequired, params: ['Please enter a brief title'] }],
  });

  const {
    inputValue: mainReview,
    handleChange: handleChangeMainReview,
    runValidators: runMainReviewValidators,
    validationErrors: mainReviewValidationErrors,
  } = useInput({
    init: props.userReview?.review.join(' ') || '',
    validators: [{ fn: isRequired, params: ['Please enter your review for this business'] }],
  });

  const {
    inputValue: visitType,
    handleChange: handleChangeVisitType,
    runValidators: runVisitTypeValidators,
    validationErrors: visitTypeValidationErrors,
  } = useInput({
    init: props.userReview?.visitType || 'Solo',
    validators: [{ fn: isRequired, params: ['Please enter your visit type'] }],
  });

  const {
    inputValue: visitedWhen,
    handleChange: handleChangeVisitedWhen,
    runValidators: runVisitedWhenValidators,
    validationErrors: visitedWhenValidationErrors,
  } = useInput({
    init: props.readonly
      ? [props.userReview?.visitedWhen.month, props.userReview?.visitedWhen.year].join(' ')
      : 'Please select',
    validators: [
      { fn: isRequired, params: [`Please specify when you visited ${businessName}`] },
      {
        fn: mustNotBeSameAs,
        params: ['Please select', `Please specify when you visited ${businessName}`],
      },
    ],
  });

  const {
    inputValue: advice,
    handleChange: handleChangeAdvice,
    runValidators: runAdviceValidators,
    validationErrors: adviceValidationErrors,
  } = useInput({
    init: props.userReview?.adviceToFutureVisitors || '',
    validators: [{ fn: isRequired, params: ['Please enter a brief title'] }],
  });

  const {
    inputValue: userAcceptedTerms,
    handleChange: handleChangeUserAcceptedTerms,
    runValidators: runUserAcceptedTermsValidators,
    validationErrors: userAcceptedTermsValidationErrors,
  } = useInput({
    init: '',
    validators: [
      { fn: mustBeSameAs, params: ['yes', 'Please accept our Terms and Conditions'] },
    ],
  });

  const {
    uploads,
    pushNewUpload,
    editUploadedItem,
    deleteUpload,
    newFile,
    setNewFile,
    onChange: handleChangeFile,
  } = useFileUploadsWithDescription(
    props.userReview?.images.map(upl => ({
      id: upl._id,
      img: { url: upl.photoUrl },
      description: upl.description,
    })),
  );

  useEffect(() => {
    setAuthTitle!(AUTH_MODAL_TITLE);
    setAuthSubtitle!(AUTH_MODAL_SUBTITLE);
    // On unmount
    return () => {
      setAuthTitle!('');
      setAuthSubtitle!('');
    };
  }, []);

  const validateFields = function () {
    const validationResults = [
      runReviewTitleValidators(),
      runMainReviewValidators(),
      runVisitTypeValidators(),
      runVisitedWhenValidators(),
      runAdviceValidators(),
      runUserAcceptedTermsValidators(),
    ];
    console.log(validationResults);

    if (validationResults.some(result => result.errorExists)) {
      domUtils.scrollToElement('.invalid-feedback');
      console.log('Cannot submit review because of v-errors');
      return false;
    }
    return true;
  };

  const submitReview: AuthMiddlewareNext = async (token: string) => {
    if (props.readonly) return;
    if (!validateFields()) return;

    const rawFiles = uploads.map(item => item.img.rawFile) as File[];
    const photoDescriptions = uploads.map(item => item.description) as string[];
    const formData = new FormData();

    formData.append('businessRating', String(mainRating));
    formData.append('recommends', props.userRecommends ? 'yes' : 'no');
    formData.append('reviewTitle', reviewTitle);
    formData.append('review', mainReview);
    formData.append('visitType', visitType);
    formData.append('visitedWhen', visitedWhen);
    formData.append('adviceToFutureVisitors', advice);
    formData.append('featureRatings', JSON.stringify(ratingMap));
    rawFiles.forEach(file => formData.append('photos', file));
    formData.append('photoDescriptions', JSON.stringify(photoDescriptions));

    const res = await props.sendReviewRequest(
      api.reviewBusiness({ businessId, token, formData }),
    );
    console.log(res);
    if (res?.status === 'SUCCESS') setSubmitted(true);
  };

  return (
    <>
      <Modal show={submitted} centered backdrop="static">
        <Modal.Body>
          <PageSuccess
            title="Thank you."
            description={`Your review on ${businessName} has been added successfully.`}
            className="mb-5 pt-2"
          />
          <div className="success-actions d-flex flex-column mx-auto gap-3 px-4 pb-4">
            <Link href={urlUtils.genBusinessPageUrl<string>({ slug: props.slug })} passHref>
              <a className="btn btn--lg btn-pry">Continue</a>
            </Link>
            {/* <ShareStrategies
            /> */}
            <button className="btn btn--lg btn-gray">Share on Facebook</button>
            <button className="btn btn--lg btn-gray">Share on Twitter</button>
          </div>
        </Modal.Body>
      </Modal>

      <form
        className={styles.form}
        onSubmit={ev => {
          ev.preventDefault();
          withAuth(submitReview);
        }}
      >
        <div className="que-group d-flex align-items-center gap-5 mb-0 position-relative">
          <label htmlFor="" className="">
            Leave a rating
          </label>
          <StarRating
            initialValue={props.userReview?.businessRating || 0}
            starSize="xlg"
            className="d-flex xy-center my-5"
            tooltip={false}
            onRate={setMainRating}
            readonly={props.readonly}
          />
        </div>

        <div className="que-group">
          <TextInput
            type="text"
            value={reviewTitle}
            label="Your review title"
            placeholder="Summarize your visit or highlight an interesting detail (short and sweet)"
            onChange={handleChangeReviewTitle}
            className="textfield"
            validationErrors={reviewTitleValidationErrors}
            readonly={props.readonly}
          />
        </div>

        <div className="que-group">
          <TextInput
            type="text"
            as="textarea"
            value={mainReview}
            label="Your review"
            placeholder="Summarize your visit or highlight an interesting detail (short and sweet)"
            onChange={handleChangeMainReview}
            className="textfield w-100"
            validationErrors={mainReviewValidationErrors}
            readonly={props.readonly}
          />
        </div>

        <div className="que-group">
          <label>What sort of visit was this?</label>
          <RadioOptions
            options={['Solo', 'Couples', 'Family', 'Friends', 'Business']}
            as="btn"
            name="visitType"
            value={visitType}
            onChange={handleChangeVisitType}
            readonly={props.readonly}
          />
          <Form.Control.Feedback type="invalid" className="d-block">
            {visitTypeValidationErrors[0]?.msg}
          </Form.Control.Feedback>
        </div>

        <div className="que-group">
          <Form.Label>When did you visit?</Form.Label>
          <Form.Select
            className="textfield w-max-content"
            isInvalid={!!visitedWhenValidationErrors.length}
            value={visitedWhen}
            onChange={handleChangeVisitedWhen}
            style={{ pointerEvents: props.readonly ? 'none' : 'all' }}
          >
            <option value="">Please select</option>
            {past12Months.map(m => (
              <option value={m} key={m}>
                {m}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid" className="d-block">
            {visitedWhenValidationErrors[0]?.msg}
          </Form.Control.Feedback>
        </div>

        <div className="que-group">
          <label className="mb-5">Click to select a rating</label>
          <FeatureRating
            features={featuresToRate}
            ratings={
              props.userReview?.featureRatings.map(obj => obj.rating) ||
              Object.values(ratingMap)
            }
            onRate={changeFeatureRating}
            readonly={props.readonly}
          />
        </div>

        <div className="que-group">
          <TextInput
            type="text"
            value={advice}
            label="What tip or advice do you have for visitors?"
            placeholder="What tip or advice do you have for visitors?"
            onChange={handleChangeAdvice}
            className="textfield"
            validationErrors={adviceValidationErrors}
            readonly={props.readonly}
          />
        </div>

        <div className="que-group">
          <label className="">Have photos of this business? Want to share? (optional)</label>
          <div className="d-flx gap-2 align-items-center flex-wrap">
            <button
              className={cls(
                `btn btn-outline-sec btn-sm mb-3 d-${!props.readonly ? 'block' : 'none'}`,
              )}
              type="button"
              onClick={setShowPhotoUploadModal.bind(null, !props.readonly)}
            >
              <Icon icon="fluent-mdl2:photo-2-add" width={20} /> Add photo
            </button>

            <div className={cls(styles.uploadsPreview, 'd-flex', 'gap-2')}>
              {uploads.map(({ img, id, description }) => (
                <div className={cls(styles.imgPreview, 'position-relative')} key={id}>
                  <Image
                    src={img.url!}
                    width={80}
                    height={80}
                    objectFit="cover"
                    style={{ borderRadius: '2px' }}
                  />
                  <button
                    className={cls(
                      styles.imgPreviewCancel,
                      'fs-1 xy-center',
                      props.readonly && 'd-none',
                    )}
                    onClick={deleteUpload.bind(null, id)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <PhotoUploadsWithDescription
          uploads={uploads}
          pushNewUpload={pushNewUpload}
          editUploadedItem={editUploadedItem}
          deleteUpload={deleteUpload}
          newFile={newFile}
          setNewFile={setNewFile}
          onChange={handleChangeFile}
          show={showPhotoUploadModal}
          close={setShowPhotoUploadModal.bind(null, false)}
        />

        <div className={cls('que-group', props.readonly && 'd-none')}>
          <label htmlFor="i-accept" className="d-flex gap-3">
            <Form.Check
              id="i-accept"
              value={userAcceptedTerms}
              onChange={ev => {
                ev.target.value = ev.target.checked ? 'yes' : 'no';
                handleChangeUserAcceptedTerms(ev);
              }}
              readOnly={props.readonly}
            />
            <small>
              I certify that this review is based on my own experience and is my genuine
              opinion of this business, and that I have no personal or business relationship
              with this establishment, and have not been offered any incentive or payment
              originating from the establishment to write this review. I understand that
              localinspire has a zero-tolerance policy on fake reviews. Terms and Conditions
            </small>
          </label>
          <Form.Control.Feedback type="invalid" className="d-block">
            {userAcceptedTermsValidationErrors[0]?.msg}
          </Form.Control.Feedback>
        </div>

        <button
          className={cls(props.readonly && 'd-none', 'btn btn-pry btn--lg')}
          type="submit"
        >
          Submit review
        </button>
      </form>
    </>
  );
}

export default NewReviewForm;
