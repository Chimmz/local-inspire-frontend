import { useState, useMemo } from 'react';
import { Form, Modal } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

import { ReviewProps } from './UserReview';

import useInput from '../../hooks/useInput';
import useSignedInUser from '../../hooks/useSignedInUser';
import useFeatureRatings from '../../hooks/useFeatureRatings';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/useRequest';

import { featuresToRate } from './config';
import {
  isRequired,
  mustBeSameAs,
  mustNotBeSameAs,
} from '../../utils/validators/inputValidators';
import navigateTo, * as urlUtils from '../../utils/url-utils';
import { getPast12MonthsWithYear } from '../../utils/date-utils';
import { toTitleCase } from '../../utils/string-utils';
import api from '../../library/api';
import * as jsUtils from '../../utils';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import Radio from '../shared/radio/Radio';
import TextInput from '../shared/text-input/TextInput';
import StarRating from '../shared/star-rating/StarRating';
import FeatureRating from '../shared/feature-rating/FeatureRating';
import styles from './NewReviewForm.module.scss';
import PhotoUploadsWithDescription from '../shared/photo-uploads-with-description/PhotoUploadsWithDescription';
import useFileUploadsWithDescription from '../../hooks/useFileUploadsWithDescription';
import PageSuccess from '../shared/success/PageSuccess';

interface Props {
  businessName: string;
  location: string;
  businessId: string;
  readonly: boolean;
  userRecommends: boolean;
  submitting: boolean;
  userReview: ReviewProps | null;
  sendReviewRequest(req: any): Promise<any>;
}

function NewReviewForm(props: Props) {
  const { businessId } = props;

  const [submitted, setSubmitted] = useState(false);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [mainRating, setMainRating] = useState(0);
  const { ratingMap, changeFeatureRating } = useFeatureRatings(
    featuresToRate.map(f => {
      if (typeof f === 'string') return f;
      return f.label;
    }),
  );
  const businessNameTitle = toTitleCase(props.businessName.split('-').join(' '));
  const past12Months = useMemo(() => getPast12MonthsWithYear(), []);

  const router = useRouter();

  const { accessToken } = useSignedInUser({
    onSignOut: navigateTo.bind(null, '/', router),
  });

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
    init: props.userReview?.review || '',
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
      // { fn: isRequired, params: [`Please specify when you visited ${businessNameTitle}`] },
      {
        fn: mustNotBeSameAs,
        params: ['Please select', `Please specify when you visited ${businessNameTitle}`],
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
  } = useFileUploadsWithDescription();
  // props.userReview?.images.map(upl => ({ ...upl, id: upl._id })),

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async ev => {
    ev.preventDefault();
    if (props.readonly) return;

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
      jsUtils.scrollToElement('.invalid-feedback');
      return console.log('Cannot submit review because of v-errors');
    }

    const formData = new FormData();

    const rawFiles = uploads.map(item => item.img.rawFile) as File[];
    const photoDescriptions = uploads.map(item => item.description) as string[];

    formData.append('businessRating', String(mainRating));
    formData.append('reviewTitle', reviewTitle);
    formData.append('review', mainReview);
    formData.append('visitType', visitType);
    formData.append('visitedWhen', visitedWhen);
    formData.append('adviceToFutureVisitors', advice);
    formData.append('featureRatings', JSON.stringify(ratingMap));
    rawFiles.forEach(file => formData.append('photos', file));
    formData.append('photoDescriptions', JSON.stringify(photoDescriptions));

    let content = [
      'businessRating',
      'reviewTitle',
      'review',
      'visitType',
      'visitedWhen',
      'adviceToFutureVisitors',
      'featureRatings',
      'photos',
      'photoDescriptions',
    ].map(key => formData.get(key));

    console.log({ content });

    const res = await props.sendReviewRequest(
      api.reviewBusiness({ businessId, token: accessToken!, formData }),
    );
    console.log(res);

    if (res.status !== 'SUCCESS') return;
    setSubmitted(true);

    // const body = {
    //   businessRating: mainRating,
    //   reviewTitle,
    //   review: mainReview,
    //   visitType: visitType,
    //   visitedWhen,
    //   featuresRating: ratingMap,
    //   adviceToFutureVisitors: advice,
    //   photosWithDescription: uploads,
    //   recommends: props.userRecommends ? 'yes' : 'no',
    // };
    // console.log(body);

    // const res = await props.sendReviewRequest(
    //   api.reviewBusiness({ businessId, token: accessToken!, ...body }),
    // );
    // console.log(res);

    // if (res.status !== 'SUCCESS') return;
    // setSubmitted(true);
  };

  const validUploadsCount = useMemo(() => {
    return uploads.reduce((accum, upl) => (!!upl.description!.length ? accum + 1 : accum), 0);
  }, [uploads]);

  return (
    <>
      <Modal show={submitted} centered backdrop="static">
        <Modal.Body>
          <PageSuccess
            title="Thank you."
            description={`Your review on ${businessNameTitle} has been added successfully.`}
          />
          <div className="success-actions d-flex flex-column mx-auto gap-3 px-4 pb-4">
            <button className="btn btn--lg btn-pry">
              <Link
                href={urlUtils.genBusinessPageUrl({
                  businessId: props.businessId,
                  businessName: props.businessName,
                  city: props.location.split('-')[0],
                  stateCode: props.location.split('-')[1],
                })}
              >
                Continue
              </Link>
            </button>
            <button className="btn btn--lg btn-gray">Share on Facebook</button>
            <button className="btn btn--lg btn-gray">Share on Twitter</button>
          </div>
        </Modal.Body>
      </Modal>

      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className="que-group d-flex align-items-center gap-5 mb-0">
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
          <Radio
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
              className="btn btn-outline-sec btn-sm d-block mb-3"
              type="button"
              onClick={setShowPhotoUploadModal.bind(null, !props.readonly)}
            >
              <Icon icon="fluent-mdl2:photo-2-add" width={20} /> Add photo
            </button>
            {/* <small
              style={{ color: '#039903', display: validUploadsCount ? 'block' : 'none' }}
            >
              ({validUploadsCount} photos uploaded)
            </small> */}
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
                    className={cls(styles.imgPreviewCancel, 'fs-1', 'xy-center')}
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
