import React, { Fragment } from 'react';
import { ValidationFeedback } from '../../../utils/validators/types';
import { Form, FormControlProps } from 'react-bootstrap';
import cls from 'classnames';

// let a: FormControlProps;
// a.onChange

interface TextInputProps extends FormControlProps {
  as?: 'input' | 'textarea';
  type?: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'date';
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  style?: React.CSSProperties;
  readonly?: boolean;
  validationErrors?: ValidationFeedback[];
  label?: React.ReactNode;
  autoFocus?: boolean;
  onFocusSelect?: boolean;
  onInput?: React.ChangeEventHandler<HTMLInputElement> | (() => void);
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement> | (() => void);
  className?: string;
  [key: string]: any;
}

function TextInput(props: TextInputProps) {
  const {
    validationErrors,
    type = 'text',
    autoFocus,
    readonly,
    onFocusSelect,
    ...nativeProps
  } = props;
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
        onFocus={ev => {
          props.onFocus?.(ev);
          onFocusSelect && ev.target.select();
        }}
        readOnly={props.readonly}
        className={cls('textfield', props.className)}
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
