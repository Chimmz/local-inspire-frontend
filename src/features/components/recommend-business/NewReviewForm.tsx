import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { monthsOfTheYear } from '../../data/constants';

import useInput from '../../hooks/useInput';
import useSignedInUser from '../../hooks/useSignedInUser';
import useFeatureRatings from '../../hooks/useFeatureRatings';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/useRequest';

import { featuresToRate } from './config';
import api from '../../library/api';
import cls from 'classnames';

import { Icon } from '@iconify/react';
import Radio from '../shared/radio/Radio';
import TextInput from '../shared/text-input/TextInput';
import StarRating from '../shared/star-rating/StarRating';
import FeatureRating from '../shared/feature-rating/FeatureRating';
import styles from './NewReviewForm.module.scss';
import PhotoUploadsWithDescription from '../shared/photo-uploads-with-description/PhotoUploadsWithDescription';
import useFileUploadsWithDescription from '../../hooks/useFileUploadsWithDescription';
import {
  isRequired,
  mustBeSameAs,
  mustNotBeSameAs,
} from '../../utils/validators/inputValidators';
import navigateTo from '../../utils/url-utils';
import Spinner from '../shared/spinner/Spinner';

interface Props {
  sendReviewRequest: (req: any) => Promise<any>;
  refreshReviews(): void;
}

