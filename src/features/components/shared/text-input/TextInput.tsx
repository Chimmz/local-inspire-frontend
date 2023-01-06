import React, { Fragment } from 'react';
import { ValidationFeedback } from '../../../utils/validators/types';
import { Form } from 'react-bootstrap';

interface TextInputProps {
  type?: 'text' | 'email' | 'password' | 'textarea' | 'date';
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  readonly?: boolean;
  validationErrors?: ValidationFeedback[];
  label?: string;
  autoFocus?: boolean;
  as?: 'input' | 'textarea';
  onInput?: React.ChangeEventHandler<HTMLInputElement> | (() => void);
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement> | (() => void);
  [key: string]: any;
}

function TextInput(props: TextInputProps) {
  const { validationErrors, type = 'text', autoFocus, readonly, ...nativeProps } = props;
  const hasError = !!validationErrors?.length;

  return (
    <Fragment>
      {nativeProps.label ? <Form.Label>{nativeProps.label}</Form.Label> : null}
      <Form.Control
        type={type}
        {...nativeProps}
        isInvalid={hasError}
        autoFocus={autoFocus}
        onInput={props.onInput || (() => {})}
        onKeyUp={props.onKeyUp || (() => {})}
        readOnly={props.readonly}
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
