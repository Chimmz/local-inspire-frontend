import cls from 'classnames';
import React, { ReactNode, useState } from 'react';
import { Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import styles from './RadioOptions.module.scss';

interface RadioProps {
  as: 'circle' | 'btn';
  options: Array<string | { label: ReactNode; value: string | number }>;
  layout?: 'block' | 'inline';
  className?: string;
  gap?: string;
  name: string;
  label?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  readonly?: boolean;
  validationError?: string;
}

function RadioOptions(props: RadioProps) {
  const { options, layout = 'inline' } = props;
  const parentClassMap = { btn: styles.btnRadioOptions, circle: styles.circleRadioOptions };

  return (
    <>
      <Form.Control.Feedback type="invalid" className="d-block mb-2">
        {props.validationError}
      </Form.Control.Feedback>
      <div
        className={cls(parentClassMap[props.as], styles[layout], props.className)}
        style={{ gap: props.gap || (props.layout === 'inline' ? '1.5rem' : '1rem') }}
      >
        {options.map(optn => {
          const label = typeof optn === 'string' ? optn : optn.label;
          const value = typeof optn === 'string' ? optn : optn.value;

          const itemClassMap = {
            btn: 'btn btn-outline btn-lg',
            circle: cls(styles.circleRadioOptions),
          };

          return (
            <label htmlFor={String(value)} key={uuidv4()}>
              {props.label}
              <input
                type="radio"
                id={String(value)}
                className={styles.radioInput}
                checked={props.value?.toLowerCase() === String(value).toLowerCase()}
                // checked
                name={props.name}
                value={value}
                onChange={!props.readonly ? props.onChange : () => {}}
              />
              <span
                className={itemClassMap[props.as]}
                style={{ pointerEvents: props.readonly ? 'none' : 'all' }}
              >
                {label}
              </span>
            </label>
          );
        })}
      </div>
    </>
  );
}

export default RadioOptions;