function NewReviewForm(props: Props) {
  const router = useRouter();
  const [, , businessId] = (router.query.businessInfo as string).split('_');
  console.log({ businessId });

  const { isSignedIn, accessToken } = useSignedInUser({
    onSigngOut: navigateTo.bind(null, '/', router),
  });
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);

  const [mainRating, setMainRating] = useState(0);
  const { ratingMap, changeFeatureRating } = useFeatureRatings(
    featuresToRate.map(f => f.label),
  );

  const {
    inputValue: reviewTitle,
    handleChange: handleChangeReviewTitle,
    runValidators: runReviewTitleValidators,
    validationErrors: reviewTitleValidationErrors,
    setValidationErrors: setReviewTitleValidationErrors,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: ['Please enter a brief title'] }],
  });

  const {
    inputValue: mainReview,
    handleChange: handleChangeMainReview,
    runValidators: runMainReviewValidators,
    validationErrors: mainReviewValidationErrors,
    setValidationErrors: setMainReviewValidationErrors,
  } = useInput({
    init: '',
    validators: [
      { fn: isRequired, params: ['Please enter your review of this business'] },
    ],
  });

  const {
    inputValue: sortOfVisit,
    handleChange: handleChangeSortOfVisit,
    runValidators: runSortOfVisitValidators,
    validationErrors: sortOfVisitValidationErrors,
    setValidationErrors: setSortOfVisitValidationErrors,
  } = useInput({
    init: 'Solo',
    validators: [
      { fn: isRequired, params: ['Please enter your review of this business'] },
    ],
  });

  const {
    inputValue: visitedWhen,
    handleChange: handleChangeVisitedWhen,
    runValidators: runVisitedWhenValidators,
    validationErrors: visitedWhenValidationErrors,
    setValidationErrors: setVisitedWhenValidationErrors,
  } = useInput({
    init: 'Please select',
    validators: [
      { fn: isRequired, params: ['Please enter your review of this business'] },
      {
        fn: mustNotBeSameAs,
        params: ['Please select', 'Please enter your review of this business'],
      },
    ],
  });

  const {
    inputValue: advice,
    handleChange: handleChangeAdvice,
    runValidators: runAdviceValidators,
    validationErrors: adviceValidationErrors,
  } = useInput({
    init: '',
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
    uploadsData,
    pushNewUpload,
    editUploadedItem,
    deleteUpload,
    newFile,
    setNewFile,
    handleChangeFile,
  } = useFileUploadsWithDescription();

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async ev => {
    ev.preventDefault();

    const validationResults = [
      runReviewTitleValidators(),
      runMainReviewValidators(),
      runSortOfVisitValidators(),
      runVisitedWhenValidators(),
      runAdviceValidators(),
      runUserAcceptedTermsValidators(),
    ];
    console.log(validationResults);

    if (validationResults.some(result => result.errorExists))
      return console.log('Cannot submit review because of v-errors');

    const body = {
      businessRating: mainRating,
      reviewTitle,
      review: mainReview,
      visitType: sortOfVisit,
      visitedWhen,
      featuresRating: ratingMap,
      adviceToFutureVisitors: advice,
      photosWithDescription: uploadsData,
    };
    console.log(body);
    const res = await props.sendReviewRequest(
      api.reviewBusiness({ businessId, token: accessToken!, ...body }),
    );
    console.log(res);
    if (res.status === 'SUCCESS') props.refreshReviews();
  };

  const validUploadsCount = uploadsData.reduce((accum, upload) => {
    return !!upload.description!.length ? accum + 1 : accum;
  }, 0);

  return (
    <>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className="que-group d-flex align-items-center mb-0">
          <label htmlFor="" className="flex-grow-1">
            Leave a rating
          </label>
          <StarRating
            ratingValue={4}
            starSize="xlg"
            className="d-flex xy-center my-5"
            tooltip={false}
            onRate={setMainRating}
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
          />
        </div>

        <div className="que-group">
          <label>What sort of visit was this?</label>
          <Radio
            options={['Solo', 'Couples', 'Family', 'Friends', 'Business']}
            as="btn"
            name="sortOfVisit"
            value={sortOfVisit}
            onChange={handleChangeSortOfVisit}
          />
          <Form.Control.Feedback type="invalid" className="d-block">
            {sortOfVisitValidationErrors[0]?.msg}
          </Form.Control.Feedback>
        </div>

        <div className="que-group">
          <Form.Label>When did you visit?</Form.Label>
          <Form.Select
            className="textfield"
            isInvalid={!!visitedWhenValidationErrors.length}
            value={visitedWhen}
            onChange={handleChangeVisitedWhen}
          >
            <option value="">Please select</option>
            {monthsOfTheYear.map(m => (
              <option value={`${m} 2022`} key={m}>{`${m} 2022`}</option>
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
            ratings={Object.values(ratingMap)}
            onRate={changeFeatureRating}
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
          />
        </div>

        <div className="que-group">
          <label className="">
            Have photos of this business? Want to share? (optional)
          </label>

          <div className="d-flex gap-2 align-items-center">
            <button
              className="btn btn-outline-sec btn-sm"
              type="button"
              onClick={setShowPhotoUploadModal.bind(null, true)}
            >
              <Icon icon="fluent-mdl2:photo-2-add" width={20} /> Add photo
            </button>
            <small
              style={{ color: '#039903', display: validUploadsCount ? 'block' : 'none' }}
            >
              ({validUploadsCount} photos uploaded)
            </small>
          </div>
        </div>

        <PhotoUploadsWithDescription
          uploadsData={uploadsData}
          pushNewUpload={pushNewUpload}
          editUploadedItem={editUploadedItem}
          deleteUpload={deleteUpload}
          newFile={newFile}
          setNewFile={setNewFile}
          handleChangeFile={handleChangeFile}
          show={showPhotoUploadModal}
          close={setShowPhotoUploadModal.bind(null, false)}
        />

        <div className="que-group">
          <label htmlFor="i-accept" className="d-flex gap-3">
            <Form.Check
              id="i-accept"
              value={userAcceptedTerms}
              onChange={ev => {
                ev.target.value = ev.target.checked ? 'yes' : 'no';
                handleChangeUserAcceptedTerms(ev);
              }}
            />
            <small>
              I certify that this review is based on my own experience and is my genuine
              opinion of this business, and that I have no personal or business
              relationship with this establishment, and have not been offered any
              incentive or payment originating from the establishment to write this
              review. I understand that localinspire has a zero-tolerance policy on fake
              reviews. Terms and Conditions
            </small>
          </label>
          <Form.Control.Feedback type="invalid" className="d-block">
            {userAcceptedTermsValidationErrors[0]?.msg}
          </Form.Control.Feedback>
        </div>
        <button className="btn btn-pry btn--lg" type="submit">
          Submit review
        </button>
      </form>
    </>
  );
}

export default NewReviewForm;
