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
  [key: string]: any;
}

function TextInput({ validationErrors, type = 'text', ...nativeProps }: TextInputProps) {
  const hasError = !!validationErrors?.length;
  return (
    <Fragment>
      {nativeProps.label ? <Form.Label>{nativeProps.label}</Form.Label> : null}
      <Form.Control type={type} {...nativeProps} isInvalid={hasError} />

      {validationErrors ? (
        <Form.Control.Feedback type="invalid">
          {validationErrors?.[0]?.msg}
        </Form.Control.Feedback>
      ) : null}
    </Fragment>
  );
}

export default TextInput;
