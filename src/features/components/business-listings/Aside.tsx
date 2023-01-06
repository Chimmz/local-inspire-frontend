import React, { useEffect, useRef, useState, FormEventHandler } from 'react';

import { Icon } from '@iconify/react';
import styles from './Aside.module.scss';
import { Form } from 'react-bootstrap';
import LabelledCheckbox from '../shared/LabelledCheckbox';
import useInput from '../../hooks/useInput';
import { minLength } from '../../utils/validators/inputValidators';
import TextInput from '../shared/text-input/TextInput';

const MIN_QUE_LENGTH = 10;

function Aside() {
  const getNotifiedCheckboxRef = useRef<HTMLInputElement | null>(null);

  const {
    inputValue: question,
    handleChange,
    validationErrors,
    runValidators: runQuestionValidators,
  } = useInput({
    init: '',
    validators: [
      {
        fn: minLength,
        params: [MIN_QUE_LENGTH, `Please enter up to ${MIN_QUE_LENGTH} characters`],
      },
    ],
  });

  const handleCheckGetNotified: React.ChangeEventHandler<HTMLInputElement> = ev => {
    console.log();
  };

  const handleSubmitQuestion: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();
    if (runQuestionValidators().errorExists) return;
    // const getNotified = getNotifiedCheckboxRef.current!.checked;
  };

  return (
    <aside className={styles.right}>
      <section className={styles.about}>
        <h2>About the Business</h2>
        <p className="parag mb-3 mt-3">
          At Crystals Cabin we strive on comfort, cleanliness, and an all around good
          time. We welcome you to join us for a weekend getaway.
        </p>
        <p className="parag mb-5">
          <strong> Fannies BBQ</strong> was established in 1985.
        </p>
        <button className="btn btn-outline-sec d-block w-100">
          Send owner a message
        </button>
      </section>

      <section className={styles.getUpdated}>
        <h2> Get Updated! </h2>
        <p className="parag mb-4 mt-3">
          Get updates, specials and more by saving this business to one of your lists...
        </p>
        <button className="btn btn-outline-sec d-block w-100 d-flex xy-center gap-2">
          <Icon icon="material-symbols:view-list" width={22} /> Save to a list
        </button>
      </section>

      <section className={styles.businessObjectives}>
        <h2 className="mb-4">We as a family owned business</h2>
        <ul className="no-bullets d-flex flex-column gap-3">
          <li className="d-flex gap-4">
            <Icon icon="material-symbols:done-rounded" color="#e87525" width={35} />
            Seek to grow trust and growth in our community and businesses.
          </li>
          <li className="d-flex gap-4">
            <Icon icon="material-symbols:done-rounded" color="#e87525" width={35} />
            Seek to grow trust and growth in our community and businesses.
          </li>
          <li className="d-flex gap-4">
            <Icon icon="material-symbols:done-rounded" color="#e87525" width={35} />
            Seek to grow trust and growth in our community and businesses.
          </li>
        </ul>
      </section>

      <form className={styles.askNewQuestion} onSubmit={handleSubmitQuestion}>
        <h2 className="mb-4">Ask a question</h2>
        <small className="mb-2 d-block">
          Get quick answers from Fannies BBQ staff and past visitors.
        </small>

        <TextInput
          as="textarea"
          value={question}
          className="textfield w-100"
          onChange={handleChange}
          validationErrors={validationErrors}
        />

        <LabelledCheckbox
          label={<small>Get notified about new answers to your questions.</small>}
          onChange={handleCheckGetNotified}
          className="my-4"
        />
        <button
          className={`btn btn${!question.length ? '-outline' : ''}-pry d-block w-100`}
          type="submit"
        >
          Post question
        </button>
      </form>
    </aside>
  );
}

export default Aside;
