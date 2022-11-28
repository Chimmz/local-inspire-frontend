import React, { Fragment } from 'react';
import { ValidationFeedback } from '../../../utils/validators/types';
import { Form } from 'react-bootstrap';

interface TextInputProps {
  type?: 'text' | 'email' | 'password' | 'textarea' | 'date';
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  readonly?: true;
  validationErrors?: ValidationFeedback[];
  label?: string;
  autoFocus?: boolean;
  [key: string]: any;
}

function TextInput(props: TextInputProps) {
  const { validationErrors, type = 'text', autoFocus, ...nativeProps } = props;
  const hasError = !!validationErrors?.length;

  return (
    <Fragment>
      {nativeProps.label ? <Form.Label>{nativeProps.label}</Form.Label> : null}
      <Form.Control
        type={type}
        {...nativeProps}
        isInvalid={hasError}
        autoFocus={autoFocus}
      />

      {validationErrors ? (
        <Form.Control.Feedback type="invalid">
          {validationErrors?.[0]?.msg}
        </Form.Control.Feedback>
      ) : null}
    </Fragment>
  );
}

export default TextInput;
